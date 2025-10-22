"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoConnect: true,
    killSwitch: true,
    splitTunneling: false,
    notifications: true,
    theme: "dark",
  })

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        {/* Account Settings */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value="user@example.com"
                disabled
                className="bg-input border-border/50 text-muted-foreground"
              />
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
              Change Password
            </Button>
          </div>
        </Card>

        {/* VPN Settings */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">VPN Settings</h2>
          <div className="space-y-4">
            {[
              {
                key: "autoConnect",
                label: "Auto-Connect on Startup",
                desc: "Automatically connect to VPN when app starts",
              },
              { key: "killSwitch", label: "Kill Switch", desc: "Block internet if VPN connection drops" },
              { key: "splitTunneling", label: "Split Tunneling", desc: "Route some apps through VPN, others directly" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    settings[item.key] ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      settings[item.key] ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Preferences */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive connection alerts</p>
              </div>
              <button
                onClick={() => handleToggle("notifications")}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.notifications ? "bg-accent" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    settings.notifications ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
