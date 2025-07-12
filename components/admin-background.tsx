"use client"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"

export default function AdminBackground() {
  return (
    <div className="min-h-screen bg-black/80 text-gray-200 relative overflow-hidden">
      <CanvasRevealEffect
        animationSpeed={2}
        containerClassName="absolute inset-0"
        colors={[
          [50, 50, 50], // Dark gray
          [100, 100, 100], // Medium gray
          [200, 200, 200], // Light gray
        ]}
        dotSize={3}
        opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
    </div>
  )
} 