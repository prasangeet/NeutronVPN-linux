"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import NeutronBackground from "@/components/neutron-background"

export default function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email, role: "user" }))
      window.location.href = "/dashboard"
    }, 1000)
  }

  const handleAdminLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email: "admin@neutron.com", role: "admin" }))
      window.location.href = "/admin"
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NeutronBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-secondary animate-pulse-glow flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">N</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Neutron VPN
            </h1>
          </div>
          <p className="text-muted-foreground">Secure your connection, protect your privacy</p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Welcome Back</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all"
              >
                {isLoading ? "Connecting..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              onClick={handleAdminLogin}
              variant="outline"
              className="w-full border-primary/30 text-accent hover:bg-primary/10 bg-transparent"
            >
              Admin Login
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a dummy frontend. Backend integration coming soon.
        </p>
      </div>
    </div>
  )
}
