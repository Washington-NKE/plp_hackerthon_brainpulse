"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, TrendingUp, Heart, Target, Sparkles, Sun, Moon, Sunrise } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoodDial } from "@/components/ui/mood-dial"
import { AffirmationCard } from "@/components/ui/affirmation-card"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { format } from "date-fns"

interface TodayEntry {
  id?: string
  moodScore: number
  primaryEmotion?: string
  text?: string
  createdAt?: Date
}

interface User {
  name?: string
  gender?: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [todayEntry, setTodayEntry] = useState<TodayEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [currentMoodTheme, setCurrentMoodTheme] = useState(0)
  const [timeOfDay, setTimeOfDay] = useState("")
  const [userGender, setUserGender] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)

  // Mood themes that cycle based on overall app state
  const moodThemes = [
    { name: "energetic", class: "energy-gradient", emoji: "⚡", color: "from-purple-500 to-pink-500" },
    { name: "calm", class: "calm-gradient", emoji: "🌊", color: "from-blue-500 to-teal-500" },
    { name: "joyful", class: "joy-gradient", emoji: "✨", color: "from-yellow-400 to-orange-500" },
    { name: "thoughtful", class: "mood-gradient", emoji: "🎭", color: "from-purple-600 to-blue-600" }
  ]

  // Time-based greetings with icons
  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: "morning", icon: <Sunrise className="w-6 h-6" />, class: "from-orange-200 to-yellow-200" }
    if (hour < 18) return { greeting: "afternoon", icon: <Sun className="w-6 h-6" />, class: "from-blue-200 to-purple-200" }
    return { greeting: "evening", icon: <Moon className="w-6 h-6" />, class: "from-purple-300 to-indigo-300" }
  }

  useEffect(() => {
    // Apply gender theme from user session
    const gender = (session?.user as User)?.gender
    if (gender === "male") {
      document.body.className = "male"
      setUserGender("male")
    } else if (gender === "female") {
      document.body.className = "female"
      setUserGender("female")
    } else {
      document.body.className = ""
      setUserGender("")
    }

    setTimeOfDay(getTimeOfDay().greeting)
    setIsVisible(true)
    fetchTodayEntry()
    fetchStreak()

    // Cycle mood themes every 6 seconds
    const moodInterval = setInterval(() => {
      setCurrentMoodTheme((prev) => (prev + 1) % moodThemes.length)
    }, 6000)

    return () => {
      clearInterval(moodInterval)
      document.body.className = ""
    }
  }, [session])

  const fetchTodayEntry = async () => {
    try {
      const response = await fetch("/api/entries/today")
      if (response.ok) {
        const data = await response.json()
        setTodayEntry(data.entry)
      }
    } catch (error) {
      console.error("Failed to fetch today's entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStreak = async () => {
    try {
      const response = await fetch("/api/analytics/streak")
      if (response.ok) {
        const data = await response.json()
        setStreak(data.streak)
      }
    } catch (error) {
      console.error("Failed to fetch streak:", error)
    }
  }

  const quickMoodUpdate = async (moodScore: number) => {
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodScore,
          text: `Quick mood check: ${moodScore}/10`,
          date: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTodayEntry(data.entry)
        fetchStreak()
      }
    } catch (error) {
      console.error("Failed to update mood:", error)
    }
  }

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return "😊"
    if (score >= 6) return "🙂"
    if (score >= 4) return "😐"
    if (score >= 2) return "😔"
    return "😢"
  }

  const getMoodColor = (score: number) => {
    if (score >= 8) return "from-green-400 to-emerald-500"
    if (score >= 6) return "from-yellow-400 to-orange-400"
    if (score >= 4) return "from-blue-400 to-purple-400"
    if (score >= 2) return "from-orange-400 to-red-400"
    return "from-red-400 to-pink-400"
  }

  const currentTheme = moodThemes[currentMoodTheme]
  const timeData = getTimeOfDay()

  return (
    <ThemeProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Dynamic animated background */}
        <div className="absolute inset-0 mood-bg-pattern">
          <div className={`absolute inset-0 ${currentTheme.class} opacity-10 animate-gradient-shift`}></div>
          <div className="absolute inset-0 energy-particles"></div>
        </div>

        {/* Floating elements with gender-based colors */}
        <div className={`absolute top-20 left-20 w-32 h-32 bg-gradient-to-br ${
          userGender === "male" ? "from-blue-400/20 to-purple-400/20" : 
          userGender === "female" ? "from-pink-400/20 to-orange-400/20" : 
          "from-purple-400/20 to-blue-400/20"
        } rounded-full animate-float blur-xl`}></div>
        
        <div className={`absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br ${
          userGender === "male" ? "from-teal-400/20 to-blue-400/20" : 
          userGender === "female" ? "from-rose-400/20 to-pink-400/20" : 
          "from-indigo-400/20 to-purple-400/20"
        } rounded-full animate-float blur-xl`} style={{animationDelay: "2s"}}></div>

        <div className="absolute top-1/2 right-10 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full animate-morphing-blob"></div>
        <div className="absolute bottom-1/3 left-10 w-28 h-28 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full animate-breathe"></div>

        {/* Mood theme indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 z-20"
        >
          <div className="glass-card px-4 py-2 border-0">
            <div className="flex items-center gap-2">
              <motion.span 
                key={currentTheme.emoji}
                initial={{ rotate: 0, scale: 1 }}
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-xl"
              >
                {currentTheme.emoji}
              </motion.span>
              <span className="text-xs font-medium text-foreground/70 capitalize">
                {currentTheme.name} vibes
              </span>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="glass-card p-6 border-0 animate-card-hover">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className={`p-3 rounded-full bg-gradient-to-br ${timeData.class} animate-pulse-glow`}
                >
                  {timeData.icon}
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-text-glow"
                  >
                    Good {timeData.greeting}, {session?.user?.name?.split(" ")[0] || "there"}!
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-muted-foreground mt-1"
                  >
                    Ready to explore your mood journey today? ✨
                  </motion.p>
                </div>
              </div>
              
              {/* Dynamic mood indicator bar */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 rounded-full opacity-20"
              ></motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Today's Mood */}
            <motion.div
              initial={{ opacity: 0, x: -40, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card border-0 animate-card-hover">
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Today's Mood Journey
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {format(new Date(), "EEEE, MMMM d, yyyy")} • Let's check in with yourself
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-12"
                      >
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-purple-400 opacity-20"></div>
                        </div>
                      </motion.div>
                    ) : todayEntry ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className={`w-20 h-20 rounded-full bg-gradient-to-br ${getMoodColor(todayEntry.moodScore)} flex items-center justify-center text-3xl shadow-2xl animate-breathe`}
                            >
                              {getMoodEmoji(todayEntry.moodScore)}
                            </motion.div>
                            <div>
                              <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-bold text-foreground"
                              >
                                Mood Score: {todayEntry.moodScore}/10
                              </motion.p>
                              {todayEntry.primaryEmotion && (
                                <motion.p 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="text-muted-foreground capitalize text-lg"
                                >
                                  Feeling {todayEntry.primaryEmotion} today
                                </motion.p>
                              )}
                            </div>
                          </div>
                          <Link href="/journal/new">
                            <Button className="glass-button border-white/30 hover:bg-white/20 btn-ripple">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Enhance Entry
                            </Button>
                          </Link>
                        </div>
                        
                        {todayEntry.text && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass p-6 rounded-xl border-0"
                          >
                            <p className="text-foreground/80 leading-relaxed">{todayEntry.text}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-8"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <MoodDial value={5} onChange={quickMoodUpdate} />
                        </motion.div>
                        <div className="space-y-4">
                          <p className="text-muted-foreground text-lg">
                            How are you feeling right now? Share your mood with a quick check or dive deeper.
                          </p>
                          <Link href="/journal/new">
                            <Button className={`w-full ${currentTheme.class} border-0 shadow-xl animate-pulse-glow btn-ripple text-white font-semibold py-3`}>
                              <Plus className="w-5 h-5 mr-2" />
                              {currentTheme.emoji} Start Today's Journey
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Enhanced Streak Counter */}
              <motion.div 
                initial={{ opacity: 0, x: 40, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <Card className="glass-card border-0 animate-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Target className="w-5 h-5 text-orange-600" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Journey Streak
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="relative"
                      >
                        <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse-glow">
                          {streak}
                        </div>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute -top-2 -right-2 text-2xl"
                        >
                          🔥
                        </motion.div>
                      </motion.div>
                      <p className="text-muted-foreground font-medium">
                        {streak === 1 ? "day" : "days"} of mindful reflection
                      </p>
                      {streak > 0 && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-green-600 font-medium"
                        >
                          Keep the momentum going! 🌟
                        </motion.p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Daily Affirmation */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="animate-card-hover">
                  <AffirmationCard
                    affirmation="You have the strength to overcome any challenge that comes your way today."
                    onRefresh={() => {
                      // TODO: Implement affirmation refresh
                    }}
                  />
                </div>
              </motion.div>

              {/* Enhanced Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Card className="glass-card border-0 animate-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Quick Actions
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/journal" className="block">
                        <Button className="w-full justify-start glass-button border-white/30 hover:bg-white/20 btn-ripple">
                          <Calendar className="w-4 h-4 mr-2" />
                          Browse Journal Entries
                        </Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/insights" className="block">
                        <Button className="w-full justify-start glass-button border-white/30 hover:bg-white/20 btn-ripple">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Mood Insights
                        </Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/coach" className="block">
                        <Button className="w-full justify-start glass-button border-white/30 hover:bg-white/20 btn-ripple">
                          <Heart className="w-4 h-4 mr-2" />
                          Talk to AI Coach
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}