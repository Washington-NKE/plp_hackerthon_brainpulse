"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    gender: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [themeClass, setThemeClass] = useState("")
  const router = useRouter()

  // Apply theme based on selected gender
  useEffect(() => {
    if (formData.gender === "male") {
      setThemeClass("male")
    } else if (formData.gender === "female") {
      setThemeClass("female")
    } else {
      setThemeClass("")
    }
  }, [formData.gender])

  // Apply theme class to body
  useEffect(() => {
    document.body.className = themeClass
    return () => {
      document.body.className = ""
    }
  }, [themeClass])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          gender: formData.gender,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
      } else {
        router.push("/login?message=Registration successful")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic background with mood patterns */}
      <div className="absolute inset-0 mood-bg-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-gradient-shift"></div>
        <div className="absolute inset-0 energy-particles"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-float blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full animate-float blur-xl" style={{animationDelay: "1s"}}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full animate-morphing-blob"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-0 animate-card-hover">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-glow">
              Join BrainPulse
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Begin your mood journey today ✨
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="glass border-red-300/50 animate-pulse-glow">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="glass-button border-white/30 focus:border-purple-400/50 focus:ring-purple-400/30 animate-shimmer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="glass-button border-white/30 focus:border-purple-400/50 focus:ring-purple-400/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-foreground/80">
                  Gender (Optional)
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="glass-button border-white/30 focus:border-purple-400/50 focus:ring-purple-400/30">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/30">
                    <SelectItem value="male" className="focus:bg-blue-100/20">
                      Male
                    </SelectItem>
                    <SelectItem value="female" className="focus:bg-pink-100/20">
                      Female
                    </SelectItem>
                    <SelectItem value="non-binary" className="focus:bg-purple-100/20">
                      Non-binary
                    </SelectItem>
                    <SelectItem value="prefer-not-to-say" className="focus:bg-gray-100/20">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="glass-button border-white/30 focus:border-purple-400/50 focus:ring-purple-400/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                    Confirm
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="glass-button border-white/30 focus:border-purple-400/50 focus:ring-purple-400/30"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full relative overflow-hidden btn-ripple bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 border-0 shadow-xl animate-pulse-glow transform hover:scale-105 transition-all duration-300" 
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating your journey...
                    </>
                  ) : (
                    <>
                      🚀 Create Account
                    </>
                  )}
                </span>
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}