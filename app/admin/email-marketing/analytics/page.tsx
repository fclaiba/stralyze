"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { fetchCampaignsForAnalytics } from "@/app/actions/email-analytics-actions"
import type { EmailCampaign } from "@/types/email-marketing"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { subDays } from "date-fns"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days")

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    try {
      setLoading(true)
      setError(null)

      // Use the server action instead of direct data access
      const result = await fetchCampaignsForAnalytics()

      if (result.success && result.data) {
        setCampaigns(result.data)
      } else {
        setError(result.error || "Failed to load campaigns")
        toast({
          title: "Error",
          description: result.error || "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading campaigns:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter campaigns by time range
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (!campaign.sent_at) return false

    const sentDate = new Date(campaign.sent_at)
    const now = new Date()

    switch (timeRange) {
      case "7days":
        return sentDate >= subDays(now, 7)
      case "30days":
        return sentDate >= subDays(now, 30)
      case "90days":
        return sentDate >= subDays(now, 90)
      default:
        return true
    }
  })

  // Calculate overall stats
  const totalSent = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.total || 0), 0)
  const totalOpened = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.opened || 0), 0)
  const totalClicked = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.clicked || 0), 0)
  const totalBounced = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.bounced || 0), 0)
  const totalUnsubscribed = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.unsubscribed || 0), 0)

  const openRate = totalSent ? (totalOpened / totalSent) * 100 : 0
  const clickRate = totalSent ? (totalClicked / totalSent) * 100 : 0
  const bounceRate = totalSent ? (totalBounced / totalSent) * 100 : 0
  const unsubscribeRate = totalSent ? (totalUnsubscribed / totalSent) * 100 : 0

  // Prepare chart data
  const chartData = filteredCampaigns.map((campaign) => ({
    name: campaign.name,
    sent: campaign.stats?.total || 0,
    opened: campaign.stats?.opened || 0,
    clicked: campaign.stats?.clicked || 0,
    bounced: campaign.stats?.bounced || 0,
    unsubscribed: campaign.stats?.unsubscribed || 0,
  }))

  // Segment performance data
  const segmentData = [
    { name: "New Leads", value: 0, total: 0 },
    { name: "In Process", value: 0, total: 0 },
    { name: "Closed Deals", value: 0, total: 0 },
    { name: "Abandoned", value: 0, total: 0 },
  ]

  filteredCampaigns.forEach((campaign) => {
    let segmentIndex = -1
    switch (campaign.segment) {
      case "new_lead":
        segmentIndex = 0
        break
      case "in_process":
        segmentIndex = 1
        break
      case "closed_deal":
        segmentIndex = 2
        break
      case "abandoned":
        segmentIndex = 3
        break
    }

    if (segmentIndex >= 0) {
      segmentData[segmentIndex].value += campaign.stats?.opened || 0
      segmentData[segmentIndex].total += campaign.stats?.total || 0
    }
  })

  const segmentChartData = segmentData.map((segment) => ({
    name: segment.name,
    rate: segment.total ? (segment.value / segment.total) * 100 : 0,
  }))

  // Email engagement data for pie chart
  const engagementData = [
    { name: "Opened", value: totalOpened - totalClicked },
    { name: "Clicked", value: totalClicked },
    { name: "Not Opened", value: totalSent - totalOpened - totalBounced - totalUnsubscribed },
    { name: "Bounced", value: totalBounced },
    { name: "Unsubscribed", value: totalUnsubscribed },
  ].filter((item) => item.value > 0)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Email Analytics</h2>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <TabsList className="bg-gray-800/80 border-gray-700">
            <TabsTrigger value="7days" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Last 7 Days
            </TabsTrigger>
            <TabsTrigger value="30days" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Last 30 Days
            </TabsTrigger>
            <TabsTrigger value="90days" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Last 90 Days
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      ) : error ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={loadCampaigns} className="bg-white text-black hover:bg-gray-200">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400">No campaign data available for the selected time period</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{openRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400 mt-1">
                  {totalOpened} of {totalSent} emails opened
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Click Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{clickRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400 mt-1">
                  {totalClicked} of {totalSent} emails clicked
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{bounceRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400 mt-1">
                  {totalBounced} of {totalSent} emails bounced
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Unsubscribe Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{unsubscribeRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400 mt-1">
                  {totalUnsubscribed} of {totalSent} unsubscribed
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Campaign Performance Chart */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#aaa" angle={-45} textAnchor="end" height={70} />
                      <YAxis stroke="#aaa" />
                      <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="opened"
                        name="Opened"
                        stroke="#0088FE"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="clicked"
                        name="Clicked"
                        stroke="#00C49F"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bounced"
                        name="Bounced"
                        stroke="#FF8042"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Email Engagement Pie Chart */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Email Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} emails`, ""]}
                        contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Performance Chart */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Segment Performance (Open Rates)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={segmentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip
                      formatter={(value) => [`${value.toFixed(1)}%`, "Open Rate"]}
                      contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      name="Open Rate %"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
