// /api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth' // adjust path as needed

const prisma = new PrismaClient()

// GET /api/user/settings - Fetch user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        promptPreferences: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Map database schema to frontend expectations
    const settings = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      gender: user.gender?.toLowerCase() || 'default', // Map to frontend format
      plan: 'free', // You'll need to implement subscription logic
      notifications: {
        dailyReminder: true, // Default values - implement proper notification preferences
        weeklyInsights: false,
        coachTips: false
      },
      preferences: {
        theme: user.gender?.toLowerCase() || 'default', // Use gender as theme fallback
        privacy: {
          dataExportEnabled: true
        }
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/user/settings - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notifications, preferences } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user preferences
    const updateData: any = {}
    
    if (preferences?.theme) {
      // Map frontend theme to database gender enum if needed
      const themeToGender = {
        'male': 'MALE',
        'female': 'FEMALE', 
        'default': null
      }
      updateData.gender = themeToGender[preferences.theme as keyof typeof themeToGender] || null
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    // Handle notifications - you might want to create a separate NotificationPreference model
    // For now, we'll just acknowledge the update
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}