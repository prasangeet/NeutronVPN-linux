"use client"

import { Card } from "@/components/ui/card"

const PROTOCOLS = [
  { id: "wireguard", name: "WireGuard", speed: "Fastest", description: "Modern & efficient" },
  { id: "openvpn", name: "OpenVPN", speed: "Fast", description: "Widely compatible" },
  { id: "ikev2", name: "IKEv2", speed: "Very Fast", description: "Mobile friendly" },
]

export default function ProtocolSelector({ selectedProtocol, onSelectProtocol, isConnected }) {
  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
      <h3 className="text-xl font-bold text-foreground mb-4">VPN Protocol</h3>

      <div className="space-y-3">
        {PROTOCOLS.map((protocol) => (
          <button
            key={protocol.id}
            onClick={() => !isConnected && onSelectProtocol(protocol.id)}
            disabled={isConnected}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedProtocol === protocol.id
                ? "border-accent bg-accent/10"
                : "border-border/30 bg-background/50 hover:border-primary/50"
            } ${isConnected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-foreground">{protocol.name}</p>
              <span className="text-xs bg-primary/20 text-accent px-2 py-1 rounded">{protocol.speed}</span>
            </div>
            <p className="text-xs text-muted-foreground">{protocol.description}</p>
          </button>
        ))}
      </div>
    </Card>
  )
}
