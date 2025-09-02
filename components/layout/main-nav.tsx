"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Brain, Home, BookOpen, TrendingUp, Heart, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
//import { ThemeDropdown } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Insights", href: "/insights", icon: TrendingUp },
  { name: "Coach", href: "/coach", icon: Heart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MainNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isHome = pathname === "/" 

  if (!session) return null
  if (isHome) return null

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BrainPulse</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <ThemeDropdown /> */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">BrainPulse</span>
        </Link>

        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-40"
          >
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </div>
                  </Link>
                )
              })}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
                {/* <div className="px-4 py-2">
                  <ThemeDropdown />
                </div> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
