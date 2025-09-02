
"use client"

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { ArrowRight, Brain, Heart, TrendingUp, Sparkles, Shield, Users, Star, Zap, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { useEffect, useState } from "react"

const FloatingParticle = ({ delay, duration, x, y, size }: { delay: number, duration: number, x: string, y: string, size: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-sm"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
    }}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

const GlowingOrb = ({ className, children, delay = 0 }: { className?: string, children: React.ReactNode, delay?: number }) => (
  <motion.div
    className={`relative ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    whileHover={{ scale: 1.05 }}
  >
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <div className="relative z-10">{children}</div>
  </motion.div>
)

function currentYear() {
  return new Date().getFullYear();
}

export default function EnhancedLandingPage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, 50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const session = useSession()

  const springX = useSpring(mousePosition.x, { stiffness: 300, damping: 30 })
  const springY = useSpring(mousePosition.y, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.01,
        y: (e.clientY - window.innerHeight / 2) * 0.01,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.17, 0.67, 0.83, 0.67], // cubic-bezier for easeOut
      },
    },
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden mood-bg-pattern energy-particles">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Morphing gradient blobs */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 animate-morphing-blob"
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)",
              x: springX,
              y: springY,
              opacity,
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 animate-morphing-blob"
            style={{
              background: "linear-gradient(135deg, #4facfe, #00f2fe, #43e97b, #38f9d7)",
              x: springX,
              y: springY,
              opacity,
            }}
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Floating particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.5}
              duration={8 + i * 0.5}
              x={`${Math.random() * 100}%`}
              y={`${Math.random() * 100}%`}
              size={Math.random() * 8 + 4}
            />
          ))}
        </div>

        {/* Enhanced Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto"
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <GlowingOrb className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center animate-breathe">
              <Brain className="w-6 h-6 text-white" />
            </GlowingOrb>
            <span className="text-2xl font-bold text-gray-900 animate-text-glow">BrainPulse</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {session.status !== 'unauthenticated' ? 
            <div>
            <Link href="/dashboard">Dashboard</Link>
            <Button onClick={() => signOut()}>
              Logout
            </Button> 
            </div>
            : 
            <div>
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="glass-button hover:scale-105 transition-all duration-300 animate-shimmer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-ripple bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started
              </Button>
            </Link>
            </div>
            }
          </div>
        </motion.nav>

        {/* Enhanced Hero Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/25 btn-ripple animate-pulse-glow"
                  >
                    Start Your Journey
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-12 py-4 glass-card border-2 border-purple-200 hover:border-purple-400 text-gray-700 hover:text-purple-700 shadow-xl"
                  >
                    Explore Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Heart,
                title: "Mood Tracking",
                description: "Experience emotional tracking like never before with our intuitive mood dial, emotion chips, and AI-powered pattern recognition.",
                gradient: "from-red-500 to-pink-500",
                delay: 0,
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description: "Discover deep insights about your emotional journey with stunning visualizations and personalized trend analysis.",
                gradient: "from-purple-500 to-indigo-500",
                delay: 0.2,
              },
              {
                icon: Sparkles,
                title: "AI Companion",
                description: "Get compassionate, evidence-based guidance from your personal AI wellness coach that learns and grows with you.",
                gradient: "from-emerald-500 to-teal-500",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: feature.delay + 0.8,
                  duration: 0.8,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  scale: 1.02,
                }}
                className="group"
              >
                <Card className="glass-card border-0 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 animate-card-hover h-full">
                  <CardContent className="p-8 text-center space-y-6 h-full flex flex-col justify-center">
                    <GlowingOrb 
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                      delay={feature.delay + 1}
                    >
                      <motion.div
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center animate-breathe`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </motion.div>
                    </GlowingOrb>
                    
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: feature.delay + 1.2 }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-600 leading-relaxed text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: feature.delay + 1.4 }}
                    >
                      {feature.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-32 text-center space-y-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900"
              animate={{
                backgroundImage: [
                  "linear-gradient(45deg, #667eea, #764ba2)",
                  "linear-gradient(45deg, #f093fb, #f5576c)",
                  "linear-gradient(45deg, #4facfe, #00f2fe)",
                  "linear-gradient(45deg, #667eea, #764ba2)",
                ],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              Built with Care & Innovation
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Privacy First",
                  description: "Your emotional data is encrypted with military-grade security. We never share your personal journey.",
                  color: "text-blue-600",
                  delay: 1.6,
                },
                {
                  icon: Brain,
                  title: "Science-Based",
                  description: "Built with guidance from mental health professionals using proven psychological frameworks and research.",
                  color: "text-purple-600",
                  delay: 1.8,
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Join thousands of users on their journey to better mental health in a supportive, understanding environment.",
                  color: "text-green-600",
                  delay: 2.0,
                },
              ].map((trust, index) => (
                <motion.div
                  key={trust.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: trust.delay,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center space-y-4 p-6 rounded-2xl glass hover:glass-dark transition-all duration-300"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <trust.icon className={`w-16 h-16 ${trust.color}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900">{trust.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {trust.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mt-32 text-center space-y-12"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Loved by Thousands
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Sarah M.",
                  role: "Psychology Student",
                  content: "BrainPulse helped me understand my emotional patterns in ways I never imagined. The AI insights are incredibly accurate and compassionate.",
                  rating: 5,
                  delay: 2.4,
                },
                {
                  name: "Alex R.",
                  role: "Software Engineer",
                  content: "The mood tracking is intuitive and the analytics are beautiful. It's like having a personal therapist in my pocket.",
                  rating: 5,
                  delay: 2.6,
                },
                {
                  name: "Maya L.",
                  role: "Teacher",
                  content: "This app has transformed how I approach my mental health. The daily insights help me stay balanced and mindful.",
                  rating: 5,
                  delay: 2.8,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: testimonial.delay, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: testimonial.delay + (i * 0.1), duration: 0.3 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 text-lg">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.8 }}
            className="mt-32 text-center space-y-8"
            style={{ y: y2 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                rotateX: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="space-y-6"
            >
              <h2 className="text-5xl font-bold text-gray-900 animate-text-glow">
                Ready to Transform Your Emotional Journey?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join BrainPulse today and discover the power of understanding your emotions. 
                Your path to better mental wellbeing starts with a single step.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="text-xl px-16 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-2xl hover:shadow-purple-500/30 btn-ripple animate-pulse-glow transform transition-all duration-300"
                >
                  Begin Your Journey Free
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          className="relative z-10 mt-32 border-t border-purple-200/50 glass backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <GlowingOrb className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </GlowingOrb>
                <span className="text-xl font-bold text-gray-900">BrainPulse</span>
              </motion.div>
              
              <motion.p 
                className="text-gray-600"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                © {currentYear()} BrainPulse. Crafted with ❤️ for your mental wellbeing journey.
              </motion.p>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Moon className="w-6 h-6 text-purple-600 animate-float" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: -10 }}>
                  <Zap className="w-6 h-6 text-pink-600 animate-breathe" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2, rotate: 15 }}>
                  <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </ThemeProvider>
     )
}