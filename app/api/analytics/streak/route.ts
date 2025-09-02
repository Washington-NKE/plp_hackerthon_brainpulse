// api/analytics/streak/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import  prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get distinct dates with entries for the user
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Get unique dates
    const uniqueDates = Array.from(new Set(
      entries.map((entry: { date: Date }) => entry.date.toISOString().split('T')[0])
    )) as string[]
    uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i])
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return NextResponse.json({ streak })
  } catch (error) {
    console.error("Error calculating streak:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
