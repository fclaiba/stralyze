"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { format, subDays, subMonths, parseISO } from "date-fns"

interface TimeSeriesData {
  date: string
  newLeads: number
  closedDeals: number
  abandoned: number
}

interface TimeSeriesGraphProps {
  className?: string
}

export default function TimeSeriesGraph({ className }: TimeSeriesGraphProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "semiannual">(
    "monthly",
  )
  const [data, setData] = useState<TimeSeriesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimeSeriesData(timeRange)
  }, [timeRange])

  const fetchTimeSeriesData = async (range: string) => {
    try {
      setLoading(true)
      
      // Use mock data instead of Supabase
      const mockData = generateMockData(range)
      setData(mockData)
    } catch (error) {
      console.error("Error fetching time series data:", error)
      // Fallback to mock data
      const mockData = generateMockData(range)
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (range: string): TimeSeriesData[] => {
    const mockData: TimeSeriesData[] = []
    const now = new Date()
    let periods: number
    let dateFormat: string

    switch (range) {
      case "daily":
        periods = 24 // 24 hours
        dateFormat = "yyyy-MM-dd HH:00"
        break
      case "weekly":
        periods = 7 // 7 days
        dateFormat = "yyyy-MM-dd"
        break
      case "biweekly":
        periods = 14 // 14 days
        dateFormat = "yyyy-MM-dd"
        break
      case "monthly":
        periods = 30 // 30 days
        dateFormat = "yyyy-MM-dd"
        break
      case "quarterly":
        periods = 90 // 90 days
        dateFormat = "yyyy-MM-dd"
        break
      case "semiannual":
        periods = 6 // 6 months
        dateFormat = "yyyy-MM"
        break
      default:
        periods = 30
        dateFormat = "yyyy-MM-dd"
    }

    for (let i = periods - 1; i >= 0; i--) {
      let date: Date
      
      if (range === "daily") {
        date = new Date(now.getTime() - i * 60 * 60 * 1000) // Hours
      } else if (range === "semiannual") {
        date = new Date(now.getFullYear(), now.getMonth() - i, 1) // Months
      } else {
        date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000) // Days
      }

      const baseValue = 10 + Math.floor(Math.random() * 20)
      const newLeads = Math.floor(baseValue * 0.4) + Math.floor(Math.random() * 5)
      const closedDeals = Math.floor(baseValue * 0.3) + Math.floor(Math.random() * 3)
      const abandoned = Math.floor(baseValue * 0.2) + Math.floor(Math.random() * 2)

      mockData.push({
        date: format(date, dateFormat),
        newLeads,
        closedDeals,
        abandoned,
      })
    }

    return mockData
  }

  return (
    <Card className={`bg-gray-800/80 border-white/20 backdrop-blur-sm ${className}`}>
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle className="text-gray-200 text-lg lg:text-xl">Client Acquisition Trends</CardTitle>
        <Tabs defaultValue="monthly" onValueChange={(value) => setTimeRange(value as any)}>
          <TabsList className="bg-gray-700/50 grid grid-cols-3 md:grid-cols-6 gap-1 w-full h-auto min-h-[40px] p-1">
            <TabsTrigger 
              value="daily" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-[10px] sm:text-xs md:text-sm px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-1.5 whitespace-nowrap"
            >
              Diario
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-[10px] sm:text-xs md:text-sm px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-1.5 whitespace-nowrap"
            >
              Semanal
            </TabsTrigger>
            <TabsTrigger 
              value="biweekly" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-[10px] sm:text-xs md:text-sm px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-1.5 whitespace-nowrap"
            >
              Quincenal
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-[10px] sm:text-xs md:text-sm px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-1.5 whitespace-nowrap"
            >
              Mensual
            </TabsTrigger>
            <TabsTrigger 
              value="quarterly" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-[10px] sm:text-xs md:text-sm px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-1.5 whitespace-nowrap"
            >
              Trimestral
            </TabsTrigger>
            <TabsTrigger 
              value="semiannual" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-[10px] sm:text-xs md:text-sm px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-1.5 whitespace-nowrap"
            >
              Semestral
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <p className="text-gray-300">Loading chart data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250} className="min-h-[250px] md:min-h-[300px] lg:min-h-[400px]">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="date"
                stroke="#aaa"
                tickFormatter={(date) => {
                  if (date.includes(" ")) {
                    // For hourly format (daily view)
                    return format(parseISO(date), "HH:00")
                  } else if (date.length <= 7) {
                    // For monthly format (semiannual view)
                    return format(parseISO(`${date}-01`), "MMM yyyy")
                  } else {
                    // For daily format
                    return format(parseISO(date), "MMM dd")
                  }
                }}
              />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                labelFormatter={(date) => {
                  if (typeof date === "string") {
                    if (date.includes(" ")) {
                      // For hourly format (daily view)
                      return format(parseISO(date), "MMMM dd, yyyy HH:00")
                    } else if (date.length <= 7) {
                      // For monthly format (semiannual view)
                      return format(parseISO(`${date}-01`), "MMMM yyyy")
                    } else {
                      // For daily format
                      return format(parseISO(date), "MMMM dd, yyyy")
                    }
                  }
                  return date
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="newLeads"
                name="New Leads"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="closedDeals" name="Closed Deals" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="abandoned" name="Abandoned" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
