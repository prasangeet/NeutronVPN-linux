"use client"

import { Card } from "@/components/ui/card"

const SERVERS = [
  { id: "us-east-1", name: "New York", country: "USA", flag: "🇺🇸", ping: 12 },
  { id: "us-west-1", name: "Los Angeles", country: "USA", flag: "🇺🇸", ping: 45 },
  { id: "eu-west-1", name: "London", country: "UK", flag: "🇬🇧", ping: 78 },
  { id: "eu-central-1", name: "Frankfurt", country: "Germany", flag: "🇩🇪", ping: 85 },
  { id: "ap-southeast-1", name: "Singapore", country: "Singapore", flag: "🇸🇬", ping: 120 },
  { id: "ap-northeast-1", name: "Tokyo", country: "Japan", flag: "🇯🇵", ping: 135 },
]

export default function ServerSelector({ selectedServer, onSelectServer, isConnected }) {
  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">Select Server</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVERS.map((server) => (
          <button
            key={server.id}
            onClick={() => !isConnected && onSelectServer(server.id)}
            disabled={isConnected}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedServer === server.id
                ? "border-accent bg-accent/10"
                : "border-border/30 bg-background/50 hover:border-primary/50"
            } ${isConnected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{server.flag}</span>
              <span className="text-xs text-muted-foreground">{server.ping}ms</span>
            </div>
            <p className="font-semibold text-foreground">{server.name}</p>
            <p className="text-xs text-muted-foreground">{server.country}</p>
          </button>
        ))}
      </div>
    </Card>
  )
}
