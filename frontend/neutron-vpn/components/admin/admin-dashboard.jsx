"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import UserManagement from "@/components/admin/user-management"
import ServerManagement from "@/components/admin/server-management"
import Analytics from "@/components/admin/analytics"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border/30">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users" },
            { id: "servers", label: "Servers" },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "servers" && <ServerManagement />}
        {activeTab === "analytics" && <Analytics />}
      </main>
    </div>
  )
}

function AdminOverview() {
  const stats = [
    { label: "Total Users", value: "12,543", change: "+12%" },
    { label: "Active Connections", value: "3,421", change: "+8%" },
    { label: "Total Servers", value: "156", change: "+2" },
    { label: "Avg Speed", value: "87.4 Mbps", change: "+5%" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border-primary/20 bg-card/50 backdrop-blur-xl p-6">
          <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
          <p className="text-sm text-accent">{stat.change} from last month</p>
        </Card>
      ))}
    </div>
  )
}
