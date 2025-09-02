"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Theme = "light" | "dark" | "male" | "female" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "brainpulse-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const { data: session } = useSession()

  useEffect(() => {
    // Use user's theme preference from session if available
    if (session?.user?.theme) {
      setTheme(session.user.theme as Theme)
    } else {
      const storedTheme = localStorage.getItem(storageKey) as Theme
      if (storedTheme) {
        setTheme(storedTheme)
      }
    }
  }, [session, storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark", "male", "female")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Set CSS custom properties for gender themes
    if (theme === "male") {
      root.style.setProperty("--theme-primary", "220 100% 50%") // Deep blue
      root.style.setProperty("--theme-secondary", "200 100% 60%") // Cyan
      root.style.setProperty("--theme-gradient", "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #06b6d4 100%)")
    } else if (theme === "female") {
      root.style.setProperty("--theme-primary", "320 100% 60%") // Orchid
      root.style.setProperty("--theme-secondary", "45 100% 70%") // Gold
      root.style.setProperty("--theme-gradient", "linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #f97316 100%)")
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
