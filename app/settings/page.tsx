"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { User, Bell, Shield, Palette, Download, Trash2, CreditCard, Crown, Sparkles, Heart, Zap, Brain, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ThemeProvider } from "@/components/theme-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

type PlanType = "free" | "basic" | "premium" | "professional"
type GenderType = "male" | "female" | "default"
type Particle = { id: number; x: number; y: number; size: number; speed: number; color: string }

interface UserSettings {
  id: string
  name: string
  email: string
  gender?: GenderType
  plan: PlanType
  notifications: {
    dailyReminder: boolean
    weeklyInsights: boolean
    coachTips: boolean
  }
  preferences: {
    theme: GenderType
    privacy: {
      dataExportEnabled: boolean
    }
  }
}

const ThemeSelector = ({ currentTheme, onThemeChange }: { currentTheme: GenderType, onThemeChange: (theme: GenderType) => void }) => {
  const themes = [
    { name: "default" as GenderType, label: "Neutral", icon: Brain, color: "from-blue-500 to-purple-500" },
    { name: "male" as GenderType, label: "Masculine", icon: Zap, color: "from-blue-600 to-cyan-500" },
    { name: "female" as GenderType, label: "Feminine", icon: Heart, color: "from-pink-500 to-orange-400" }
  ]
  
  return (
    <motion.div 
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex space-x-2 glass p-2 rounded-lg">
        {themes.map(theme => {
          const Icon = theme.icon
          return (
            <motion.button
              key={theme.name}
              onClick={() => onThemeChange(theme.name)}
              className={`p-2 rounded-md transition-all relative overflow-hidden ${
                currentTheme === theme.name 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={theme.label}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${theme.color} opacity-20`}
                initial={{ scale: 0 }}
                animate={{ scale: currentTheme === theme.name ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <Icon size={16} className="relative z-10" />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [currentTheme, setCurrentTheme] = useState<GenderType>("default")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  // Fetch user settings on mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!session?.user?.email) return
      
      try {
        setIsLoading(true)
        const response = await fetch('/api/user/settings')
        if (response.ok) {
          const settings = await response.json()
          setUserSettings(settings)
          // Set theme based on user preference or auto-detect from gender
          const themeToUse = settings.preferences?.theme || settings.gender || 'default'
          setCurrentTheme(themeToUse)
        }
      } catch (error) {
        console.error('Failed to fetch user settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserSettings()
  }, [session])

  // Apply theme to document
  useEffect(() => {
    document.body.className = currentTheme
  }, [currentTheme])

  // Generate theme-specific particles
  useEffect(() => {
    const colors = {
      default: ['#3b82f6', '#8b5cf6', '#06b6d4'],
      male: ['#1e40af', '#0ea5e9', '#06b6d4'],
      female: ['#ec4899', '#f97316', '#d946ef']
    }
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      speed: Math.random() * 3 + 2,
      color: colors[currentTheme][Math.floor(Math.random() * colors[currentTheme].length)]
    }))
    setParticles(newParticles)
  }, [currentTheme])

  const handleThemeChange = async (theme: GenderType) => {
    setCurrentTheme(theme)
    
    // Save theme preference to database
    try {
      await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            ...userSettings?.preferences,
            theme
          }
        })
      })
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  const handleNotificationChange = async (key: keyof UserSettings['notifications'], value: boolean) => {
    if (!userSettings) return

    const newNotifications = { ...userSettings.notifications, [key]: value }
    setUserSettings({ ...userSettings, notifications: newNotifications })

    try {
      await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: newNotifications })
      })
    } catch (error) {
      console.error('Failed to update notifications:', error)
    }
  }

  const handleProfileUpdate = async (data: { name: string }) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setUserSettings(prev => prev ? { ...prev, name: data.name } : null)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mood-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE'
      })

      if (response.ok) {
        // Redirect to sign-out or home page
        window.location.href = '/auth/signin'
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
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

  const hasPremiumFeatures = (plan: PlanType): boolean => {
    return plan === 'premium' || plan === 'professional'
  }

  const hasBasicPlusFeatures = (plan: PlanType): boolean => {
    return plan !== 'free'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading your settings...</p>
          </motion.div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className={`min-h-screen relative overflow-hidden mood-bg-pattern energy-particles ${currentTheme}`}>
        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full opacity-30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
              }}
              animate={{
                y: [0, -120, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: particle.speed * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />

        <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
          {/* Animated Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift"
              >
                Settings
              </motion.h1>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
              </motion.div>
            </div>
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your account and preferences
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Profile Settings */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 mood-gradient opacity-5 animate-gradient-shift"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      <User className="w-5 h-5" />
                    </motion.div>
                    Profile
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        defaultValue={userSettings?.name || ""} 
                        onBlur={(e) => {
                          if (e.target.value !== userSettings?.name) {
                            handleProfileUpdate({ name: e.target.value })
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={userSettings?.email || ""} 
                        disabled 
                      />
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button disabled={isSaving} className="btn-ripple">
                      <AnimatePresence mode="wait">
                        {isSaving ? (
                          <motion.div
                            key="saving"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Saving...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="save"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription & Billing */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover border-l-4 border-l-purple-500 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 energy-gradient opacity-10 animate-pulse"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CreditCard className="w-5 h-5" />
                    </motion.div>
                    Subscription & Billing
                  </CardTitle>
                  <CardDescription>Manage your plan and billing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        {userSettings?.plan === "free" ? <User className="w-6 h-6 text-white" /> :
                         userSettings?.plan === "professional" ? <Crown className="w-6 h-6 text-white" /> :
                         <CreditCard className="w-6 h-6 text-white" />}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Current Plan</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={userSettings?.plan ? getPlanDisplayName(userSettings.plan).color : ""}>
                            {userSettings?.plan ? getPlanDisplayName(userSettings.plan).name : "Loading..."}
                          </Badge>
                          {userSettings?.plan === "premium" && (
                            <Badge variant="secondary" className="text-xs">
                              Most Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard/pricing">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          {userSettings?.plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {[
                      {
                        label: "Daily Entries",
                        value: userSettings?.plan === 'free' ? '3' : '∞'
                      },
                      {
                        label: "Days History", 
                        value: userSettings?.plan === 'free' ? '7' : 
                               userSettings?.plan === 'basic' ? '30' : '∞'
                      },
                      {
                        label: "AI Insights",
                        value: userSettings?.plan ? (hasPremiumFeatures(userSettings.plan) ? '✓' : '✗') : '...'
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="text-center p-3 bg-white/60 rounded-lg border border-gray-200"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl font-bold text-gray-900">
                          {item.value}
                        </div>
                        <div className="text-sm text-gray-600">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 calm-gradient opacity-8 animate-morphing-blob"
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Bell className="w-5 h-5" />
                    </motion.div>
                    Notifications
                  </CardTitle>
                  <CardDescription>Choose what notifications you'd like to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {[
                    {
                      key: 'dailyReminder' as keyof UserSettings['notifications'],
                      label: 'Daily Mood Reminder',
                      description: 'Get reminded to log your daily mood',
                      enabled: true
                    },
                    {
                      key: 'weeklyInsights' as keyof UserSettings['notifications'],
                      label: 'Weekly Insights',
                      description: 'Receive weekly mood pattern summaries',
                      enabled: userSettings?.plan !== 'free'
                    },
                    {
                      key: 'coachTips' as keyof UserSettings['notifications'],
                      label: 'AI Coach Tips',
                      description: 'Get helpful tips from your AI coach',
                      enabled: userSettings?.plan ? hasPremiumFeatures(userSettings.plan) : false
                    }
                  ].map((notification, index) => (
                    <motion.div
                      key={notification.key}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div>
                        <Label htmlFor={notification.key}>{notification.label}</Label>
                        <p className="text-sm text-gray-500">
                          {notification.description}
                          {!notification.enabled && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Premium Feature
                            </Badge>
                          )}
                        </p>
                      </div>
                      <Switch
                        id={notification.key}
                        checked={userSettings?.notifications[notification.key] || false}
                        onCheckedChange={(checked) => handleNotificationChange(notification.key, checked)}
                        disabled={!notification.enabled}
                      />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy & Data */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 joy-gradient opacity-8"
                  style={{ clipPath: "circle(60% at 75% 25%)" }}
                  animate={{ 
                    clipPath: [
                      "circle(60% at 75% 25%)",
                      "circle(80% at 25% 75%)",
                      "circle(60% at 75% 25%)"
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Shield className="w-5 h-5" />
                    </motion.div>
                    Privacy & Data
                  </CardTitle>
                  <CardDescription>Manage your data and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export Your Data</Label>
                      <p className="text-sm text-gray-500">
                        Download all your mood entries and data
                        {userSettings?.plan === 'free' && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Basic+ Feature
                          </Badge>
                        )}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        onClick={handleExportData}
                        disabled={userSettings?.plan ? !hasBasicPlusFeatures(userSettings.plan) : true}
                        className="glass-button"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </motion.div>
                  </div>
                  <div className="border-t pt-4">
                    <Alert className="border-red-200 bg-red-50">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Delete Account:</strong> This will permanently delete your account and all associated
                        data. This action cannot be undone.
                        <motion.div 
                          className="mt-2"
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                            Delete Account
                          </Button>
                        </motion.div>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  )
}