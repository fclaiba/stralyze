"use client"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"

export default function CommonBackground() {
  return (
    <div className="fixed inset-0 z-[-1]">
      <CanvasRevealEffect
        animationSpeed={2}
        containerClassName="bg-black"
        colors={[
          [50, 50, 50], // Dark gray
          [100, 100, 100], // Medium gray
          [200, 200, 200], // Light gray
        ]}
        dotSize={3}
        opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
    </div>
  )
}
