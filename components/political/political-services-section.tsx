'use client'

import { motion } from "framer-motion"
import { PoliticalServiceCard } from "./political-service-card"

const services = [
  {
    title: "Campaign Strategy Development",
    description: "Comprehensive campaign planning tailored to your electoral landscape.",
    features: [
      "Voter demographic analysis",
      "Electoral landscape assessment",
      "Campaign message development",
      "Strategic timeline planning",
    ],
  },
  {
    title: "Voter Outreach & Engagement",
    description: "Connect with voters through targeted, data-driven communication.",
    features: [
      "Micro-targeted messaging",
      "Multi-channel voter outreach",
      "Engagement analytics",
      "Voter sentiment tracking",
    ],
  },
  {
    title: "Crisis Communication Management",
    description: "Navigate political challenges with strategic messaging and rapid response.",
    features: [
      "24/7 crisis monitoring",
      "Rapid response messaging",
      "Media relations management",
      "Narrative control strategies",
    ],
  },
]

export default function PoliticalServicesSection() {
  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          Our Political Communication Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <PoliticalServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
