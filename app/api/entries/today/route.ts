
// api/entries/today/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const entry = await prisma.journalEntry.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        id: true,
        moodScore: true,
        emotions: true,
        text: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedEntry = entry
      ? {
          id: entry.id,
          moodScore: entry.moodScore,
          primaryEmotion: entry.emotions?.[0] || null,
          text: entry.text,
          createdAt: entry.createdAt,
        }
      : null

    return NextResponse.json({ entry: formattedEntry })
  } catch (error) {
    console.error("Error fetching today's entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
