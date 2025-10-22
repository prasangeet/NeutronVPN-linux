"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MOCK_SERVERS = [
  { id: 1, name: "US-East-1", location: "New York", status: "online", load: 45, users: 234 },
  { id: 2, name: "US-West-1", location: "Los Angeles", status: "online", load: 62, users: 189 },
  { id: 3, name: "EU-West-1", location: "London", status: "online", load: 38, users: 156 },
  { id: 4, name: "AP-SE-1", location: "Singapore", status: "maintenance", load: 0, users: 0 },
]

export default function ServerManagement() {
  const [servers, setServers] = useState(MOCK_SERVERS)

  return (
    <div className="space-y-6">
      <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
        Add Server
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{server.name}</h3>
                <p className="text-sm text-muted-foreground">{server.location}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  server.status === "online" ? "bg-accent/20 text-accent" : "bg-yellow-500/20 text-yellow-500"
                }`}
              >
                {server.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Server Load</p>
                  <p className="text-sm font-semibold text-foreground">{server.load}%</p>
                </div>
                <div className="w-full bg-background/50 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${server.load}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Active Users: <span className="text-accent font-semibold">{server.users}</span>
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full border-primary/30 text-accent hover:bg-primary/10 bg-transparent"
            >
              Manage
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
