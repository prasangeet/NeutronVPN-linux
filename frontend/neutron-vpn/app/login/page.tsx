"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { login } from "@/services/userServices/apiService"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Redirect to dashboard if already logged in
    const storedUsername = localStorage.getItem("access_token")
    if (storedUsername) {
      router.push("/dashboard")
    }
  }
  , [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate inputs
      if (!username || !password) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      // Simulate API call
      const userData = await login({ username, password })
      console.log("Logged in user:", userData)
      // Store auth token and username (in production, these would come from your backend)
      localStorage.setItem("username", username)

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 neutron-particle opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 neutron-particle opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your NeutronVPN account</p>
        </div>

        <Card className="p-8 border-primary/20 bg-card/50 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-input border-border/50"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          <Link href="/" className="hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
