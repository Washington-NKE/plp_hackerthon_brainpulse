// /api/user/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/user/export - Export user data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        journalEntries: {
          include: {
            attachments: true
          }
        },
        reflections: true,
        insights: true,
        promptPreferences: true,
        notifications: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create export data
    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        theme: user.theme,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      journalEntries: user.journalEntries.map(entry => ({
        id: entry.id,
        date: entry.date,
        moodScore: entry.moodScore,
        emotions: entry.emotions,
        tags: entry.tags,
        text: entry.text,
        aiSummary: entry.aiSummary,
        aiAffirmation: entry.aiAffirmation,
        sentiment: entry.sentiment,
        sleepHours: entry.sleepHours,
        steps: entry.steps,
        stressLevel: entry.stressLevel,
        triggers: entry.triggers,
        createdAt: entry.createdAt,
        attachments: entry.attachments
      })),
      reflections: user.reflections,
      insights: user.insights,
      promptPreferences: user.promptPreferences,
      notifications: user.notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        body: notif.body,
        channel: notif.channel,
        read: notif.read,
        createdAt: notif.createdAt
      })),
      exportedAt: new Date().toISOString()
    }

    const jsonData = JSON.stringify(exportData, null, 2)
    
    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mood-data-${new Date().toISOString().split('T')[0]}.json"`
      }
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}