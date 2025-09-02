"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Check, Crown, Sparkles, Shield, Zap, Brain, Heart, TrendingUp, 
  ArrowRight, Star, Users, MessageCircle, Phone, Mail, X 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [showFAQ, setShowFAQ] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free Forever",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for exploring mood tracking basics",
      icon: Heart,
      color: "from-gray-400 to-gray-600",
      features: [
        "Basic mood tracking",
        "Simple emotion logging",
        "7-day mood history",
        "Basic insights",
        "Community support",
        "Mobile app access"
      ],
      limitations: [
        "Limited to 3 entries per day",
        "No AI insights",
        "No advanced analytics",
        "No data export"
      ],
      cta: "Get Started Free",
      highlight: false
    },
    {
      id: "basic",
      name: "Essential",
      price: { monthly: 499, annual: 4990 },
      description: "Everything you need for consistent mood tracking",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      features: [
        "Unlimited mood entries",
        "Advanced emotion tracking",
        "30-day detailed history",
        "Trend analysis & patterns",
        "Weekly insights reports",
        "Data export (CSV/PDF)",
        "Email support",
        "Custom mood categories",
        "Mood reminders"
      ],
      limitations: [
        "No AI companion",
        "Limited analytics depth"
      ],
      cta: "Start Essential",
      highlight: false
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 999, annual: 9990 },
      description: "AI-powered insights and advanced analytics",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      popular: true,
      features: [
        "Everything in Essential",
        "AI-powered mood insights",
        "Personalized recommendations",
        "Unlimited history & analytics",
        "Advanced dashboard",
        "Mood prediction patterns",
        "Integration with health apps",
        "Priority support",
        "Data backup & sync",
        "Goal tracking & achievements"
      ],
      limitations: [],
      cta: "Go Premium",
      highlight: true
    },
    {
      id: "professional",
      name: "Professional",
      price: { monthly: 1999, annual: 19990 },
      description: "For therapists, coaches, and wellness professionals",
      icon: Crown,
      color: "from-amber-500 to-orange-600",
      features: [
        "Everything in Premium",
        "Multi-client management",
        "Professional reporting tools",
        "White-label customization",
        "API access & integrations",
        "Advanced client analytics",
        "Dedicated account manager",
        "HIPAA compliance tools",
        "Custom branding",
        "Team collaboration features"
      ],
      limitations: [],
      cta: "Go Professional",
      highlight: false
    }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Kimani",
      role: "Clinical Psychologist",
      content: "BrainPulse has revolutionized how I track my clients' progress. The professional features are exactly what I needed.",
      rating: 5,
      plan: "Professional"
    },
    {
      name: "Michael Ochieng",
      role: "University Student",
      content: "The Premium AI insights helped me understand my stress patterns during exams. Game-changer for my mental health!",
      rating: 5,
      plan: "Premium"
    },
    {
      name: "Grace Wanjiku",
      role: "Working Professional",
      content: "Simple, effective mood tracking that fits into my busy schedule. The Essential plan gives me everything I need.",
      rating: 5,
      plan: "Essential"
    }
  ]

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa, Airtel Money, Visa, Mastercard, and bank transfers. All payments are processed securely."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "We offer a 14-day free trial for Premium and Professional plans. No credit card required to start."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation. You can export all your data during this period."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students get 50% off Premium plans with valid student ID. Contact support for your discount code."
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getSavings = (plan: any) => {
    if (plan.price.monthly === 0) return 0
    const monthlyTotal = plan.price.monthly * 12
    const savings = monthlyTotal - plan.price.annual
    return Math.round((savings / monthlyTotal) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/30 to-teal-200/30 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your mental wellbeing with BrainPulse. Start free and upgrade 
              when you're ready for advanced insights and AI-powered guidance.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200"
            >
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                  !isAnnual ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium relative ${
                  isAnnual ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <Badge className="absolute -top-3 -right-3 bg-green-500 text-xs animate-pulse">
                  Save up to 17%
                </Badge>
              </button>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card 
                  className={`h-full transition-all duration-500 ${
                    plan.highlight 
                      ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20 scale-105 z-10' 
                      : 'shadow-lg hover:shadow-xl hover:scale-102'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 animate-pulse">
                        ⭐ Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center space-y-6 pb-8">
                    <motion.div
                      className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <plan.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gray-900">
                        {plan.price.monthly === 0 ? "Free" : 
                         formatPrice(plan.price[isAnnual ? 'annual' : 'monthly'])}
                      </div>
                      {plan.price.monthly > 0 && (
                        <div className="space-y-1">
                          <div className="text-gray-600">
                            {isAnnual ? 'per year' : 'per month'}
                          </div>
                          {isAnnual && getSavings(plan) > 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Save {getSavings(plan)}%
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex} 
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                      
                      {plan.limitations.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2 font-medium">Not included:</p>
                          {plan.limitations.map((limitation, limitIndex) => (
                            <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                              <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      className={`w-full py-3 font-medium transition-all duration-300 ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                          : plan.id === 'free'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Users Across Kenya
            </h2>
            <p className="text-xl text-gray-600">
              See how BrainPulse is transforming mental wellness journeys
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 text-center">
                  "{testimonial.content}"
                </p>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <Badge variant="secondary" className="mt-2">
                    {testimonial.plan} User
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about BrainPulse pricing
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MessageCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Mental Wellness?
            </h2>
            <p className="text-xl text-purple-100">
              Join thousands of Kenyans who are already on their journey to better mental health
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-medium transition-all duration-300"
              >
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-purple-100 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact & Support Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+254 700 123 456</p>
              <p className="text-gray-600">Mon-Fri 9AM-6PM EAT</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@brainpulse.co.ke</p>
              <p className="text-gray-600">24/7 response time</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-orange-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600">Instant help available</p>
              <p className="text-gray-600">In-app messaging</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-gray-600">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Bank-level Security</p>
                <p className="text-sm">256-bit SSL encryption</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-600">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">10,000+ Happy Users</p>
                <p className="text-sm">Across Kenya & East Africa</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-600">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-semibold text-gray-900">4.9/5 Rating</p>
                <p className="text-sm">App Store & Play Store</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage