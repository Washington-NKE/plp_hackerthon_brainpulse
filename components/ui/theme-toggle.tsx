"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, User, Users, ChevronDown } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themes = [
    { value: "system", label: "System", icon: Monitor },
    { value: "male", label: "Male", icon: User },
    { value: "female", label: "Female", icon: Users },
  ]

  // Find the currently selected theme object to display its icon and label
  const selectedTheme = themes.find((t) => t.value === theme)

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div className="relative w-40" ref={dropdownRef}>
      {/* The button that triggers the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="flex items-center gap-2">
          {selectedTheme && <selectedTheme.icon className="w-4 h-4" />}
          {selectedTheme ? selectedTheme.label : "Select Theme"}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {/* The dropdown menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="p-1">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value as any)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center w-full gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors",
                    theme === value
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>  
  )
}