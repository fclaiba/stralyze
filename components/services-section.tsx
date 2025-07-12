'use client'

import { ServiceCard } from "./service-card"
import { motion } from "framer-motion"

const services = [
  {
    title: "Strategic Brand Orchestration",
    description: "Craft a compelling brand narrative that resonates across markets.",
    features: [
      "Comprehensive brand audits",
      "Market positioning strategy",
      "Brand identity development",
      "Cross-cultural brand adaptation",
    ],
  },
  {
    title: "Precision Campaign Optimization",
    description: "Fine-tune your marketing efforts for maximum impact and ROI.",
    features: [
      "Data-driven campaign analysis",
      "Real-time performance tracking",
      "A/B testing and optimization",
      "Multi-channel campaign synergy",
    ],
  },
  {
    title: "Tactical Execution Excellence",
    description: "Transform strategies into flawlessly executed marketing initiatives.",
    features: [
      "End-to-end campaign management",
      "Agile marketing implementation",
      "Cross-functional team coordination",
      "Performance-driven execution",
    ],
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          Our Comprehensive Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
