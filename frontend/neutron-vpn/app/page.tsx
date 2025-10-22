"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Make sure window is available (Electron renderer)
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("auth_token");

        if (token) {
          // Only redirect if token exists
          router.replace("/dashboard");
          return;
        }
      } catch (err) {
        console.error("Error reading localStorage:", err);
      } finally {
        // Always stop loading after check
        setIsLoading(false);
      }
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow">
          <div className="w-12 h-12 neutron-particle"></div>
        </div>
      </div>
    );
  }

  // If no token, show login/register screen
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 neutron-particle opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 neutron-particle opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 neutron-ring opacity-10 animate-orbit"></div>
      </div>

      <div className="relative z-10 text-center max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-balance">NeutronVPN</h1>
        <p className="text-muted-foreground mb-8">
          Secure, fast, and private VPN service
        </p>

        <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur">
          <div className="space-y-4">
            <p className="text-foreground/80 mb-6">
              Get started with NeutronVPN today
            </p>
            <Link href="/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}
