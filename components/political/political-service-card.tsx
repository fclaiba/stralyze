'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PoliticalServiceCardProps {
  title: string
  description: string
  features: string[]
  index: number
}

export function PoliticalServiceCard({ title, description, features, index }: PoliticalServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-white/5 border-gray-700 backdrop-blur-sm h-full flex flex-col hover:bg-white/10 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
          <CardDescription className="text-gray-300">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button className="w-full bg-white text-black hover:bg-gray-200">Learn More</Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
