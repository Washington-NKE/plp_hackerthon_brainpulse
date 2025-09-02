import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/auth-provider"
import { MainNav } from "@/components/layout/main-nav"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BrainPulse - Your Personal Mood Journal",
  description:
    "Track your emotions, understand your patterns, and improve your mental wellbeing with AI-powered insights and compassionate guidance.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <MainNav />
            {children}
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
