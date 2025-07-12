'use client'

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "Mayor of Riverdale",
    testimonial:
      "Stralyze's strategic insights transformed our campaign messaging, leading to a 15-point swing in voter support in just three weeks.",
  },
  {
    name: "Michael Chen",
    position: "State Representative",
    testimonial:
      "Working with Stralyze was a game-changer for our legislative agenda. Their data-driven approach helped us identify key messaging points that resonated across party lines.",
  },
  {
    name: "Elena Rodriguez",
    position: "Campaign Manager",
    testimonial:
      "The team at Stralyze doesn't just deliver results; they become an extension of your campaign. Their crisis management expertise saved our candidate during a critical moment.",
  },
]

export default function PoliticalTestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          What Our Political Clients Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4">"{testimonial.testimonial}"</p>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400">{testimonial.position}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
