"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Calendar, Heart, Sparkles, Cloud, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EntryCard } from "@/components/ui/entry-card"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface JournalEntry {
  id: string
  date: Date
  moodScore: number
  primaryEmotion?: string
  tags: string[]
  text: string
  aiSummary?: string
}

const MoodIcon = ({ moodScore, className = "" }) => {
  if (moodScore >= 8) return <Sun className={`${className} text-yellow-500`} />
  if (moodScore >= 6) return <Heart className={`${className} text-pink-500`} />
  if (moodScore >= 4) return <Cloud className={`${className} text-blue-400`} />
  return <Cloud className={`${className} text-gray-400`} />
}

const getMoodGradient = (moodScore: number) => {
  if (moodScore >= 8) return "joy-gradient"
  if (moodScore >= 6) return "energy-gradient"
  if (moodScore >= 4) return "calm-gradient"
  return "mood-gradient"
}

const EntryCard = ({ entry, onClick, index }: { entry: JournalEntry, onClick: () => void, index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-card p-6 cursor-pointer group relative overflow-hidden animate-card-hover ${getMoodGradient(entry.moodScore)}`}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Shimmer effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ left: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-2 glass-button rounded-full"
            >
              <MoodIcon moodScore={entry.moodScore} className="w-5 h-5" />
            </motion.div>
            <div>
              <motion.div 
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              >
                {entry.date.toLocaleDateString()}
              </motion.div>
              <motion.div 
                className="text-xs text-gray-600 dark:text-gray-400"
                animate={isHovered ? { x: 5 } : { x: 0 }}
              >
                {entry.primaryEmotion}
              </motion.div>
            </div>
          </div>
          <motion.div 
            className={`px-3 py-1 rounded-full text-sm font-semibold glass-button`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isHovered 
                ? "0 0 20px rgba(139, 92, 246, 0.4)" 
                : "0 0 10px rgba(139, 92, 246, 0.2)"
            }}
          >
            {entry.moodScore}/10
          </motion.div>
        </div>

        <motion.p 
          className="text-gray-800 dark:text-gray-200 mb-4 line-clamp-2"
          animate={isHovered ? { y: -2 } : { y: 0 }}
        >
          {entry.text}
        </motion.p>

        <div className="flex flex-wrap gap-2 mb-3">
          {entry.tags.map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * tagIndex }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="px-2 py-1 bg-white/30 dark:bg-black/30 rounded-full text-xs font-medium glass-button"
            >
              #{tag}
            </motion.span>
          ))}
        </div>

        {entry.aiSummary && (
          <motion.div 
            className="text-xs text-gray-600 dark:text-gray-400 italic border-l-2 border-white/30 pl-3"
            animate={isHovered ? { borderColor: "rgba(139, 92, 246, 0.6)" } : { borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            💭 {entry.aiSummary}
          </motion.div>
        )}
      </div>

      {/* Pulsing corner decoration */}
      <motion.div
        className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

const FloatingMoodBubble = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-4 h-4 rounded-full opacity-20"
    style={{
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -100, 0],
      x: [0, Math.random() * 50 - 25, 0],
      scale: [1, 1.5, 1],
      opacity: [0.2, 0.6, 0.2]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
)

export default function EnhancedJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMood, setFilterMood] = useState<number | null>(null)
  const [currentTheme, setCurrentTheme] = useState("neutral") // This would come from your theme context
  const router = useRouter()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/entries")
      if (response.ok) {
        const data = await response.json()
        setEntries(
          data.entries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.created_at),
          })),
        )
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMood = filterMood === null || entry.moodScore === filterMood
    return matchesSearch && matchesMood
  })

  return (
    <ThemeProvider>
      <div className={`min-h-screen relative overflow-hidden mood-bg-pattern ${currentTheme}`}>
      {/* Animated background */}
      <div className="absolute inset-0 energy-particles">
        {[...Array(10)].map((_, i) => (
          <FloatingMoodBubble key={i} delay={i * 0.8} />
        ))}
      </div>

      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white/30 to-pink-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50" />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Enhanced Header with animations */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mr-4"
            >
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-text-glow"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Your Mood Journey
            </motion.h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="ml-4"
            >
              <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </motion.div>
          </div>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Track your emotions, celebrate growth, embrace your authentic self ✨
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg animate-pulse-glow btn-ripple"
          >
            <Link href="/journal/new">
              <Plus className="w-5 h-5 mr-2 inline" />
              Create New Entry
            </Link>
          </motion.button>
        </motion.div>

        {/* Enhanced Filters with animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
                </motion.div>
                <Input
                  placeholder="Search your thoughts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass-button rounded-xl border-0 focus:ring-2 focus:ring-purple-500 transition-all duration-300 placeholder-gray-500"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterMood(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filterMood === null 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                      : "glass-button hover:glass text-gray-700 dark:text-gray-300"
                  }`}
                >
                  All Moods
                </motion.button>
                
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood, index) => (
                  <motion.button
                    key={mood}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFilterMood(mood)}
                    className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                      filterMood === mood
                        ? `bg-gradient-to-r ${getMoodGradient(mood)} text-white shadow-lg`
                        : "glass-button hover:glass text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {mood}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Entries List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Loading your mood journey...</p>
              </motion.div>
            ) : filteredEntries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {searchTerm || filterMood ? "No matching entries" : "Your journey starts here"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {searchTerm || filterMood 
                    ? "Try adjusting your search or mood filter" 
                    : "Begin documenting your beautiful emotional landscape"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
                >
                  <Link href="/journal/new">
                    Create Your First Entry ✨
                  </Link>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div layout className="space-y-6">
                {filteredEntries.map((entry, index) => (
                  <EntryCard 
                    key={entry.id} 
                    entry={entry} 
                    index={index}
                    onClick={() => router.push(`/journal/${entry.id}`)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating action elements */}
        <motion.div
          className="fixed bottom-8 right-8 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Link href="/journal/new">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl glass-card animate-pulse-glow"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Plus className="w-8 h-8 mx-auto" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}