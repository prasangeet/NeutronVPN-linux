"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Bell, Lock, Wifi } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications">("general")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    autoConnect: true,
    autoSelectServer: false,
    killSwitch: true,
    splitTunneling: false,
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    protocol: "wireguard",
    encryption: "aes-256",
    dnsLeak: true,
    ipv6Leak: true,
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    connectionAlerts: true,
    disconnectionAlerts: true,
    serverUpdates: true,
    promotions: false,
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }
    setIsLoading(false)
  }, [router])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaveSuccess(true)
    setIsSaving(false)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow">
          <div className="w-12 h-12 neutron-particle"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 neutron-particle opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 neutron-particle opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="bg-transparent">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your VPN experience</p>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-accent/20 border border-accent/50 rounded-lg text-accent text-sm">
            Settings saved successfully!
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/30">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "general"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wifi className="w-4 h-4 inline mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "notifications"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Notifications
          </button>
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="space-y-6">
                {/* Auto Connect */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Auto Connect</h3>
                    <p className="text-sm text-muted-foreground">Automatically connect to VPN on startup</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={generalSettings.autoConnect}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, autoConnect: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* Auto Select Server */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Auto Select Server</h3>
                    <p className="text-sm text-muted-foreground">Automatically choose the fastest server</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={generalSettings.autoSelectServer}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, autoSelectServer: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* Kill Switch */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Kill Switch</h3>
                    <p className="text-sm text-muted-foreground">Block all traffic if VPN connection drops</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={generalSettings.killSwitch}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, killSwitch: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* Split Tunneling */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Split Tunneling</h3>
                    <p className="text-sm text-muted-foreground">Route specific apps outside the VPN</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={generalSettings.splitTunneling}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, splitTunneling: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="space-y-6">
                {/* Protocol Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">VPN Protocol</label>
                  <div className="space-y-2">
                    {["wireguard", "openvpn", "ikev2"].map((protocol) => (
                      <label
                        key={protocol}
                        className="flex items-center p-3 bg-muted/10 rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
                      >
                        <input
                          type="radio"
                          name="protocol"
                          value={protocol}
                          checked={securitySettings.protocol === protocol}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, protocol: e.target.value })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="ml-3 capitalize font-medium">{protocol}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Encryption Level */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Encryption Level</label>
                  <div className="space-y-2">
                    {["aes-128", "aes-256"].map((encryption) => (
                      <label
                        key={encryption}
                        className="flex items-center p-3 bg-muted/10 rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
                      >
                        <input
                          type="radio"
                          name="encryption"
                          value={encryption}
                          checked={securitySettings.encryption === encryption}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, encryption: e.target.value })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="ml-3 font-medium">{encryption}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* DNS Leak Protection */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">DNS Leak Protection</h3>
                    <p className="text-sm text-muted-foreground">Prevent DNS queries from leaking</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.dnsLeak}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, dnsLeak: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* IPv6 Leak Protection */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">IPv6 Leak Protection</h3>
                    <p className="text-sm text-muted-foreground">Prevent IPv6 address leaks</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.ipv6Leak}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, ipv6Leak: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="space-y-6">
                {/* Connection Alerts */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Connection Alerts</h3>
                    <p className="text-sm text-muted-foreground">Notify when VPN connects</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.connectionAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        connectionAlerts: e.target.checked,
                      })
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* Disconnection Alerts */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Disconnection Alerts</h3>
                    <p className="text-sm text-muted-foreground">Notify when VPN disconnects</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.disconnectionAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        disconnectionAlerts: e.target.checked,
                      })
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* Server Updates */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Server Updates</h3>
                    <p className="text-sm text-muted-foreground">Notify about new servers and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.serverUpdates}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        serverUpdates: e.target.checked,
                      })
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* Promotions */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Promotions</h3>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and deals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.promotions}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        promotions: e.target.checked,
                      })
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </main>
  )
}
