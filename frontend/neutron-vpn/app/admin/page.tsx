"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, Users, Server, BarChart3, Trash2, Edit2, Plus, Search } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  joinDate: string
  dataUsed: string
}

interface ServerData {
  id: string
  name: string
  country: string
  status: "online" | "offline"
  users: number
  load: number
  uptime: string
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinDate: "2024-01-15",
    dataUsed: "45.2 GB",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    joinDate: "2024-02-20",
    dataUsed: "12.8 GB",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    joinDate: "2024-01-10",
    dataUsed: "0 GB",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "active",
    joinDate: "2024-03-05",
    dataUsed: "78.5 GB",
  },
]

const MOCK_SERVERS: ServerData[] = [
  { id: "us-1", name: "New York", country: "United States", status: "online", users: 234, load: 45, uptime: "99.9%" },
  { id: "uk-1", name: "London", country: "United Kingdom", status: "online", users: 189, load: 62, uptime: "99.8%" },
  { id: "jp-1", name: "Tokyo", country: "Japan", status: "online", users: 156, load: 38, uptime: "99.95%" },
  { id: "au-1", name: "Sydney", country: "Australia", status: "offline", users: 0, load: 0, uptime: "98.5%" },
]

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "servers">("overview")
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [servers, setServers] = useState<ServerData[]>(MOCK_SERVERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS)

  useEffect(() => {
    // Check if user is admin (in production, verify with backend)
    const token = localStorage.getItem("auth_token")
    const isAdmin = localStorage.getItem("is_admin") === "true"

    if (!token || !isAdmin) {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [router])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const handleDeleteServer = (id: string) => {
    setServers(servers.filter((server) => server.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_email")
    localStorage.removeItem("user_name")
    localStorage.removeItem("is_admin")
    router.push("/")
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

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const onlineServers = servers.filter((s) => s.status === "online").length
  const totalConnections = servers.reduce((sum, s) => sum + s.users, 0)

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, servers, and system analytics</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/30">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("servers")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "servers"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Server className="w-4 h-4 inline mr-2" />
            Servers
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                  <p className="text-3xl font-bold">{activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Online Servers</p>
                  <p className="text-3xl font-bold">{onlineServers}</p>
                </div>
                <Server className="w-8 h-8 text-primary opacity-50" />
              </div>
            </Card>

            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Connections</p>
                  <p className="text-3xl font-bold">{totalConnections}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-accent opacity-50" />
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border/50"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>

            <Card className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/20">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Join Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Data Used</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-3 text-sm">{user.name}</td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.status === "active"
                                ? "bg-accent/20 text-accent"
                                : "bg-muted/20 text-muted-foreground"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">{user.joinDate}</td>
                        <td className="px-6 py-3 text-sm">{user.dataUsed}</td>
                        <td className="px-6 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Servers Tab */}
        {activeTab === "servers" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1"></div>
              <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Server
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servers.map((server) => (
                <Card key={server.id} className="p-6 border-primary/20 bg-card/50 backdrop-blur">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{server.name}</h3>
                      <p className="text-sm text-muted-foreground">{server.country}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        server.status === "online" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {server.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/10 rounded">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Users Connected</p>
                      <p className="font-bold">{server.users}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Load</p>
                      <p className="font-bold">{server.load}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                      <p className="font-bold">{server.uptime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent text-destructive hover:text-destructive"
                      onClick={() => handleDeleteServer(server.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
