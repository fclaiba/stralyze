'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const caseStudies = [
  {
    title: "Global Brand Expansion",
    description:
      "Helped a tech startup expand into European markets, resulting in a 200% increase in international sales.",
    image: "/placeholder.svg?height=200&width=300",
    service: "Strategic Brand Orchestration",
  },
  {
    title: "E-commerce Optimization",
    description: "Improved conversion rates by 150% for a major online retailer through data-driven UX enhancements.",
    image: "/placeholder.svg?height=200&width=300",
    service: "Precision Campaign Optimization",
  },
  {
    title: "Cross-Platform Campaign",
    description:
      "Executed a seamless multi-channel campaign for a FMCG brand, reaching 10M+ consumers across 5 countries.",
    image: "/placeholder.svg?height=200&width=300",
    service: "Tactical Execution Excellence",
  },
]

export default function CaseStudies() {
  return (
    <section id="case-studies" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          Our Success Stories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-gray-700 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 h-full flex flex-col">
                <CardHeader>
                  <Image
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    width={300}
                    height={200}
                    className="rounded-t-lg object-cover w-full h-48"
                  />
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="text-xl font-bold text-white mb-2">{study.title}</CardTitle>
                  <CardDescription className="text-gray-300">{study.description}</CardDescription>
                </CardContent>
                <CardFooter className="bg-white/10 rounded-b-lg">
                  <p className="text-sm font-semibold text-gray-300">Service: {study.service}</p>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
