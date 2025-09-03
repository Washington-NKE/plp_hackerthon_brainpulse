"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

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
  const [isClient, setIsClient] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const router = useRouter()

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showGenderDropdown && !event.target.closest('[data-dropdown]')) {
        setShowGenderDropdown(false)
      }
    }

    if (showGenderDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showGenderDropdown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
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
        // Registration successful, now automatically log them in
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (signInResult?.error) {
          // Registration worked but login failed - redirect to login with message
          router.push("/login?message=Registration successful! Please sign in.")
        } else if (signInResult?.ok) {
          // Both registration and login successful - redirect to dashboard
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
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

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ]

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid rgba(0, 0, 0, 0.1)",
    background: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    MozAppearance: "textfield"
  }

  const focusStyle = {
    border: "2px solid #667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
  }

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "16px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "100px",
        height: "100px",
        background: "linear-gradient(45deg, #ff6b6b, #feca57)",
        borderRadius: "50%",
        opacity: 0.7,
        animation: "float 6s ease-in-out infinite"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "15%",
        width: "150px",
        height: "150px",
        background: "linear-gradient(45deg, #48cae4, #023e8a)",
        borderRadius: "50%",
        opacity: 0.6,
        animation: "float 8s ease-in-out infinite reverse"
      }} />

      <div style={{
        position: "absolute",
        top: "60%",
        left: "5%",
        width: "80px",
        height: "80px",
        background: "linear-gradient(45deg, #06ffa5, #00b4d8)",
        borderRadius: "50%",
        opacity: 0.5,
        animation: "pulse 4s ease-in-out infinite"
      }} />

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
          maxWidth: "500px",
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
              fontSize: "40px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
              animation: "glow 2s ease-in-out infinite alternate"
            }}>
              Join BrainPulse ✨
            </h1>
            <p style={{
              color: "#6b7280",
              fontSize: "18px"
            }}>
              Begin your mood journey today
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              padding: "16px",
              marginBottom: "24px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              color: "#dc2626",
              fontSize: "14px"
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "2px solid rgba(0, 0, 0, 0.1)",
              background: "white",
              color: "#374151",
              fontSize: "16px",
              fontWeight: "500",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.background = "#f9fafb"
                e.target.style.transform = "translateY(-1px)"
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.background = "white"
                e.target.style.transform = "translateY(0px)"
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "24px 0",
            gap: "16px"
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(0, 0, 0, 0.1)" }}></div>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(0, 0, 0, 0.1)" }}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Name Input */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => {
                  e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

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
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => {
                  e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            {/* Gender Dropdown */}
            <div data-dropdown style={{ position: "relative" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#374151",
                fontSize: "14px"
              }}>
                Gender (Optional)
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowGenderDropdown(!showGenderDropdown)
                }}
                style={{
                  ...inputStyle,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  color: formData.gender ? "#374151" : "#9ca3af"
                }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => {
                  setTimeout(() => {
                    e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                    e.target.style.boxShadow = "none"
                  }, 200)
                }}
              >
                <span>
                  {formData.gender ? genderOptions.find(opt => opt.value === formData.gender)?.label : "Select your gender"}
                </span>
                <span style={{ 
                  transform: showGenderDropdown ? "rotate(180deg)" : "rotate(0deg)", 
                  transition: "transform 0.3s ease",
                  fontSize: "12px"
                }}>
                  ▼
                </span>
              </button>

              {showGenderDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "2px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  marginTop: "4px",
                  zIndex: 1000,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}>
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData({ ...formData, gender: option.value })
                        setShowGenderDropdown(false)
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "background-color 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f3f4f6"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password Inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                <input
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => {
                    e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Confirm
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => {
                    e.target.style.border = "2px solid rgba(0, 0, 0, 0.1)"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
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
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
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
                  Creating your account...
                </span>
              ) : (
                "🚀 Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Already have an account?{" "}
              <a 
                href="/login" 
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                Sign in here
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
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
          100% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.6); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Prevent zoom on iOS */
        input, button, select, textarea {
          font-size: 16px !important;
        }
        
        /* Ensure proper stacking */
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}