"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns"

interface HeatmapCalendarProps {
  data: Array<{ date: string; mood: number }>
}

export function HeatmapCalendar({ data }: HeatmapCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; mood: number } | null>(null)
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getMoodForDate = (date: Date) => {
    const entry = data.find((d) => isSameDay(new Date(d.date), date))
    return entry?.mood || 0
  }

  const getMoodColor = (mood: number) => {
    if (mood === 0) return "bg-gray-100"
    if (mood <= 3) return "bg-red-200"
    if (mood <= 5) return "bg-yellow-200"
    if (mood <= 7) return "bg-green-200"
    return "bg-green-400"
  }

  const getMoodIntensity = (mood: number) => {
    if (mood === 0) return 0
    return Math.max(0.2, mood / 10)
  }

  // Create calendar grid with proper week alignment
  const calendarDays = []
  const firstDayOfWeek = getDay(monthStart)

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add all days of the month
  days.forEach((day) => {
    calendarDays.push(day)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3 h-3 bg-red-200 rounded-sm" />
            <div className="w-3 h-3 bg-yellow-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="w-8 h-8" />
          }

          const mood = getMoodForDate(day)
          const intensity = getMoodIntensity(mood)

          return (
            <motion.div
              key={day.toISOString()}
              className={`w-8 h-8 rounded-sm cursor-pointer relative ${getMoodColor(mood)}`}
              style={{ opacity: intensity }}
              whileHover={{ scale: 1.2 }}
              onMouseEnter={() => setHoveredDay({ date: day, mood })}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {format(day, "d")}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 bg-black text-white px-2 py-1 rounded text-xs pointer-events-none"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {format(hoveredDay.date, "MMM d")}: {hoveredDay.mood > 0 ? `${hoveredDay.mood}/10` : "No entry"}
        </motion.div>
      )}
    </div>
  )
}
