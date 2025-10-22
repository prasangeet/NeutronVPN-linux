"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import VPNToggle from "@/components/dashboard/vpn-toggle"
import ServerSelector from "@/components/dashboard/server-selector"
import ConnectionStats from "@/components/dashboard/connection-stats"
import ProtocolSelector from "@/components/dashboard/protocol-selector"

export default function UserDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedServer, setSelectedServer] = useState("us-east-1")
  const [protocol, setProtocol] = useState("wireguard")
  const [connectionTime, setConnectionTime] = useState(0)

  useEffect(() => {
    let interval
    if (isConnected) {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Main VPN Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <VPNToggle isConnected={isConnected} onToggle={setIsConnected} />

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-2">Connection Status</p>
                  <p className="text-3xl font-bold text-foreground mb-4">
                    {isConnected ? "Connected" : "Disconnected"}
                  </p>
                  {isConnected && (
                    <p className="text-accent font-mono text-lg">Connected for {formatTime(connectionTime)}</p>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                  <div className="bg-background/50 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-sm mb-1">Server</p>
                    <p className="text-foreground font-semibold">{selectedServer}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-sm mb-1">Protocol</p>
                    <p className="text-foreground font-semibold uppercase">{protocol}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <ConnectionStats isConnected={isConnected} />
          </div>
        </div>

        {/* Server & Protocol Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServerSelector
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            isConnected={isConnected}
          />
          <ProtocolSelector selectedProtocol={protocol} onSelectProtocol={setProtocol} isConnected={isConnected} />
        </div>
      </main>
    </div>
  )
}
