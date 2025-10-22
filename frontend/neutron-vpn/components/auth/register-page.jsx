"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import NeutronBackground from "@/components/neutron-background"

export default function RegisterPage({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email: formData.email, role: "user" }))
      window.location.href = "/dashboard"
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
          <p className="text-muted-foreground">Join millions of secure users</p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Create Account</h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
