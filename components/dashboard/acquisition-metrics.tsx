"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Calendar } from "lucide-react"

interface AcquisitionMetricsProps {
  className?: string
}

interface MetricData {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ComponentType<{ className?: string }>
}

export default function AcquisitionMetrics({ className }: AcquisitionMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setMetrics([
        {
          title: "Monthly Acquisitions",
          value: "127",
          change: "+12.5%",
          trend: "up",
          icon: Users,
        },
        {
          title: "Conversion Rate",
          value: "24.8%",
          change: "+3.2%",
          trend: "up",
          icon: Target,
        },
        {
          title: "Average Deal Size",
          value: "$15,420",
          change: "-2.1%",
          trend: "down",
          icon: DollarSign,
        },
        {
          title: "Time to Close",
          value: "18 days",
          change: "-5.3%",
          trend: "up",
          icon: Calendar,
        },
      ])
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className={`bg-gray-800/80 border-white/20 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-gray-200 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Acquisition Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-700/30 p-4 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-6 bg-gray-600 rounded mb-1"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{metric.title}</span>
                  <metric.icon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
