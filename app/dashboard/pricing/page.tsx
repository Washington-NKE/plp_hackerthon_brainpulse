"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Crown, Sparkles, Shield, Zap, Brain, Heart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const PricingSettings = () => {
  const [currentPlan, setCurrentPlan] = useState("basic")
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("basic")

  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started with mood tracking",
      icon: Heart,
      color: "from-gray-400 to-gray-600",
      features: [
        "Basic mood tracking",
        "Simple emotion logging",
        "7-day mood history",
        "Basic insights",
        "Community support"
      ],
      limitations: [
        "Limited to 3 entries per day",
        "No AI insights",
        "No advanced analytics"
      ]
    },
    {
      id: "basic",
      name: "Basic",
      price: { monthly: 499, annual: 4990 },
      description: "Essential features for consistent mood tracking",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      popular: false,
      features: [
        "Unlimited mood entries",
        "Advanced emotion tracking",
        "30-day mood history",
        "Trend analysis",
        "Weekly insights",
        "Export data (CSV)",
        "Email support"
      ],
      limitations: [
        "No AI companion",
        "Limited analytics depth"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 999, annual: 9990 },
      description: "Advanced insights and AI-powered guidance",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      popular: true,
      features: [
        "Everything in Basic",
        "AI-powered insights",
        "Personalized recommendations",
        "Unlimited history",
        "Advanced analytics dashboard",
        "Custom mood categories",
        "Priority support",
        "Data backup & sync"
      ],
      limitations: []
    },
    {
      id: "pro",
      name: "Professional",
      price: { monthly: 1999, annual: 19990 },
      description: "For therapists, coaches, and wellness professionals",
      icon: Crown,
      color: "from-gold-500 to-orange-600",
      features: [
        "Everything in Premium",
        "Multi-client management",
        "Professional reporting",
        "White-label options",
        "API access",
        "Advanced integrations",
        "Dedicated account manager",
        "Custom analytics",
        "HIPAA compliance tools"
      ],
      limitations: []
    }
  ]

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleUpgrade = () => {
    // Here you would integrate with your payment system
    setCurrentPlan(selectedPlan)
    // Show success notification
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Current Plan Status */}
      <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold capitalize">{currentPlan} Plan</h3>
              <p className="text-gray-600">
                {currentPlan === "free" ? "Free forever" : 
                 `${formatPrice(plans.find(p => p.id === currentPlan)?.price[isAnnual ? 'annual' : 'monthly'] || 0)} ${isAnnual ? 'per year' : 'per month'}`}
              </p>
            </div>
            <Badge variant={currentPlan === "premium" ? "default" : "secondary"} className="text-sm">
              {currentPlan === "free" ? "Free Tier" : 
               currentPlan === "premium" ? "Most Popular" : "Active"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-full">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              !isAnnual ? 'bg-white shadow-md text-purple-600' : 'text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full transition-all duration-300 relative ${
              isAnnual ? 'bg-white shadow-md text-purple-600' : 'text-gray-600'
            }`}
          >
            Annual
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-xs">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <Card 
              className={`h-full transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-purple-500 shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102'
              } ${plan.popular ? 'border-purple-200' : ''}`}
              onClick={() => handlePlanChange(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4">
                <motion.div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <plan.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {plan.price.monthly === 0 ? "Free" : 
                     formatPrice(plan.price[isAnnual ? 'annual' : 'monthly'])}
                  </div>
                  {plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-600">
                      {isAnnual ? 'per year' : 'per month'}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-2 opacity-60">
                          <span className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0">×</span>
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlanChange(plan.id)
                  }}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 
                   plan.id === 'free' ? 'Downgrade' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {selectedPlan !== currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center space-x-4"
          >
            <Button
              variant="outline"
              onClick={() => setSelectedPlan(currentPlan)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleUpgrade}
            >
              {selectedPlan === "free" ? "Downgrade to Free" : 
               plans.find(p => p.id === selectedPlan)?.price.monthly === 0 ? "Continue with Free" : 
               "Upgrade Plan"}
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Security Note */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-green-900">Secure Payment</h4>
              <p className="text-sm text-green-700 mt-1">
                All payments are secured with 256-bit SSL encryption. We support M-Pesa, 
                Airtel Money, and major credit cards. Cancel anytime with no hidden fees.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PricingSettings