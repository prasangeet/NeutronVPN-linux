"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, User, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [stats, setStats] = useState({
    joinDate: "January 15, 2024",
    totalDataUsed: "245.8 GB",
    accountStatus: "Active",
    subscriptionPlan: "Premium",
  })

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }

    const username = localStorage.getItem("user_username") || "User"
    setProfileData((prev) => ({ ...prev, username }))
    setIsLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    localStorage.setItem("user_username", profileData.username)
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
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-accent/20 border border-accent/50 rounded-lg text-accent text-sm">
            Profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Stats */}
          <div className="space-y-4">
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-center font-bold text-lg mb-4">{profileData.username}</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Account Status</p>
                  <p className="font-medium text-accent">{stats.accountStatus}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Subscription Plan</p>
                  <p className="font-medium">{stats.subscriptionPlan}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Member Since</p>
                  <p className="font-medium">{stats.joinDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Data Used</p>
                  <p className="font-medium">{stats.totalDataUsed}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Information */}
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <Input
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="bg-input border-border/50"
                  />
                </div>
              </div>
            </Card>

            {/* Change Password */}
            <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <Input
                      name="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={profileData.currentPassword}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    className="bg-input border-border/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-input border-border/50"
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
