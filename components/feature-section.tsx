'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Lightbulb, Target } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Advanced Data Analytics",
    description:
      "Leverage cutting-edge algorithms and big data analysis to uncover actionable insights for your business.",
    icon: BarChart3,
  },
  {
    title: "Predictive Market Modeling",
    description:
      "Utilize sophisticated forecasting techniques to anticipate market trends and stay ahead of the competition.",
    icon: TrendingUp,
  },
  {
    title: "Strategic Innovation Planning",
    description:
      "Develop forward-thinking strategies that position your brand at the forefront of industry innovation.",
    icon: Lightbulb,
  },
  {
    title: "Precision Targeting",
    description: "Implement hyper-targeted campaigns using advanced segmentation and personalization technologies.",
    icon: Target,
  },
]

export default function FeatureSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          Professional Strategic Services
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
