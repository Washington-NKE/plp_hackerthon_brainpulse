
// api/entries/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const createEntrySchema = z.object({
  moodScore: z.number().min(1).max(10),
  primaryEmotion: z.string().optional(),
  secondaryEmotions: z.array(z.string()).optional(),
  text: z.string().min(1),
  tags: z.array(z.string()).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  sleepQuality: z.number().min(1).max(10).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  steps: z.number().min(0).optional(),
  date: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        moodScore: true,
        emotions: true,
        sleepHours: true,
        stressLevel: true,
        text: true,
        tags: true,
        aiSummary: true,
        createdAt: true,
        date: true,
        steps: true,
        sentiment: true,
        triggers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    type Entry = {
      id: string
      moodScore: number
      emotions?: string[]
      sleepHours?: number | null
      stressLevel?: number | null
      text: string
      tags?: string[]
      aiSummary?: string | null
      createdAt: Date
      date: string
      steps?: number | null
      sentiment?: string | null
      triggers?: string[] | null
    }

    // Transform the data to match the expected format from the original API
    const transformedEntries = entries.map((entry: Entry) => ({
      id: entry.id,
      mood_score: entry.moodScore,
      primary_emotion: entry.emotions?.[0] || null,
      secondary_emotions: entry.emotions?.slice(1) || [],
      energy_level: null, // Not in schema, would need to be calculated or added
      stress_level: entry.stressLevel,
      sleep_quality: entry.sleepHours ? Math.round(entry.sleepHours * 1.25) : null, // Convert hours to quality scale
      text: entry.text,
      tags: entry.tags,
      ai_summary: entry.aiSummary,
      created_at: entry.createdAt,
    }))

    return NextResponse.json({ entries: transformedEntries })
  } catch (error) {
    console.error("Error fetching entries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createEntrySchema.parse(body)

    // Combine primary and secondary emotions
    const allEmotions = []
    if (validatedData.primaryEmotion) {
      allEmotions.push(validatedData.primaryEmotion)
    }
    if (validatedData.secondaryEmotions) {
      allEmotions.push(...validatedData.secondaryEmotions)
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        moodScore: validatedData.moodScore,
        emotions: allEmotions,
        stressLevel: validatedData.stressLevel,
        sleepHours: validatedData.sleepHours,
        steps: validatedData.steps,
        text: validatedData.text,
        tags: validatedData.tags || [],
        date: new Date(validatedData.date),
      },
    })

    return NextResponse.json({
      entry: {
        id: entry.id,
        moodScore: entry.moodScore,
        primaryEmotion: entry.emotions?.[0] || null,
        text: entry.text,
        tags: entry.tags,
        createdAt: entry.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating entry:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}