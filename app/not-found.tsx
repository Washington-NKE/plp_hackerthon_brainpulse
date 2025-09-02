"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, RefreshCw, Heart, Sparkles, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Custom404() {
  const [currentMood, setCurrentMood] = useState(0)
  const [isWiggling, setIsWiggling] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 })
  
  const moods = [
    { emoji: "😵", feeling: "confused", color: "#ff6b6b" },
    { emoji: "🤔", feeling: "puzzled", color: "#feca57" },
    { emoji: "😅", feeling: "awkward", color: "#48dbfb" },
    { emoji: "🙃", feeling: "silly", color: "#ff9ff3" },
    { emoji: "😎", feeling: "cool", color: "#54a0ff" }
  ]

  const funnyMessages = [
    "Even our AI got confused about where this page went!",
    "This page is probably journaling about its feelings right now...",
    "404: Page not found, but your mood matters more!",
    "Lost page = opportunity for self-reflection? 🤷‍♀️",
    "This page went on a mindfulness retreat and never came back"
  ]

  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    // Set dimensions once on client side
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const moodTimer = setInterval(() => {
      setCurrentMood((prev) => (prev + 1) % moods.length)
    }, 2000)

    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % funnyMessages.length)
    }, 4000)

    return () => {
      clearInterval(moodTimer)
      clearInterval(messageTimer)
    }
  }, [])

  const handleMoodClick = () => {
    setIsWiggling(true)
    setTimeout(() => setIsWiggling(false), 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{ 
              x: Math.random() * dimensions.width, 
              y: Math.random() * dimensions.height,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              rotate: 360,
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
            }}
          />
        ))}
      </div>

      {/* Floating Hearts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-white/20"
          initial={{ y: "100vh", x: Math.random() * 100 + "%" }}
          animate={{ y: "-10vh" }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        >
          <Heart className="w-6 h-6" />
        </motion.div>
      ))}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
            4
            <motion.span
              animate={{ 
                rotateY: [0, 360],
                color: moods[currentMood].color
              }}
              transition={{ 
                rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                color: { duration: 2, repeat: Infinity }
              }}
              className="inline-block mx-2"
            >
              0
            </motion.span>
            4
          </h1>
        </motion.div>

        {/* Animated Mood Face */}
        <motion.div
          className="mb-8 cursor-pointer select-none"
          onClick={handleMoodClick}
          animate={isWiggling ? { 
            rotate: [-5, 5, -5, 5, 0],
            scale: [1, 1.1, 1] 
          } : {}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMood}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-8xl md:text-9xl filter drop-shadow-lg"
              style={{ color: moods[currentMood].color }}
            >
              {moods[currentMood].emoji}
            </motion.div>
          </AnimatePresence>
          
          <motion.p
            key={`feeling-${currentMood}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-lg mt-2 font-medium"
          >
            Feeling {moods[currentMood].feeling}
          </motion.p>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <div className="flex items-center justify-center gap-2 text-white/90">
            <Sparkles className="w-5 h-5" />
            <span className="text-xl font-light font-['Caveat'] tracking-wide">
              But hey, that's totally okay!
            </span>
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Rotating Funny Messages */}
        <motion.div
          className="mb-12 h-16 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{ duration: 0.6 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
            >
              {funnyMessages[currentMessage]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <Link href="/">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2" />
              My Journal
            </Button>
          </Link>

          <Button 
            size="lg" 
            variant="ghost"
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="max-w-md"
        >
          <blockquote className="text-white/70 text-lg italic font-light leading-relaxed">
            "Sometimes getting lost is the best way to find yourself."
          </blockquote>
          <cite className="text-white/50 text-sm mt-2 block">
            - Your friendly Pulse team 💜
          </cite>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
        >
          <div className="flex items-center justify-center gap-3 text-white/80 mb-2">
            <Search className="w-5 h-5" />
            <span className="text-lg font-medium">Looking for something specific?</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Dashboard', 'Mood Tracker', 'Journal', 'Analytics', 'Coach'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-all duration-200 hover:scale-105"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}