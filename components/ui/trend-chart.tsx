"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface TrendChartProps {
  data: Array<{ date: string; mood: number; movingAverage: number }>
}

export function TrendChart({ data }: TrendChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="#6b7280" fontSize={12} />
          <YAxis domain={[1, 10]} stroke="#6b7280" fontSize={12} />
          <Tooltip
            labelFormatter={(value) => formatDate(value as string)}
            formatter={(value: number, name: string) => [
              value.toFixed(1),
              name === "mood" ? "Mood Score" : "Moving Average",
            ]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Area type="monotone" dataKey="mood" stroke="#3b82f6" fill="url(#moodGradient)" strokeWidth={2} />
          <Line
            type="monotone"
            dataKey="movingAverage"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
