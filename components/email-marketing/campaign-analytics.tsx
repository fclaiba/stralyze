"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchCampaignTracking } from "@/app/actions/email-tracking-actions"
import type { EmailCampaign, EmailTracking } from "@/types/email-marketing"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CampaignAnalyticsProps {
  campaign: EmailCampaign
}

export default function CampaignAnalytics({ campaign }: CampaignAnalyticsProps) {
  const [trackingData, setTrackingData] = useState<EmailTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadTrackingData() {
      try {
        setLoading(true)
        setError(null)

        // Use the server action instead of direct data access
        const result = await fetchCampaignTracking(campaign.id)

        if (result.success && result.data) {
          setTrackingData(Array.isArray(result.data) ? result.data : [])
        } else {
          setError(result.error || "Failed to load tracking data")
          setTrackingData([]) // Ensure it's always an array
          toast({
            title: "Error",
            description: result.error || "Failed to load tracking data. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading tracking data:", error)
        setError("An unexpected error occurred")
        toast({
          title: "Error",
          description: "Failed to load tracking data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTrackingData()
  }, [campaign.id, toast])

  const stats = campaign.stats || {
    total: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
  }

  const calculatePercentage = (value: number) => {
    if (!stats.total) return 0
    return (value / stats.total) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-500 text-white"
      case "delivered":
        return "bg-green-500 text-white"
      case "opened":
        return "bg-yellow-500 text-black"
      case "clicked":
        return "bg-purple-500 text-white"
      case "bounced":
        return "bg-red-500 text-white"
      case "unsubscribed":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-300 text-black"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Prepare chart data
  const chartData = [
    {
      name: "Campaign Performance",
      sent: stats.sent,
      delivered: stats.delivered,
      opened: stats.opened,
      clicked: stats.clicked,
      bounced: stats.bounced,
      unsubscribed: stats.unsubscribed,
    },
  ]

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-md">
        <h3 className="text-red-400 font-medium mb-2">Error loading tracking data</h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/80 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.delivered}</div>
            <Progress
              value={calculatePercentage(stats.delivered)}
              className="h-2 mt-2 bg-gray-700 [&>div]:bg-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">{calculatePercentage(stats.delivered).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/80 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Opened</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.opened}</div>
            <Progress
              value={calculatePercentage(stats.opened)}
              className="h-2 mt-2 bg-gray-700 [&>div]:bg-yellow-500"
            />
            <p className="text-xs text-gray-400 mt-1">{calculatePercentage(stats.opened).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/80 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Clicked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.clicked}</div>
            <Progress
              value={calculatePercentage(stats.clicked)}
              className="h-2 mt-2 bg-gray-700 [&>div]:bg-purple-500"
            />
            <p className="text-xs text-gray-400 mt-1">{calculatePercentage(stats.clicked).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/80 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Bounced/Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.bounced + stats.unsubscribed}</div>
            <Progress
              value={calculatePercentage(stats.bounced + stats.unsubscribed)}
              className="h-2 mt-2 bg-gray-700 [&>div]:bg-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              {calculatePercentage(stats.bounced + stats.unsubscribed).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Chart */}
      <Card className="bg-gray-800/80 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: "Total", value: stats.total },
                  { name: "Sent", value: stats.sent },
                  { name: "Delivered", value: stats.delivered },
                  { name: "Opened", value: stats.opened },
                  { name: "Clicked", value: stats.clicked },
                  { name: "Bounced", value: stats.bounced },
                  { name: "Unsubscribed", value: stats.unsubscribed },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", borderColor: "#555", color: "#fff" }}
                  formatter={(value) => [value, ""]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black">
            All Recipients
          </TabsTrigger>
          <TabsTrigger value="opened" className="data-[state=active]:bg-white data-[state=active]:text-black">
            Opened
          </TabsTrigger>
          <TabsTrigger value="clicked" className="data-[state=active]:bg-white data-[state=active]:text-black">
            Clicked
          </TabsTrigger>
          <TabsTrigger value="bounced" className="data-[state=active]:bg-white data-[state=active]:text-black">
            Bounced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RecipientTable
            data={trackingData}
            loading={loading}
            filter="all"
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="opened" className="mt-4">
          <RecipientTable
            data={Array.isArray(trackingData) ? trackingData.filter((item) => item.status === "opened" || item.status === "clicked") : []}
            loading={loading}
            filter="opened"
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="clicked" className="mt-4">
          <RecipientTable
            data={Array.isArray(trackingData) ? trackingData.filter((item) => item.status === "clicked") : []}
            loading={loading}
            filter="clicked"
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="bounced" className="mt-4">
          <RecipientTable
            data={Array.isArray(trackingData) ? trackingData.filter((item) => item.status === "bounced" || item.status === "unsubscribed") : []}
            loading={loading}
            filter="bounced"
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface RecipientTableProps {
  data: EmailTracking[]
  loading: boolean
  filter: string
  getStatusColor: (status: string) => string
  formatDate: (date: string | null) => string
}

function RecipientTable({ data, loading, filter, getStatusColor, formatDate }: RecipientTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading tracking data...</div>
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {filter === "all" ? "No recipients found for this campaign." : `No recipients with status "${filter}" found.`}
      </div>
    )
  }

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Recipient</TableHead>
            <TableHead className="text-gray-300">Company</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Sent</TableHead>
            <TableHead className="text-gray-300">Opened</TableHead>
            <TableHead className="text-gray-300">Clicked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
              <TableCell className="font-medium text-white">{item.email}</TableCell>
              <TableCell className="text-gray-300">{item.client?.company || "N/A"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </TableCell>
              <TableCell className="text-gray-300">{formatDate(item.sent_at)}</TableCell>
              <TableCell className="text-gray-300">{formatDate(item.opened_at)}</TableCell>
              <TableCell className="text-gray-300">{formatDate(item.clicked_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
