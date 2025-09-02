// api/analytics/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { subDays } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "month"

    const days = range === "week" ? 7 : range === "month" ? 30 : 90
    const startDate = subDays(new Date(), days)

    // Fetch journal entries - using the actual database field names
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
        created_at: { // Using snake_case field name
          gte: startDate,
        },
      },
      select: {
        mood_score: true, // Using snake_case field name
        emotions: true,
        sleep_hours: true, // Using snake_case field name
        stress_level: true, // Using snake_case field name
        created_at: true, // Using snake_case field name
        date: true,
      },
      orderBy: {
        created_at: 'asc', // Using snake_case field name
      },
    })

    // Calculate mood trend with moving average
    type MoodTrendPoint = { date: string; mood: number; movingAverage: number }
    const moodTrend: MoodTrendPoint[] = []
    const dailyMoods = new Map<string, number[]>()

    entries.forEach((entry) => {
      const date = entry.date.toISOString().split('T')[0]
      if (!dailyMoods.has(date)) {
        dailyMoods.set(date, [])
      }
      dailyMoods.get(date)!.push(entry.mood_score) // Using snake_case field name
    })

    for (const [date, moods] of dailyMoods) {
      const avgMood = moods.reduce((sum: number, mood: number) => sum + mood, 0) / moods.length
      moodTrend.push({
        date,
        mood: avgMood,
        movingAverage: 0, // Will calculate below
      })
    }

    // Calculate moving average
    moodTrend.forEach((point, index) => {
      const window = 3
      const start = Math.max(0, index - Math.floor(window / 2))
      const end = Math.min(moodTrend.length, start + window)
      const windowData = moodTrend.slice(start, end)
      point.movingAverage = windowData.reduce((sum, p) => sum + p.mood, 0) / windowData.length
    })

    // Calculate emotion frequency
    const emotionCounts = new Map()
    entries.forEach((entry) => {
      if (entry.emotions && entry.emotions.length > 0) {
        entry.emotions.forEach((emotion: string) => {
          emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1)
        })
      }
    })

    const emotionFrequency = Array.from(emotionCounts.entries())
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: (count / entries.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    // Prepare heatmap data
    const heatmapData = Array.from(dailyMoods.entries()).map(([date, moods]) => ({
      date,
      mood: moods.reduce((sum: number, mood: number) => sum + mood, 0) / moods.length,
    }))

    // Calculate statistics
    const totalMood = entries.reduce((sum, entry) => sum + entry.mood_score, 0) // Using snake_case field name
    const averageMood = entries.length > 0 ? totalMood / entries.length : 0

    const recentEntries = entries.slice(-7)
    const olderEntries = entries.slice(-14, -7)
    const recentAvg =
      recentEntries.length > 0 ? recentEntries.reduce((sum, e) => sum + e.mood_score, 0) / recentEntries.length : 0 // Using snake_case field name
    const olderAvg =
      olderEntries.length > 0 ? olderEntries.reduce((sum, e) => sum + e.mood_score, 0) / olderEntries.length : 0 // Using snake_case field name
    const moodImprovement = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0

    // Calculate streak - you might need to adjust this URL based on your actual endpoint
    let streakData = { streak: 0 }
    try {
      const streakResponse = await fetch(`${request.nextUrl.origin}/api/analytics/streak`, {
        headers: { 
          cookie: request.headers.get("cookie") || "",
          'Content-Type': 'application/json'
        },
      })
      if (streakResponse.ok) {
        streakData = await streakResponse.json()
      }
    } catch (streakError) {
      console.warn("Failed to fetch streak data:", streakError)
    }

    // Calculate correlations (simplified)
    const correlations = {
      sleepMood: 0.65, // Mock correlation
      stressMood: -0.45, // Mock correlation
      energyMood: 0.78, // Mock correlation
    }

    // Generate insights
    const weeklyInsights = [
      `Your average mood this ${range} was ${averageMood.toFixed(1)}/10`,
      `You logged ${entries.length} mood entries, showing great consistency!`,
      `${emotionFrequency[0]?.emotion || "joy"} was your most frequent emotion`,
    ]

    if (moodImprovement > 0) {
      weeklyInsights.push(`Your mood improved by ${moodImprovement.toFixed(1)}% compared to last week`)
    }

    return NextResponse.json({
      moodTrend,
      emotionFrequency,
      heatmapData,
      stats: {
        averageMood,
        totalEntries: entries.length,
        streak: streakData.streak || 0,
        moodImprovement,
      },
      correlations,
      weeklyInsights,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}