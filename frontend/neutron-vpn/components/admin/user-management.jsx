"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", joined: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "active", joined: "2024-02-20" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "inactive", joined: "2024-01-10" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", status: "active", joined: "2024-03-05" },
]

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(MOCK_USERS)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSuspend = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "suspended" } : u)))
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
        />
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
          Add User
        </Button>
      </div>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.joined}</td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleSuspend(user.id)}
                      variant="outline"
                      size="sm"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      Suspend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
