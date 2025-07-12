"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { smoothScroll } from "@/lib/smoothScroll"

export default function HeroWithCanvasReveal() {
  const handleDiscoverClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      smoothScroll(featuresSection)
    }
  }

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
          Strategic Marketing Solutions
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
          Elevate your brand with data-driven strategies and innovative campaigns. Let Stralyze guide you to market
          leadership.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            className="bg-white text-black-200 hover:bg-gray-200 font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <a href="#features" onClick={handleDiscoverClick}>
              Discover Our Approach
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
