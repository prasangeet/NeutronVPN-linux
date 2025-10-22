"use client"

import { Card } from "@/components/ui/card"

export default function Analytics() {
  const chartData = [
    { day: "Mon", users: 2400, bandwidth: 2210 },
    { day: "Tue", users: 1398, bandwidth: 2290 },
    { day: "Wed", users: 9800, bandwidth: 2000 },
    { day: "Thu", users: 3908, bandwidth: 2108 },
    { day: "Fri", users: 4800, bandwidth: 2176 },
    { day: "Sat", users: 3800, bandwidth: 2500 },
    { day: "Sun", users: 4300, bandwidth: 2100 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Weekly Active Users</h3>
          <div className="space-y-3">
            {chartData.map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">{data.day}</p>
                  <p className="text-sm font-semibold text-foreground">{data.users}</p>
                </div>
                <div className="w-full bg-background/50 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${(data.users / 10000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Bandwidth Usage (GB)</h3>
          <div className="space-y-3">
            {chartData.map((data, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">{data.day}</p>
                  <p className="text-sm font-semibold text-foreground">{data.bandwidth}</p>
                </div>
                <div className="w-full bg-background/50 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
                    style={{ width: `${(data.bandwidth / 2500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
