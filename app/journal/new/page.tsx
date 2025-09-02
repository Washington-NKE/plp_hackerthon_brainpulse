"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MoodDial } from "@/components/ui/mood-dial"
import { EmotionChips } from "@/components/ui/emotion-chips"
import { TagInput } from "@/components/ui/tag-input"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"

export default function NewEntryPage() {
  const [formData, setFormData] = useState({
    moodScore: 5,
    primaryEmotion: "",
    secondaryEmotions: [] as string[],
    text: "",
    tags: [] as string[],
    energyLevel: 5,
    stressLevel: 5,
    sleepQuality: 5,
    gratitudeNotes: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        router.push("/journal")
      } else {
        console.error("Failed to create entry")
      }
    } catch (error) {
      console.error("Error creating entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/journal">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">New Journal Entry</h1>
            </div>
            <p className="text-gray-600">How are you feeling right now?</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Score */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Overall Mood</CardTitle>
                  <CardDescription>Rate your current mood from 1 (low) to 10 (high)</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <MoodDial
                    value={formData.moodScore}
                    onChange={(value) => setFormData({ ...formData, moodScore: value })}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Emotions */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Emotions</CardTitle>
                  <CardDescription>What emotions are you experiencing?</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmotionChips
                    selectedEmotions={formData.secondaryEmotions}
                    onChange={(emotions) => {
                      setFormData({
                        ...formData,
                        secondaryEmotions: emotions,
                        primaryEmotion: emotions[0] || "",
                      })
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Journal Text */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Your Thoughts</CardTitle>
                  <CardDescription>Write about your day, feelings, or anything on your mind</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What's on your mind today?"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="min-h-32 resize-none"
                    required
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Add tags to categorize this entry</CardDescription>
                </CardHeader>
                <CardContent>
                  <TagInput
                    tags={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                    placeholder="work, family, exercise..."
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <Link href="/journal" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  )
}
