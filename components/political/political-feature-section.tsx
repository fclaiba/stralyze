'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, MessageSquare, Target } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Data-Driven Campaign Analytics",
    description:
      "Leverage cutting-edge algorithms and voter data analysis to uncover actionable insights for your political campaign.",
    icon: BarChart3,
  },
  {
    title: "Strategic Message Development",
    description:
      "Craft compelling narratives that resonate with your constituency and effectively communicate your policy positions.",
    icon: MessageSquare,
  },
  {
    title: "Electoral Trend Forecasting",
    description:
      "Utilize sophisticated predictive modeling to anticipate voter behavior and stay ahead of political shifts.",
    icon: TrendingUp,
  },
  {
    title: "Precision Voter Targeting",
    description: "Implement hyper-targeted outreach using advanced demographic and psychographic segmentation.",
    icon: Target,
  },
]

export default function PoliticalFeatureSection() {
  return (
    <section id="political-features" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          Strategic Political Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-gray-700 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <feature.icon className="h-10 w-10 text-white mb-4" />
                  </motion.div>
                  <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
