"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Save, ArrowLeft, Sparkles, Heart, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MoodDial } from "@/components/ui/mood-dial"
import { EmotionChips } from "@/components/ui/emotion-chips"
import { TagInput } from "@/components/ui/tag-input"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"

// Enhanced MoodDial wrapper with animations
type AnimatedMoodDialProps = {
  value: number
  onChange: (value: number) => void
}

const AnimatedMoodDial = ({ value, onChange }: AnimatedMoodDialProps) => {
  const [isHovering, setIsHovering] = useState(false)
  
  return (
    <motion.div 
      className="relative"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{
          boxShadow: isHovering 
            ? "0 0 40px rgba(var(--theme-primary), 0.6), 0 0 80px rgba(var(--theme-primary), 0.3)"
            : "0 0 20px rgba(var(--theme-primary), 0.3)"
        }}
        className="rounded-full"
      >
        <MoodDial value={value} onChange={onChange} />
      </motion.div>
    </motion.div>
  )
}

// Enhanced EmotionChips wrapper
type AnimatedEmotionChipsProps = {
  selectedEmotions: string[]
  onChange: (emotions: string[]) => void
}

const AnimatedEmotionChips = ({ selectedEmotions, onChange }: AnimatedEmotionChipsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <EmotionChips
        selectedEmotions={selectedEmotions}
        onChange={onChange}
      />
    </motion.div>
  )
}

// Enhanced TagInput wrapper
type AnimatedTagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

const AnimatedTagInput = ({ tags, onChange, placeholder }: AnimatedTagInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <TagInput
        tags={tags}
        onChange={onChange}
        placeholder={placeholder}
      />
    </motion.div>
  )
}

// Theme selector component
type ThemeSelectorProps = {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    { name: "default", label: "Default", icon: Brain },
    { name: "male", label: "Masculine", icon: Zap },
    { name: "female", label: "Feminine", icon: Heart }
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
              className={`p-2 rounded-md transition-all ${
                currentTheme === theme.name 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={theme.label}
            >
              <Icon size={16} />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function NewEntryPage() {
  const [currentTheme, setCurrentTheme] = useState("default")
  const [formData, setFormData] = useState({
    moodScore: 5,
    primaryEmotion: "",
    secondaryEmotions: [] as string[],
    text: "",
    tags: [] as string[],
    energyLevel: 5,
    stressLevel: 5,
    sleepQuality: 5,
    gratitudeNotes: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  type Particle = { id: number; x: number; y: number; size: number; speed: number }
  const [particles, setParticles] = useState<Particle[]>([])
  const router = useRouter()

  // Apply theme to document
  useEffect(() => {
    document.body.className = currentTheme
  }, [currentTheme])

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      speed: Math.random() * 3 + 2
    }))
    setParticles(newParticles)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        router.push("/journal")
      } else {
        console.error("Failed to create entry")
      }
    } catch (error) {
      console.error("Error creating entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6 } // No ease property
  }
}

  return (
    <ThemeProvider>
      <div className={`min-h-screen relative overflow-hidden mood-bg-pattern energy-particles ${currentTheme}`}>
        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 animate-morphing-blob"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                y: [0, -120, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.4, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: particle.speed * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />

        <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
          {/* Animated Header */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Link href="/journal">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="animate-float">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
              </Link>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-shift animate-text-glow"
              >
                New Journal Entry
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
              transition={{ delay: 0.5 }}
            >
              How are you feeling right now?
            </motion.p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Mood Score */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 mood-gradient opacity-5 animate-gradient-shift"
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      🎭
                    </motion.div>
                    Overall Mood
                  </CardTitle>
                  <CardDescription>Rate your current mood from 1 (low) to 10 (high)</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center relative z-10">
                  <AnimatedMoodDial
                    value={formData.moodScore}
                    onChange={(value) => setFormData({ ...formData, moodScore: value })}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Emotions */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 energy-gradient opacity-10 animate-pulse"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      💝
                    </motion.div>
                    Emotions
                  </CardTitle>
                  <CardDescription>What emotions are you experiencing?</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <AnimatedEmotionChips
                    selectedEmotions={formData.secondaryEmotions}
                    onChange={(emotions) => {
                      setFormData({
                        ...formData,
                        secondaryEmotions: emotions,
                        primaryEmotion: emotions[0] || "",
                      })
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Journal Text */}
            <motion.div variants={cardVariants}>
              <Card className="glass-card animate-card-hover relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 calm-gradient opacity-8 animate-morphing-blob"
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 animate-text-glow">
                    <motion.div
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      📝
                    </motion.div>
                    Your Thoughts
                  </CardTitle>
                  <CardDescription>Write about your day, feelings, or anything on your mind</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      placeholder="What's on your mind today?"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="min-h-32 resize-none glass animate-breathe"
                      required
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags */}
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
                      animate={{ rotate: [0, 45, -45, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🏷️
                    </motion.div>
                    Tags
                  </CardTitle>
                  <CardDescription>Add tags to categorize this entry</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <AnimatedTagInput
                    tags={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                    placeholder="work, family, exercise..."
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit */}
            <motion.div
              variants={cardVariants}
              className="flex gap-4"
            >
              <Link href="/journal" className="flex-1">
                <motion.div 
                  className="w-full" 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="button" variant="outline" className="w-full glass-button">
                    Cancel
                  </Button>
                </motion.div>
              </Link>
              <motion.div 
                className="flex-1" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full btn-ripple animate-shimmer relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
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
                        Save Entry
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </ThemeProvider>
  )
}