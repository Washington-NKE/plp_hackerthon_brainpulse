"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EmotionChartProps {
  data: Array<{ emotion: string; count: number; percentage: number }>
}

export function EmotionChart({ data }: EmotionChartProps) {
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      Joy: "#fbbf24",
      Sadness: "#3b82f6",
      Anger: "#ef4444",
      Fear: "#8b5cf6",
      Love: "#ec4899",
      Excitement: "#10b981",
      Calm: "#06b6d4",
      Anxious: "#6b7280",
      Grateful: "#22c55e",
      Overwhelmed: "#f97316",
    }
    return colors[emotion] || "#6b7280"
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 6)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="emotion" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value} times`, "Frequency"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="count" fill={(entry) => getEmotionColor(entry.emotion)} radius={[4, 4, 0, 0]} stroke="none" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
