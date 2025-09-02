"use client"

import { useState, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
}

export function TagInput({ tags, onChange, placeholder = "Add tags...", maxTags = 10, className }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isInputFocused, setIsInputFocused] = useState(false)

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Input field */}
      <div
        className={cn(
          "flex items-center gap-2 p-3 border rounded-lg transition-all",
          isInputFocused ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200",
        )}
      >
        <Plus className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={handleInputBlur}
          placeholder={tags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
          disabled={tags.length >= maxTags}
          className="flex-1 outline-none text-sm placeholder-gray-400 disabled:cursor-not-allowed"
        />
      </div>

      {/* Tags display */}
      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Press Enter or comma to add tags</span>
        <span>
          {tags.length}/{maxTags}
        </span>
      </div>
    </div>
  )
}
