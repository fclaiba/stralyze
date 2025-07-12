"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { format, parseISO, isValid } from "date-fns"
import { Filter, TrendingUp, Users, Target, Award } from "lucide-react"

interface LeadGrowthData {
  date: string
  newLeads: number
  qualifiedLeads: number
  convertedLeads: number
  abandonedLeads: number
  totalLeads: number
  conversionRate: number
  growthRate: number
}

interface LeadGrowthChartProps {
  className?: string
}

function safeParse(dateStr: string): Date | null {
  try {
    const d = parseISO(dateStr)
    return isValid(d) ? d : null
  } catch {
    return null
  }
}

export default function LeadGrowthChart({ className }: LeadGrowthChartProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "semiannual">(
    "monthly",
  )
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [data, setData] = useState<LeadGrowthData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalMetrics, setTotalMetrics] = useState({
    totalLeads: 0,
    avgConversionRate: 0,
    avgGrowthRate: 0,
    topPerformingPeriod: "",
  })
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([])

  useEffect(() => {
      fetchLeadGrowthData(timeRange, statusFilter, industryFilter)
  }, [timeRange, statusFilter, industryFilter])

  const fetchLeadGrowthData = async (range: string, status: string, industry: string) => {
    try {
      setLoading(true)
      const mockData = generateMockData(range)
      setData(mockData)
      calculateTotalMetrics(mockData)
      setAvailableIndustries(["Tech", "Finance", "Healthcare", "Retail", "Marketing", "Manufacturing", "Education", "Real Estate", "Consulting", "Transportation"])
    } catch (error) {
      console.error("Error fetching lead growth data:", error)
      const mockData = generateMockData(range)
      setData(mockData)
      calculateTotalMetrics(mockData)
      setAvailableIndustries(["Tech", "Finance", "Healthcare", "Retail", "Marketing", "Manufacturing", "Education", "Real Estate", "Consulting", "Transportation"])
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (range: string): LeadGrowthData[] => {
    const mockData: LeadGrowthData[] = []
    const periods = range === "daily" ? 30 : range === "weekly" ? 12 : range === "monthly" ? 12 : 8
    for (let i = 0; i < periods; i++) {
      const baseLeads = 20 + Math.floor(Math.random() * 30)
      const newLeads = Math.floor(baseLeads * 0.4)
      const qualifiedLeads = Math.floor(baseLeads * 0.3)
      const convertedLeads = Math.floor(baseLeads * 0.2)
      const abandonedLeads = baseLeads - newLeads - qualifiedLeads - convertedLeads
      mockData.push({
        date:
          range === "daily"
            ? `2024-01-${String(i + 1).padStart(2, "0")}`
            : range === "weekly"
              ? `2024-W${String(i + 1).padStart(2, "0")}`
              : range === "monthly"
                ? `2024-${String(i + 1).padStart(2, "0")}`
                : `2024-Q${i + 1}`,
        newLeads,
        qualifiedLeads,
        convertedLeads,
        abandonedLeads,
        totalLeads: baseLeads,
        conversionRate: Math.round((convertedLeads / baseLeads) * 10000) / 100,
        growthRate: i > 0 ? Math.round((Math.random() - 0.5) * 40 * 100) / 100 : 0,
      })
    }
    return mockData
  }

  const formatDateByRange = (date: Date, range: string): string => {
    switch (range) {
      case "daily":
        return format(date, "yyyy-MM-dd")
      case "weekly":
        return format(date, "yyyy-'W'ww")
      case "biweekly":
        return format(date, "yyyy-MM-dd")
      case "monthly":
        return format(date, "yyyy-MM")
      case "quarterly":
        return format(date, "yyyy-'Q'Q")
      case "semiannual":
        return format(date, "yyyy-'H'H")
      default:
        return format(date, "yyyy-MM-dd")
    }
  }

  const calculateTotalMetrics = (data: LeadGrowthData[]) => {
    if (data.length === 0) {
      setTotalMetrics({
        totalLeads: 0,
        avgConversionRate: 0,
        avgGrowthRate: 0,
        topPerformingPeriod: "",
      })
      return
    }
    const totalLeads = data.reduce((sum, item) => sum + item.totalLeads, 0)
    const avgConversionRate = data.reduce((sum, item) => sum + item.conversionRate, 0) / data.length
    const avgGrowthRate = data.reduce((sum, item) => sum + item.growthRate, 0) / data.length
    const topPerformingPeriod = data.reduce((max, item) => (item.totalLeads > max.totalLeads ? item : max)).date
    setTotalMetrics({
      totalLeads,
      avgConversionRate: Math.round(avgConversionRate * 100) / 100,
      avgGrowthRate: Math.round(avgGrowthRate * 100) / 100,
      topPerformingPeriod,
    })
  }

  const formatXAxisLabel = (date: string) => {
    if (date.includes("W")) {
      return `W${date.split("-W")[1]}`
    }
    if (date.includes("Q")) {
      return `Q${date.split("-Q")[1]}`
    }
    if (date.includes("H")) {
      return `H${date.split("-H")[1]}`
    }
    if (date.length === 7) {
      const parsed = safeParse(`${date}-01`)
      return parsed ? format(parsed, "MMM yy") : date
    }
    const parsed = safeParse(date)
    return parsed ? format(parsed, "MMM dd") : date
  }

  const formatTooltipLabel = (date: string) => {
    if (date.includes("W")) {
      return `Week ${date.split("-W")[1]}, ${date.split("-W")[0]}`
    }
    if (date.includes("Q")) {
      return `Q${date.split("-Q")[1]} ${date.split("-Q")[0]}`
    }
    if (date.includes("H")) {
      return `H${date.split("-H")[1]} ${date.split("-H")[0]}`
    }
    if (date.length === 7) {
      const parsed = safeParse(`${date}-01`)
      return parsed ? format(parsed, "MMMM yyyy") : date
    }
    const parsed = safeParse(date)
    return parsed ? format(parsed, "MMMM dd, yyyy") : date
  }

  return (
    <Card className={`bg-gray-800/80 border-white/20 backdrop-blur-sm ${className}`}>
      <CardHeader className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-gray-200">Lead Growth & Filtering Analytics</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Tabs defaultValue="monthly" onValueChange={(value) => setTimeRange(value as any)}>
              <TabsList className="bg-gray-700/50 grid grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="daily" className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2 py-1">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2 py-1">Weekly</TabsTrigger>
                <TabsTrigger value="biweekly" className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2 py-1">Bi-weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2 py-1">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly" className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2 py-1">Quarterly</TabsTrigger>
                <TabsTrigger value="semiannual" className="data-[state=active]:bg-white data-[state=active]:text-black text-xs px-2 py-1">Semi-annual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px] bg-gray-700/50 border-gray-600 text-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New Lead">New Lead</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Closed Deal">Closed Deal</SelectItem>
                <SelectItem value="Abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full sm:w-[140px] bg-gray-700/50 border-gray-600 text-gray-200">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Industries</SelectItem>
                {availableIndustries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button variant={chartType === "line" ? "default" : "outline"} size="sm" onClick={() => setChartType("line")} className="text-xs">Line</Button>
              <Button variant={chartType === "bar" ? "default" : "outline"} size="sm" onClick={() => setChartType("bar")} className="text-xs">Bar</Button>
              <Button variant={chartType === "area" ? "default" : "outline"} size="sm" onClick={() => setChartType("area")} className="text-xs">Area</Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Total Leads</span>
            </div>
            <p className="text-lg font-bold text-white">{totalMetrics.totalLeads}</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Avg Conversion</span>
            </div>
            <p className="text-lg font-bold text-white">{totalMetrics.avgConversionRate}%</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-400">Avg Growth</span>
            </div>
            <p className="text-lg font-bold text-white">{totalMetrics.avgGrowthRate}%</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Top Period</span>
            </div>
            <p className="text-sm font-bold text-white truncate">{formatXAxisLabel(totalMetrics.topPerformingPeriod)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-gray-300">Loading lead growth data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "line" ? (
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
                  tickFormatter={formatXAxisLabel}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    borderColor: "#555",
                    borderRadius: "8px",
                  }}
                  labelFormatter={formatTooltipLabel}
                  formatter={(value: any, name: string) => [
                    value,
                    name === "newLeads"
                      ? "New Leads"
                      : name === "qualifiedLeads"
                        ? "In Process Leads"
                        : name === "convertedLeads"
                          ? "Closed Deals"
                          : name === "abandonedLeads"
                            ? "Abandoned Leads"
                            : name === "totalLeads"
                              ? "Total Leads"
                              : name === "conversionRate"
                                ? "Conversion Rate (%)"
                                : name === "growthRate"
                                  ? "Growth Rate (%)"
                                  : name,
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newLeads"
                  name="New Leads"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="qualifiedLeads"
                  name="In Process Leads"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="convertedLeads"
                  name="Closed Deals"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="abandonedLeads"
                  name="Abandoned Leads"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversionRate"
                  name="Conversion Rate (%)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            ) : chartType === "bar" ? (
              <BarChart
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
                  tickFormatter={formatXAxisLabel}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    borderColor: "#555",
                    borderRadius: "8px",
                  }}
                  labelFormatter={formatTooltipLabel}
                />
                <Legend />
                <Bar dataKey="newLeads" name="New Leads" fill="#3b82f6" stackId="a" />
                <Bar dataKey="qualifiedLeads" name="In Process Leads" fill="#f59e0b" stackId="a" />
                <Bar dataKey="convertedLeads" name="Closed Deals" fill="#10b981" stackId="a" />
                <Bar dataKey="abandonedLeads" name="Abandoned Leads" fill="#ef4444" stackId="a" />
              </BarChart>
            ) : (
              <AreaChart
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
                  tickFormatter={formatXAxisLabel}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    borderColor: "#555",
                    borderRadius: "8px",
                  }}
                  labelFormatter={formatTooltipLabel}
                  formatter={(value: any, name: string) => [
                    value,
                    name === "newLeads"
                      ? "New Leads"
                      : name === "qualifiedLeads"
                        ? "In Process Leads"
                        : name === "convertedLeads"
                          ? "Closed Deals"
                          : name === "abandonedLeads"
                            ? "Abandoned Leads"
                            : name,
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="newLeads"
                  name="New Leads"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="qualifiedLeads"
                  name="In Process Leads"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="convertedLeads"
                  name="Closed Deals"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="abandonedLeads"
                  name="Abandoned Leads"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.8}
                />
              </AreaChart>
            )}
            </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
} 