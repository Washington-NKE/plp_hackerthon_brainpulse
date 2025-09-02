import prisma from "./prisma"
import bcrypt from "bcrypt"

// Define types manually until Prisma client is generated
type Gender = "MALE" | "FEMALE" | "OTHER"
type Theme = "SYSTEM" | "LIGHT" | "DARK"

// Database utility functions
export async function createUser(
  email: string, 
  name: string, 
  password: string, 
  gender?: Gender
) {
  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash, // Store the hashed password
      gender,
    },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      theme: true,
      createdAt: true
    }
  })

  return user
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      theme: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return user
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      theme: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return user
}

export async function getUserWithPasswordByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      theme: true,
      password: true
    }
  })

  return user
}

export async function updateUserTheme(userId: string, theme: Theme) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { theme },
    select: {
      id: true,
      theme: true,
      updatedAt: true
    }
  })

  return user
}

export async function updateUser(
  userId: string, 
  data: {
    name?: string
    gender?: Gender
    theme?: Theme
  }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      theme: true,
      updatedAt: true
    }
  })

  return user
}

// Journal Entry utilities
export async function createJournalEntry(data: {
  userId: string
  date: Date
  moodScore: number
  emotions?: string[]
  tags?: string[]
  text: string
  sleepHours?: number
  steps?: number
  stressLevel?: number
  triggers?: string[]
}) {
  const entry = await prisma.journalEntry.create({
    data: {
      ...data,
      emotions: data.emotions || [],
      tags: data.tags || [],
      triggers: data.triggers || []
    },
    include: {
      attachments: true
    }
  })

  return entry
}

export async function getJournalEntriesByUser(
  userId: string,
  limit?: number,
  offset?: number
) {
  const entries = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    skip: offset,
    include: {
      attachments: true
    }
  })

  return entries
}

export async function getJournalEntryById(id: string) {
  const entry = await prisma.journalEntry.findUnique({
    where: { id },
    include: {
      attachments: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  return entry
}

export async function updateJournalEntry(
  id: string,
  data: {
    moodScore?: number
    emotions?: string[]
    tags?: string[]
    text?: string
    aiSummary?: string
    aiAffirmation?: string
    sentiment?: number
    sleepHours?: number
    steps?: number
    stressLevel?: number
    triggers?: string[]
  }
) {
  const entry = await prisma.journalEntry.update({
    where: { id },
    data,
    include: {
      attachments: true
    }
  })

  return entry
}

export async function deleteJournalEntry(id: string) {
  // This will cascade delete attachments due to onDelete: Cascade
  await prisma.journalEntry.delete({
    where: { id }
  })
}

// Utility function to get mood trends
export async function getMoodTrends(userId: string, days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId,
      date: {
        gte: startDate
      }
    },
    select: {
      date: true,
      moodScore: true,
      stressLevel: true,
      sleepHours: true
    },
    orderBy: { date: 'asc' }
  })

  return entries
}