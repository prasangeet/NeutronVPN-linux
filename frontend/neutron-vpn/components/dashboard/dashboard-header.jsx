"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardHeader() {
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-accent to-secondary animate-pulse-glow flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">N</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Neutron VPN
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-foreground hover:text-accent transition-colors">
            Dashboard
          </Link>
          <Link href="/settings" className="text-foreground hover:text-accent transition-colors">
            Settings
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary/30 text-accent hover:bg-primary/10 bg-transparent"
          >
            Logout
          </Button>
        </nav>
      </div>
    </header>
  )
}
