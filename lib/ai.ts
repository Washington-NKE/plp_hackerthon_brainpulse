// AI utility functions for BrainPulse

export interface CoachingContext {
  recentMoods: number[]
  commonEmotions: string[]
  stressLevel: number
  sleepQuality: number
  lastEntryText?: string
}

export function generateSystemPrompt(context?: CoachingContext): string {
  let basePrompt = `You are Pulse Coach, an empathetic mental health assistant specializing in supportive conversations and evidence-based guidance. Your responses should be:

TONE & APPROACH:
- Warm, compassionate, and non-judgmental
- Validating of the user's feelings and experiences
- Encouraging but realistic
- Professional yet approachable

CORE PRINCIPLES:
- Use CBT/DBT techniques when appropriate
- Focus on emotional validation first, then gentle guidance
- Encourage self-reflection and awareness
- Provide actionable micro-steps, not overwhelming advice
- Normalize struggles and emphasize resilience

SAFETY GUIDELINES:
- Never provide medical diagnoses or replace professional therapy
- For crisis situations, acknowledge the pain and gently suggest professional resources
- Avoid giving specific medical or psychiatric advice
- Encourage professional help when appropriate

RESPONSE STRUCTURE:
- Acknowledge and validate their feelings (1-2 sentences)
- Provide gentle insight or reframing (2-3 sentences)
- Offer one small, actionable suggestion (1-2 sentences)
- End with encouragement or a thoughtful question

Keep responses under 180 words unless providing a summary.`

  if (context) {
    basePrompt += `\n\nUSER CONTEXT:
- Recent mood average: ${context.recentMoods.length > 0 ? (context.recentMoods.reduce((a, b) => a + b, 0) / context.recentMoods.length).toFixed(1) : "N/A"}/10
- Common emotions: ${context.commonEmotions.join(", ") || "N/A"}
- Stress level: ${context.stressLevel || "N/A"}/10
- Sleep quality: ${context.sleepQuality || "N/A"}/10

Use this context to provide more personalized support, but don't explicitly mention these numbers unless relevant.`
  }

  return basePrompt
}

export function detectCrisisKeywords(text: string): boolean {
  const crisisKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "hopeless",
    "can't go on",
    "worthless",
    "better off dead",
    "want to die",
    "no point",
    "give up",
  ]

  const lowerText = text.toLowerCase()
  return crisisKeywords.some((keyword) => lowerText.includes(keyword))
}

export function generateAffirmation(mood: number, emotions: string[] = []): string {
  const affirmations = {
    low: [
      "You are stronger than you know, and this difficult moment will pass.",
      "Your feelings are valid, and you deserve compassion - especially from yourself.",
      "Every small step forward is progress worth celebrating.",
      "You have survived difficult times before, and you have the strength to get through this too.",
    ],
    medium: [
      "You are exactly where you need to be in your journey of growth and healing.",
      "Your awareness of your emotions shows wisdom and emotional intelligence.",
      "You have the power to choose how you respond to life's challenges.",
      "Every day you choose to keep going is an act of courage.",
    ],
    high: [
      "Your positive energy is a gift to yourself and those around you.",
      "You are creating a life filled with meaning and joy.",
      "Your resilience and optimism inspire growth and healing.",
      "You have the power to turn your dreams into reality.",
    ],
  }

  let category: keyof typeof affirmations = "medium"
  if (mood <= 4) category = "low"
  else if (mood >= 7) category = "high"

  const categoryAffirmations = affirmations[category]
  return categoryAffirmations[Math.floor(Math.random() * categoryAffirmations.length)]
}

export function generateInsight(moodData: number[], emotions: string[]): string {
  const avgMood = moodData.reduce((a, b) => a + b, 0) / moodData.length
  const moodTrend = moodData.length > 1 ? moodData[moodData.length - 1] - moodData[0] : 0

  const insights = []

  if (avgMood >= 7) {
    insights.push("You've been maintaining a positive mood lately - that's wonderful!")
  } else if (avgMood <= 4) {
    insights.push(
      "I notice you've been going through a challenging time. Remember that seeking support is a sign of strength.",
    )
  }

  if (moodTrend > 1) {
    insights.push(
      "Your mood has been trending upward, which shows your resilience and the positive steps you're taking.",
    )
  } else if (moodTrend < -1) {
    insights.push(
      "I see your mood has been declining. This might be a good time to focus on self-care and consider what support you need.",
    )
  }

  if (emotions.includes("Anxious") || emotions.includes("Fear")) {
    insights.push(
      "Anxiety seems to be a frequent visitor. Remember that anxiety often tries to protect us, even when it feels uncomfortable.",
    )
  }

  if (emotions.includes("Grateful") || emotions.includes("Joy")) {
    insights.push(
      "I love seeing gratitude and joy in your emotional landscape. These positive emotions can be powerful anchors during difficult times.",
    )
  }

  return insights.length > 0
    ? insights[Math.floor(Math.random() * insights.length)]
    : "Every emotion you experience is valuable information about your inner world and needs."
}
