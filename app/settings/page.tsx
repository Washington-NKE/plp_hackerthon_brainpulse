"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { User, Bell, Shield, Palette, Download, Trash2, CreditCard, Crown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
// import { ThemeDropdown } from "@/components/ui/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

type PlanType = "free" | "basic" | "premium" | "professional"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyInsights: true,
    coachTips: false,
  })

  // Mock current plan - in real app, this would come from your user data
  const currentPlan: PlanType = "free" // This should come from your user context/database

  const handleExportData = async () => {
    // TODO: Implement data export
    alert("Data export feature coming soon!")
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // TODO: Implement account deletion
      alert("Account deletion feature coming soon!")
    }
  }

  const getPlanDisplayName = (plan: PlanType) => {
    const plans: Record<PlanType, { name: string; color: string }> = {
      free: { name: "Free Forever", color: "bg-gray-100 text-gray-700" },
      basic: { name: "Essential", color: "bg-blue-100 text-blue-700" },
      premium: { name: "Premium", color: "bg-purple-100 text-purple-700" },
      professional: { name: "Professional", color: "bg-amber-100 text-amber-700" }
    }
    return plans[plan]
  }

  // Helper function to check if plan has premium features
  const hasPremiumFeatures = (plan: PlanType): boolean => {
    return plan === 'premium' || plan === 'professional'
  }

  // Helper function to check if plan has basic+ features
  const hasBasicPlusFeatures = (plan: PlanType): boolean => {
    return plan !== 'free'
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </motion.div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={session?.user?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={session?.user?.email || ""} disabled />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription & Billing */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Subscription & Billing
                  </CardTitle>
                  <CardDescription>Manage your plan and billing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        {currentPlan === "free" ? <User className="w-6 h-6 text-white" /> :
                         currentPlan === "professional" ? <Crown className="w-6 h-6 text-white" /> :
                         <CreditCard className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Current Plan</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getPlanDisplayName(currentPlan).color}>
                            {getPlanDisplayName(currentPlan).name}
                          </Badge>
                          {currentPlan === "premium" && (
                            <Badge variant="secondary" className="text-xs">
                              Most Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/pricing">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">
                        {currentPlan === 'free' ? '3' : '∞'}
                      </div>
                      <div className="text-sm text-gray-600">Daily Entries</div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">
                        {currentPlan === 'free' ? '7' : 
                         currentPlan === 'basic' ? '30' : '∞'}
                      </div>
                      <div className="text-sm text-gray-600">Days History</div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-900">
                        {hasPremiumFeatures(currentPlan) ? '✓' : '✗'}
                      </div>
                      <div className="text-sm text-gray-600">AI Insights</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Settings */}
            {/* <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Theme</Label>
                      <div className="mt-2">
                        <ThemeDropdown />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div> */}

            {/* Notification Settings */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Choose what notifications you'd like to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="daily-reminder">Daily Mood Reminder</Label>
                      <p className="text-sm text-gray-500">Get reminded to log your daily mood</p>
                    </div>
                    <Switch
                      id="daily-reminder"
                      checked={notifications.dailyReminder}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReminder: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-insights">Weekly Insights</Label>
                      <p className="text-sm text-gray-500">Receive weekly mood pattern summaries</p>
                    </div>
                    <Switch
                      id="weekly-insights"
                      checked={notifications.weeklyInsights}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyInsights: checked })}
                      disabled={currentPlan === 'free'}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="coach-tips">AI Coach Tips</Label>
                      <p className="text-sm text-gray-500">
                        Get helpful tips from your AI coach
                        {!hasPremiumFeatures(currentPlan) && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Premium Feature
                          </Badge>
                        )}
                      </p>
                    </div>
                    <Switch
                      id="coach-tips"
                      checked={notifications.coachTips}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, coachTips: checked })}
                      disabled={!hasPremiumFeatures(currentPlan)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy & Data */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Data
                  </CardTitle>
                  <CardDescription>Manage your data and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export Your Data</Label>
                      <p className="text-sm text-gray-500">
                        Download all your mood entries and data
                        {currentPlan === 'free' && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Basic+ Feature
                          </Badge>
                        )}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleExportData}
                      disabled={!hasBasicPlusFeatures(currentPlan)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="border-t pt-4">
                    <Alert className="border-red-200 bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Delete Account:</strong> This will permanently delete your account and all associated
                        data. This action cannot be undone.
                        <Button variant="destructive" size="sm" className="mt-2" onClick={handleDeleteAccount}>
                          Delete Account
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}