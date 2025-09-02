"use client"

import { motion } from "framer-motion"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating gradient orbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full opacity-20 blur-xl"
          style={{
            background: `linear-gradient(45deg, ${i % 2 === 0 ? "#8b5cf6, #ec4899" : "#06b6d4, #10b981"})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
