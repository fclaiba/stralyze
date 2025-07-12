"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { smoothScroll } from "@/lib/smoothScroll"

export default function HeroWithCanvasRevealPolitical() {
  const handleDiscoverClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const featuresSection = document.getElementById("political-features")
    if (featuresSection) {
      smoothScroll(featuresSection)
    }
  }

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
          Strategic Political Communication
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
          Elevate your political campaign with data-driven strategies and innovative messaging. Let Stralyze guide you
          to electoral success.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <a href="#political-features" onClick={handleDiscoverClick}>
              Discover Our Political Approach
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
