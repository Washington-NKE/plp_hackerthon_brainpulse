"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"

interface MoodDialProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function MoodDial({ value, onChange, className }: MoodDialProps) {
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef(null)
  const y = useMotionValue(0)

  // Transform y position to mood value (1-10)
  const moodValue = useTransform(y, [-100, 100], [10, 1])

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newValue = Math.round(Math.max(1, Math.min(10, 10 - (info.point.y - 200) / 20)))
    onChange(newValue)
  }

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return "from-red-500 to-red-600"
    if (mood <= 5) return "from-orange-500 to-yellow-500"
    if (mood <= 7) return "from-yellow-500 to-green-500"
    return "from-green-500 to-emerald-500"
  }

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return "😢"
    if (mood <= 4) return "😔"
    if (mood <= 6) return "😐"
    if (mood <= 8) return "🙂"
    return "😊"
  }

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner" />

        {/* Mood indicator */}
        <motion.div
          className={cn(
            "absolute inset-2 rounded-full shadow-lg cursor-grab active:cursor-grabbing",
            "bg-gradient-to-br",
            getMoodColor(value),
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: isDragging ? 1.1 : 1,
            boxShadow: isDragging
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          drag="y"
          dragConstraints={{ top: -50, bottom: 50 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl">{getMoodEmoji(value)}</span>
          </div>
        </motion.div>

        {/* Value display */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            className="bg-white rounded-full px-3 py-1 shadow-md border"
            animate={{ scale: isDragging ? 1.1 : 1 }}
          >
            <span className="text-sm font-medium">{value}/10</span>
          </motion.div>
        </div>
      </div>

      {/* Mood scale */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span>Low</span>
        <div className="flex space-x-1">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className={cn("w-2 h-2 rounded-full", i + 1 <= value ? "bg-blue-500" : "bg-gray-200")}
              animate={{ scale: i + 1 === value ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  )
}
