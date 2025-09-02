"use client"

import { motion } from "framer-motion"
import { Calendar, Heart, Tag, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface EntryCardProps {
  entry: {
    id: string
    date: Date
    moodScore: number
    primaryEmotion?: string
    tags: string[]
    text: string
    aiSummary?: string
  }
  onClick?: () => void
  className?: string
}

export function EntryCard({ entry, onClick, className }: EntryCardProps) {
  const getMoodColor = (score: number) => {
    if (score <= 3) return "from-red-400 to-red-500"
    if (score <= 5) return "from-orange-400 to-yellow-500"
    if (score <= 7) return "from-yellow-400 to-green-500"
    return "from-green-400 to-emerald-500"
  }

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return "😢"
    if (score <= 4) return "😔"
    if (score <= 6) return "😐"
    if (score <= 8) return "🙂"
    return "😊"
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/20 backdrop-blur-sm cursor-pointer group",
        "bg-gradient-to-br from-white/80 to-white/40 shadow-lg hover:shadow-xl transition-all duration-300",
        className,
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Gradient border glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-r p-[1px]",
          getMoodColor(entry.moodScore),
        )}
      >
        <div className="w-full h-full rounded-2xl bg-white" />
      </div>

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                "bg-gradient-to-br shadow-md",
                getMoodColor(entry.moodScore),
              )}
            >
              {getMoodEmoji(entry.moodScore)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {format(entry.date, "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Mood: {entry.moodScore}/10
              </div>
            </div>
          </div>
        </div>

        {/* Primary emotion */}
        {entry.primaryEmotion && (
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">{entry.primaryEmotion}</span>
          </div>
        )}

        {/* Entry text preview */}
        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">{entry.text}</p>

        {/* AI Summary */}
        {entry.aiSummary && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-medium mb-1">AI Summary</p>
            <p className="text-sm text-blue-800 line-clamp-2">{entry.aiSummary}</p>
          </div>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{entry.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
