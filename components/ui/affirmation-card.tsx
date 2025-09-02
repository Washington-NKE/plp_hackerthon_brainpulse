"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface AffirmationCardProps {
  affirmation: string
  onRefresh?: () => void
  isLoading?: boolean
  className?: string
}

export function AffirmationCard({ affirmation, onRefresh, isLoading = false, className }: AffirmationCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const words = affirmation.split(" ")

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm",
        "border border-purple-200/50 shadow-lg",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Daily Affirmation</h3>
          </div>
          {onRefresh && (
            <motion.button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className={cn("w-4 h-4 text-purple-600", isLoading && "animate-spin")} />
            </motion.button>
          )}
        </div>

        {/* Affirmation text with animated reveal */}
        <div className="text-gray-700 leading-relaxed">
          <AnimatePresence>
            {isVisible && (
              <motion.div className="flex flex-wrap gap-1">
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative quote marks */}
        <div className="absolute top-4 left-4 text-4xl text-purple-200 font-serif leading-none">"</div>
        <div className="absolute bottom-4 right-4 text-4xl text-purple-200 font-serif leading-none">"</div>
      </div>
    </motion.div>
  )
}
