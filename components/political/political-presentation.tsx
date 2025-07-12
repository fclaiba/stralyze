'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

export default function PoliticalPresentation() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Winning Campaigns Through Strategic Communication
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300 mb-6"
            >
              At Stralyze, we understand the unique challenges of political communication. Our approach combines deep
              electoral insights with cutting-edge analytics to deliver tailored solutions that drive real results at
              the ballot box.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 mb-6"
            >
              We recognize that each constituency has its unique pulse, cultural nuances, and voter behaviors. That's
              why our team of political experts crafts meticulously personalized strategies, ensuring your message
              resonates powerfully with your target audience.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-300 mb-8"
            >
              From local races to national campaigns, we've helped candidates and parties of all sizes unlock their full
              potential in diverse electoral landscapes. Our data-driven methodologies, combined with creative
              messaging, position your campaign not just to compete, but to win.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button className="bg-white text-black-200 hover:bg-gray-200">Explore Our Case Studies</Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="/placeholder.svg?key=gsbfs"
              alt="Political Campaign Strategy Meeting"
              width={600}
              height={600}
              className="rounded-lg shadow-2xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl"
            >
              <p className="text-black font-bold text-lg">15+ Years Experience</p>
              <p className="text-gray-600">In Political Campaigns</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
