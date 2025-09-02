"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Heart, Sparkles, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeProvider } from "@/components/theme-provider"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
}

const CRISIS_KEYWORDS = ["suicide", "kill myself", "end it all", "hopeless", "can't go on", "worthless"]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Pulse Coach, your compassionate AI companion. I'm here to listen, support, and help you navigate your emotional journey. How are you feeling today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectCrisisKeywords = (text: string) => {
    return CRISIS_KEYWORDS.some((keyword) => text.toLowerCase().includes(keyword))
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Check for crisis keywords
    if (detectCrisisKeywords(userMessage.content)) {
      setShowCrisisAlert(true)
    }

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      }

      setMessages((prev) => [...prev, assistantMessage])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, isStreaming: false } : msg)),
                )
                break
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id ? { ...msg, content: msg.content + parsed.content } : msg,
                    ),
                  )
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pulse Coach</h1>
                <p className="text-gray-600">Your compassionate AI companion</p>
              </div>
            </div>
          </motion.div>

          {/* Crisis Alert */}
          <AnimatePresence>
            {showCrisisAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Crisis Support Available:</strong> If you're having thoughts of self-harm, please reach out
                    for immediate help:
                    <br />• National Suicide Prevention Lifeline: 988 • Crisis Text Line: Text HOME to 741741
                    <br />
                    You're not alone, and help is available.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Interface */}
          <Card className="glass h-[600px] flex flex-col">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Chat with Pulse Coach
              </CardTitle>
              <CardDescription>Share your thoughts and feelings. I'm here to listen and support you.</CardDescription>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                        {message.isStreaming && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                            className="inline-block w-2 h-4 bg-current ml-1"
                          />
                        )}
                      </p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send. Remember, I'm here to support you, not replace professional help.
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Button
              variant="outline"
              className="h-auto p-4 text-left bg-transparent"
              onClick={() => setInputValue("I'm feeling anxious today and could use some support.")}
            >
              <div>
                <p className="font-medium">Feeling Anxious</p>
                <p className="text-sm text-gray-600">Get support for anxiety</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 text-left bg-transparent"
              onClick={() => setInputValue("I'd like some guidance on managing stress.")}
            >
              <div>
                <p className="font-medium">Stress Management</p>
                <p className="text-sm text-gray-600">Learn coping strategies</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 text-left bg-transparent"
              onClick={() => setInputValue("Can you help me reflect on my recent mood patterns?")}
            >
              <div>
                <p className="font-medium">Mood Reflection</p>
                <p className="text-sm text-gray-600">Explore your emotions</p>
              </div>
            </Button>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  )
}
