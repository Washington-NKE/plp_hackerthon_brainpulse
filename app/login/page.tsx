"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentMood, setCurrentMood] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Mood-based theme cycling
  const moods = [
    { name: "Energetic", gradient: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)", emoji: "⚡" },
    { name: "Calm", gradient: "linear-gradient(135deg, #48cae4 0%, #023e8a 100%)", emoji: "🌊" },
    { name: "Joyful", gradient: "linear-gradient(135deg, #06ffa5 0%, #00b4d8 100%)", emoji: "✨" },
    { name: "Thoughtful", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", emoji: "🎭" }
  ]

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check for success message from registration
  useEffect(() => {
    if (isClient) {
      const message = searchParams.get('message')
      const errorParam = searchParams.get('error')
      
      if (message) {
        setSuccess(message)
      }
      
      if (errorParam) {
        setError(decodeURIComponent(errorParam))
      }
    }
  }, [searchParams, isClient])

  // Cycle through moods for dynamic theming
  useEffect(() => {
    if (isClient) {
      const interval = setInterval(() => {
        setCurrentMood((prev) => (prev + 1) % moods.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isClient])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        // Wait for session to be established
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      })
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Failed to sign in with Google. Please try again.")
      setIsLoading(false)
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const currentMoodData = moods[currentMood]

  const inputStyle = {
    width: "100%",
    padding: "16px 16px 16px 50px",
    borderRadius: "12px",
    border: "2px solid rgba(0, 0, 0, 0.1)",
    background: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none"
  }

  const focusStyle = {
    border: "2px solid #667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
  }

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      background: currentMoodData.gradient,
      padding: "16px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        width: "80px",
        height: "80px",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        width: "120px",
        height: "120px",
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite reverse"
      }} />

      <div style={{
        position: "absolute",
        top: "60%",
        right: "10px",
        width: "60px",
        height: "60px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        animation: "pulse 4s ease-in-out infinite"
      }} />

      {/* Mood indicator */}
      <div style={{
        position: "absolute",
        top: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "12px 24px",
        border: "1px solid rgba(255, 255, 255, 0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px", animation: "bounce 2s ease-in-out infinite" }}>
            {currentMoodData.emoji}
          </span>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
            Today feels {currentMoodData.name.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Main container */}
      <div style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "450px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "44px",
              fontWeight: "bold",
              background: currentMoodData.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
              animation: "glow 2s ease-in-out infinite alternate"
            }}>
              Welcome Back
            </h1>
            <p style={{
              color: "#6b7280",
              fontSize: "18px"
            }}>
              Continue your mood journey 🌟
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              padding: "16px",
              marginBottom: "24px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              color: "#dc2626",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: "16px",
              marginBottom: "24px",
              background: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "12px",
              color: "#16a34a",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ✅ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Email Input */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => {
                    e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                    e.target.style.boxShadow = "none"
                  }}
                />
                <span style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px"
                }}>
                  📧
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => {
                    e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                    e.target.style.boxShadow = "none"
                  }}
                />
                <span style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px"
                }}>
                  🔒
                </span>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  style={{ 
                    width: "16px", 
                    height: "16px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }} 
                />
                <span style={{ color: "#6b7280" }}>Remember me</span>
              </label>
              <a 
                href="/forgot-password" 
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: isLoading 
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                  : currentMoodData.gradient,
                color: "white",
                fontSize: "18px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                transform: isLoading ? "none" : "translateY(0px)",
                boxShadow: isLoading ? "none" : "0 10px 25px -5px rgba(102, 126, 234, 0.4)"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 15px 35px -5px rgba(102, 126, 234, 0.5)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = "translateY(0px)"
                  e.target.style.boxShadow = "0 10px 25px -5px rgba(102, 126, 234, 0.4)"
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  Signing in...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {currentMoodData.emoji} Sign In
                </span>
              )}
            </button>

            {/* Divider */}
            <div style={{ position: "relative", margin: "24px 0" }}>
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{ width: "100%", borderTop: "1px solid rgba(0, 0, 0, 0.1)" }} />
              </div>
              <div style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                fontSize: "12px",
                textTransform: "uppercase"
              }}>
                <span style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  padding: "0 16px",
                  color: "#6b7280",
                  backdropFilter: "blur(4px)"
                }}>
                  or
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                background: isLoading ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.8)",
                fontSize: "16px",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = "rgba(255, 255, 255, 1)"
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = "rgba(255, 255, 255, 0.8)"
                  e.target.style.boxShadow = "none"
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              New to BrainPulse?{" "}
              <a 
                href="/register" 
                style={{
                  background: currentMoodData.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textDecoration: "none",
                  fontWeight: "600"
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline"
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none"
                }}
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
          100% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.6); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        /* Prevent zoom on iOS */
        input, button, select, textarea {
          font-size: 16px !important;
        }
        
        /* Ensure proper stacking */
        * {
          box-sizing: border-box;
        }
        
        /* Smooth transitions */
        input:focus {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  )
}