"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const EMOTIONS = [
  { name: "Joy", color: "bg-yellow-100 text-yellow-800 border-yellow-200", emoji: "😊" },
  { name: "Sadness", color: "bg-blue-100 text-blue-800 border-blue-200", emoji: "😢" },
  { name: "Anger", color: "bg-red-100 text-red-800 border-red-200", emoji: "😠" },
  { name: "Fear", color: "bg-purple-100 text-purple-800 border-purple-200", emoji: "😰" },
  { name: "Surprise", color: "bg-orange-100 text-orange-800 border-orange-200", emoji: "😲" },
  { name: "Love", color: "bg-pink-100 text-pink-800 border-pink-200", emoji: "❤️" },
  { name: "Excitement", color: "bg-green-100 text-green-800 border-green-200", emoji: "🎉" },
  { name: "Calm", color: "bg-teal-100 text-teal-800 border-teal-200", emoji: "😌" },
  { name: "Anxious", color: "bg-gray-100 text-gray-800 border-gray-200", emoji: "😟" },
  { name: "Grateful", color: "bg-emerald-100 text-emerald-800 border-emerald-200", emoji: "🙏" },
  { name: "Overwhelmed", color: "bg-red-100 text-red-800 border-red-200", emoji: "😵" },
  { name: "Hopeful", color: "bg-sky-100 text-sky-800 border-sky-200", emoji: "🌟" },
]

interface EmotionChipsProps {
  selectedEmotions: string[]
  onChange: (emotions: string[]) => void
  maxSelections?: number
  className?: string
}

export function EmotionChips({ selectedEmotions, onChange, maxSelections = 5, className }: EmotionChipsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmotions = EMOTIONS.filter((emotion) => emotion.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleEmotion = (emotionName: string) => {
    if (selectedEmotions.includes(emotionName)) {
      onChange(selectedEmotions.filter((e) => e !== emotionName))
    } else if (selectedEmotions.length < maxSelections) {
      onChange([...selectedEmotions, emotionName])
    }
  }

  const removeEmotion = (emotionName: string) => {
    onChange(selectedEmotions.filter((e) => e !== emotionName))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected emotions */}
      <AnimatePresence>
        {selectedEmotions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedEmotions.map((emotion) => {
              const emotionData = EMOTIONS.find((e) => e.name === emotion)
              return (
                <motion.div
                  key={emotion}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium",
                    emotionData?.color,
                  )}
                >
                  <span>{emotionData?.emoji}</span>
                  <span>{emotion}</span>
                  <button onClick={() => removeEmotion(emotion)} className="ml-1 hover:bg-black/10 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search emotions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Available emotions */}
      <div className="flex flex-wrap gap-2">
        {filteredEmotions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion.name)
          const isDisabled = !isSelected && selectedEmotions.length >= maxSelections

          return (
            <motion.button
              key={emotion.name}
              onClick={() => toggleEmotion(emotion.name)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-all",
                isSelected ? emotion.color : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
                isDisabled && "opacity-50 cursor-not-allowed",
              )}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              <span>{emotion.emoji}</span>
              <span>{emotion.name}</span>
            </motion.button>
          )
        })}
      </div>

      {selectedEmotions.length >= maxSelections && (
        <p className="text-xs text-gray-500">Maximum {maxSelections} emotions selected</p>
      )}
    </div>
  )
}
