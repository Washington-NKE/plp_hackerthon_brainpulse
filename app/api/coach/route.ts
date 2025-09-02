// app/api/coach/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface RequestBody {
  message: string
  history: Message[]
}

const SYSTEM_PROMPT = `You are Pulse Coach, a compassionate and empathetic AI mental health companion. Your role is to provide emotional support, active listening, and gentle guidance to users who may be experiencing various emotional challenges.

CORE PRINCIPLES:
- Be warm, empathetic, and non-judgmental
- Practice active listening and validate emotions
- Provide gentle guidance without being prescriptive
- Encourage professional help when appropriate
- Maintain appropriate boundaries as an AI companion

RESPONSE GUIDELINES:
- Keep responses conversational and supportive (2-4 sentences typically)
- Use empathetic language and acknowledge feelings
- Ask thoughtful follow-up questions to encourage reflection
- Offer practical coping strategies when appropriate
- Be genuine and avoid overly clinical language

CRISIS SITUATIONS:
If someone expresses suicidal thoughts or severe distress:
- Take it seriously and express concern
- Encourage immediate professional help
- Provide crisis hotline information
- Stay supportive while emphasizing the need for professional intervention

BOUNDARIES:
- You are not a replacement for professional therapy or medical care
- You cannot provide clinical diagnoses or medical advice
- Encourage users to seek professional help for persistent or severe issues
- Be honest about your limitations as an AI

Remember: Your goal is to be a supportive companion who helps users feel heard, validated, and gently guided toward better emotional wellbeing.`

export async function POST(request: NextRequest) {
  try {
    const { message, history }: RequestBody = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service is not properly configured' },
        { status: 500 }
      )
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    })

    // Build conversation history for context
    const conversationHistory = history
      ?.slice(-5) // Last 5 messages for context
      ?.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      ?.join('\n') || ''

    // Construct the prompt with context
    const fullPrompt = conversationHistory 
      ? `Previous conversation context:\n${conversationHistory}\n\nCurrent user message: ${message}\n\nPlease respond as Pulse Coach:`
      : `User message: ${message}\n\nPlease respond as Pulse Coach:`

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate content with streaming
          const result = await model.generateContentStream(fullPrompt)
          
          for await (const chunk of result.stream) {
            const chunkText = chunk.text()
            if (chunkText) {
              const data = `data: ${JSON.stringify({ content: chunkText })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          
          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Gemini API error:', error)
          const errorData = `data: ${JSON.stringify({ 
            content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment." 
          })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}