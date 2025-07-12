'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const caseStudies = [
  {
    title: "Mayoral Campaign Victory",
    description:
      "Helped a first-time candidate win a competitive mayoral race through targeted messaging and data-driven voter outreach.",
    image: "/placeholder.svg?key=i214x",
    service: "Campaign Strategy Development",
  },
  {
    title: "Legislative Agenda Advancement",
    description: "Developed a communication strategy that helped pass key legislation with bipartisan support.",
    image: "/placeholder.svg?key=7fznl",
    service: "Strategic Message Development",
  },
  {
    title: "Crisis Management Success",
    description:
      "Navigated a potential campaign-ending controversy through rapid response and strategic narrative control.",
    image: "/placeholder.svg?key=d9ie4",
    service: "Crisis Communication Management",
  },
]

export default function PoliticalCaseStudies() {
  return (
    <section id="case-studies" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
        >
          Our Political Success Stories
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
