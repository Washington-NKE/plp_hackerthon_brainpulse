"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Calendar, Heart, BarChart3, Target, Brain } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendChart } from "@/components/ui/trend-chart"
import { HeatmapCalendar } from "@/components/ui/heatmap-calendar"
import { EmotionChart } from "@/components/ui/emotion-chart"
import { ThemeProvider } from "@/components/theme-provider"

interface AnalyticsData {
  moodTrend: Array<{ date: string; mood: number; movingAverage: number }>
  emotionFrequency: Array<{ emotion: string; count: number; percentage: number }>
  heatmapData: Array<{ date: string; mood: number }>
  stats: {
    averageMood: number
    totalEntries: number
    streak: number
    moodImprovement: number
  }
  correlations: {
    sleepMood: number
    stressMood: number
    energyMood: number
  }
  weeklyInsights: string[]
}

export default function InsightsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </ThemeProvider>
    )
  }

  if (!analyticsData) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
          <div className="text-center">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-600">Start logging your mood to see insights</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Your Insights</h1>
              <div className="flex gap-2">
                {(["week", "month", "quarter"] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    onClick={() => setTimeRange(range)}
                    size="sm"
                    className="capitalize"
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-gray-600">Understand your mood patterns and emotional journey</p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Mood</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.stats.averageMood.toFixed(1)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.stats.totalEntries}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.stats.streak} days</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mood Trend</p>
                    <p
                      className={`text-2xl font-bold ${
                        analyticsData.stats.moodImprovement >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {analyticsData.stats.moodImprovement >= 0 ? "+" : ""}
                      {analyticsData.stats.moodImprovement.toFixed(1)}%
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Mood Trend Chart */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Mood Trend
                  </CardTitle>
                  <CardDescription>Your mood over time with moving average</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendChart data={analyticsData.moodTrend} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Emotion Frequency */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Top Emotions
                  </CardTitle>
                  <CardDescription>Most frequently experienced emotions</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmotionChart data={analyticsData.emotionFrequency} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Calendar Heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mood Calendar
                </CardTitle>
                <CardDescription>Visual representation of your daily mood patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <HeatmapCalendar data={analyticsData.heatmapData} />
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Correlations */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Mood Correlations</CardTitle>
                  <CardDescription>How different factors affect your mood</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sleep Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.abs(analyticsData.correlations.sleepMood) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {(analyticsData.correlations.sleepMood * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stress Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.abs(analyticsData.correlations.stressMood) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {(analyticsData.correlations.stressMood * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Energy Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.abs(analyticsData.correlations.energyMood) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {(analyticsData.correlations.energyMood * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Insights */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>Personalized observations about your mood patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.weeklyInsights.map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
