"use client"

import { Card } from "@/components/ui/card"

export default function ConnectionStats({ isConnected }) {
  return (
    <>
      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm mb-2">Download Speed</p>
            <p className="text-2xl font-bold text-accent">{isConnected ? "94.2" : "0"} Mbps</p>
          </div>
          <div className="w-full bg-background/50 rounded-full h-2">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ${isConnected ? "w-4/5" : "w-0"}`}
            />
          </div>
        </div>
      </Card>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm mb-2">Upload Speed</p>
            <p className="text-2xl font-bold text-accent">{isConnected ? "45.8" : "0"} Mbps</p>
          </div>
          <div className="w-full bg-background/50 rounded-full h-2">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-accent to-secondary transition-all duration-300 ${isConnected ? "w-1/2" : "w-0"}`}
            />
          </div>
        </div>
      </Card>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
        <div>
          <p className="text-muted-foreground text-sm mb-2">Data Used</p>
          <p className="text-2xl font-bold text-accent">{isConnected ? "2.4" : "0"} GB</p>
          <p className="text-xs text-muted-foreground mt-2">This session</p>
        </div>
      </Card>
    </>
  )
}
