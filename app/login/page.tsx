"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentMood, setCurrentMood] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Mood-based theme cycling
  const moods = [
    { name: "Energetic", gradient: "energy-gradient", emoji: "⚡" },
    { name: "Calm", gradient: "calm-gradient", emoji: "🌊" },
    { name: "Joyful", gradient: "joy-gradient", emoji: "✨" },
    { name: "Thoughtful", gradient: "mood-gradient", emoji: "🎭" }
  ]

  // Check for success message from registration
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccess(message)
    }
  }, [searchParams])

  // Cycle through moods for dynamic theming
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMood((prev) => (prev + 1) % moods.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const currentMoodData = moods[currentMood]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic background with animated mood patterns */}
      <div className="absolute inset-0 mood-bg-pattern">
        <div className={`absolute inset-0 ${currentMoodData.gradient} opacity-20 animate-gradient-shift`}></div>
        <div className="absolute inset-0 energy-particles"></div>
      </div>
      
      {/* Floating mood elements */}
      <div className="absolute top-16 left-16 w-28 h-28 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full animate-float blur-xl"></div>
      <div className="absolute bottom-16 right-16 w-36 h-36 bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full animate-float blur-xl" style={{animationDelay: "1.5s"}}></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full animate-morphing-blob"></div>
      <div className="absolute bottom-1/3 left-10 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-breathe"></div>

      {/* Mood indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-card px-6 py-3 border-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">{currentMoodData.emoji}</span>
            <span className="text-sm font-medium text-foreground/80">
              Today feels {currentMoodData.name.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-0 animate-card-hover">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-glow">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Continue your mood journey 🌟
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="glass border-red-300/50 animate-pulse-glow">
                  <AlertDescription className="text-sm flex items-center gap-2">
                    ❌ {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="glass border-green-300/50 bg-green-50/20 animate-pulse-glow">
                  <AlertDescription className="text-sm flex items-center gap-2 text-green-700">
                    ✅ {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="glass-button border-white/30 focus:border-blue-400/50 focus:ring-blue-400/30 pl-10 animate-shimmer"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    📧
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="glass-button border-white/30 focus:border-blue-400/50 focus:ring-blue-400/30 pl-10"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    🔒
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/30" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className={`w-full relative overflow-hidden btn-ripple ${currentMoodData.gradient} border-0 shadow-xl animate-pulse-glow transform hover:scale-105 transition-all duration-300`}
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      {currentMoodData.emoji} Sign In
                    </>
                  )}
                </span>
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/80 px-2 text-muted-foreground backdrop-blur-sm">
                  or
                </span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full glass-button border-white/30 hover:bg-white/10"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                New to BrainPulse?{" "}
                <Link 
                  href="/register" 
                  className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}