"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Send, Eye, BarChart3, FileText, Mail, TrendingUp, Users, MousePointer, X, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import CampaignForm from "@/components/email-marketing/campaign-form"
import CampaignAnalytics from "@/components/email-marketing/campaign-analytics"
import { fetchEmailCampaigns, deleteEmailCampaignAction } from "@/app/actions/email-campaign-actions"
import { sendCampaign } from "@/app/actions/email-actions"
import type { EmailCampaign } from "@/types/email-marketing"
import { format } from "date-fns"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function EmailMarketingView() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("campaigns")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Analytics states
  const [selectedCampaignsForComparison, setSelectedCampaignsForComparison] = useState<string[]>([])
  const [comparisonData, setComparisonData] = useState<any[]>([])

  // UX/UI States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<EmailCampaign | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)

  useEffect(() => {
    loadCampaigns()
    loadTemplates()
  }, [])

  async function loadCampaigns() {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchEmailCampaigns()

      if (result.success && result.data) {
        setCampaigns(result.data)
      } else {
        setError(result.error || "Failed to load campaigns")
        toast({
          title: "Error",
          description: result.error || "Failed to load email campaigns. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading campaigns:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "Failed to load email campaigns. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function loadTemplates() {
    try {
      // Mock templates data - replace with actual API call
      setTemplates([
        { id: "1", name: "Welcome Email", subject: "Welcome to Stralyze", created_at: "2024-01-15", content: "Welcome to our platform!" },
        { id: "2", name: "Product Update", subject: "New Features Available", created_at: "2024-01-20", content: "Check out our latest features!" },
        { id: "3", name: "Newsletter", subject: "Monthly Newsletter", created_at: "2024-01-25", content: "Here's what's new this month!" },
      ])
    } catch (error) {
      console.error("Error loading templates:", error)
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteCampaign(campaign: EmailCampaign) {
    setCampaignToDelete(campaign)
    setIsDeleteDialogOpen(true)
  }

  async function confirmDeleteCampaign() {
    if (!campaignToDelete) return

    try {
      const result = await deleteEmailCampaignAction(campaignToDelete.id)

      if (result.success) {
        toast({
          title: "Campaign deleted",
          description: "The email campaign has been deleted successfully.",
        })
        loadCampaigns()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete the campaign. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast({
        title: "Error",
        description: "Failed to delete the campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setCampaignToDelete(null)
    }
  }

  function handleEditCampaign(campaign: EmailCampaign) {
    setSelectedCampaign(campaign)
    setIsEditDialogOpen(true)
  }

  async function handleViewAnalytics(campaign: EmailCampaign) {
    setIsLoadingAnalytics(true)
    setSelectedCampaign(campaign)
    setIsAnalyticsDialogOpen(true)
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoadingAnalytics(false)
    }, 500)
  }

  async function handleSendCampaign(campaign: EmailCampaign) {
    if (!confirm("Are you sure you want to send this campaign now?")) {
      return
    }

    try {
      setIsSending(true)
      const result = await sendCampaign(campaign.id)

      if (result.success) {
        toast({
          title: "Campaign sent",
          description: "Your email campaign is being sent to recipients.",
        })
        loadCampaigns()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send the campaign. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending campaign:", error)
      toast({
        title: "Error",
        description: "Failed to send the campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  function handleEditTemplate(template: any) {
    setSelectedTemplate(template)
    setIsTemplateDialogOpen(true)
  }

  function handleCreateTemplate() {
    setSelectedTemplate(null)
    setIsTemplateDialogOpen(true)
  }

  function getSegmentLabel(segment: string) {
    switch (segment) {
      case "new_lead":
        return "New Leads"
      case "in_process":
        return "In Process"
      case "closed_deal":
        return "Closed Deals"
      case "abandoned":
        return "Abandoned"
      default:
        return segment
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-500 text-white">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500 text-white">Scheduled</Badge>
      case "sending":
        return <Badge className="bg-yellow-500 text-black">Sending</Badge>
      case "sent":
        return <Badge className="bg-green-500 text-white">Sent</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Generate mock analytics data
  function generateAnalyticsData() {
    const sentCampaigns = campaigns.filter(c => c.status === "sent" || c.status === "sending")
    return sentCampaigns.map(campaign => ({
      name: campaign.name,
      recipients: campaign.stats?.total || 0,
      opened: campaign.stats?.opened || 0,
      clicked: campaign.stats?.clicked || 0,
      bounced: campaign.stats?.bounced || 0,
      unsubscribed: campaign.stats?.unsubscribed || 0,
      openRate: campaign.stats?.total ? ((campaign.stats.opened / campaign.stats.total) * 100).toFixed(1) : 0,
      clickRate: campaign.stats?.total ? ((campaign.stats.clicked / campaign.stats.total) * 100).toFixed(1) : 0,
    }))
  }

  // Handle campaign comparison
  function handleCampaignComparison(campaignId: string) {
    setSelectedCampaignsForComparison(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }

  // Generate comparison data
  useEffect(() => {
    if (selectedCampaignsForComparison.length > 0) {
      const comparison = campaigns
        .filter(c => selectedCampaignsForComparison.includes(c.id))
        .map(campaign => ({
          name: campaign.name,
          recipients: campaign.stats?.total || 0,
          opened: campaign.stats?.opened || 0,
          clicked: campaign.stats?.clicked || 0,
          openRate: campaign.stats?.total ? ((campaign.stats.opened / campaign.stats.total) * 100).toFixed(1) : 0,
          clickRate: campaign.stats?.total ? ((campaign.stats.clicked / campaign.stats.total) * 100).toFixed(1) : 0,
        }))
      setComparisonData(comparison)
    }
  }, [selectedCampaignsForComparison, campaigns])

  const analyticsData = generateAnalyticsData()
  const totalRecipients = analyticsData.reduce((sum, item) => sum + item.recipients, 0)
  const totalOpened = analyticsData.reduce((sum, item) => sum + item.opened, 0)
  const totalClicked = analyticsData.reduce((sum, item) => sum + item.clicked, 0)
  const avgOpenRate = analyticsData.length > 0 ? (analyticsData.reduce((sum, item) => sum + Number(item.openRate), 0) / analyticsData.length).toFixed(1) : "0"
  const avgClickRate = analyticsData.length > 0 ? (analyticsData.reduce((sum, item) => sum + Number(item.clickRate), 0) / analyticsData.length).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      {/* Header with improved UX */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Email Marketing</h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage campaigns, templates, and track performance
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === "campaigns" && (
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="bg-white text-black-200 hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
          <Plus className="h-4 w-4 mr-2" />
              )}
          Create Campaign
        </Button>
          )}
          {activeTab === "templates" && (
            <Button 
              onClick={handleCreateTemplate}
              className="bg-white text-black-200 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Tabs with better UX */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
          <TabsTrigger 
            value="campaigns" 
            className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200"
          >
            <Mail className="h-4 w-4 mr-2" />
            Campaigns
            {campaigns.length > 0 && (
              <Badge className="ml-2 bg-gray-600 text-white text-xs">
                {campaigns.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200"
          >
            <FileText className="h-4 w-4 mr-2" />
            Templates
            {templates.length > 0 && (
              <Badge className="ml-2 bg-gray-600 text-white text-xs">
                {templates.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab with improved UX */}
        <TabsContent value="campaigns" className="space-y-6">
      {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mr-3" />
          <p className="text-gray-400">Loading campaigns...</p>
        </div>
      ) : error ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-red-400 mb-4 text-center">Error: {error}</p>
                <Button onClick={loadCampaigns} className="bg-white text-black-200 hover:bg-gray-200">
                  <Loader2 className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : campaigns.length === 0 ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-gray-200 font-medium mb-2">No campaigns yet</h3>
                <p className="text-gray-400 mb-4 text-center">Create your first email campaign to get started</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black-200 hover:bg-gray-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-all duration-200 group">
              <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-gray-200 group-hover:text-white transition-colors">
                        {campaign.name}
                      </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(campaign.status)}
                    <span className="text-sm text-gray-400">Segment: {getSegmentLabel(campaign.segment)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {campaign.status === "sent" || campaign.status === "sending" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAnalytics(campaign)}
                          className="text-black bg-white border-gray-600 hover:bg-gray-200 transition-colors"
                          disabled={isLoadingAnalytics}
                    >
                          {isLoadingAnalytics ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                      <Eye className="h-4 w-4 mr-2 text-black" />
                          )}
                      Analytics
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCampaign(campaign)}
                            className="text-black-200 border-gray-600 hover:bg-gray-700 transition-colors"
                      >
                            <Edit className="h-4 w-4 mr-2 text-black-200" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                            onClick={() => handleSendCampaign(campaign)}
                        disabled={isSending || campaign.status !== "draft"}
                            className="text-black-200 border-gray-600 hover:bg-gray-700 disabled:opacity-50 transition-colors"
                      >
                            {isSending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                        <Send className="h-4 w-4 mr-2" />
                            )}
                        Send Now
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                        onClick={() => handleDeleteCampaign(campaign)}
                        className="text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
                        disabled={campaign.status === "sending"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Template</p>
                    <p className="text-gray-200">{campaign.template?.name || "Unknown template"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Scheduled For</p>
                    <p className="text-gray-200">
                      {campaign.scheduled_at ? formatDate(campaign.scheduled_at) : "Not scheduled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sent At</p>
                    <p className="text-gray-200">{campaign.sent_at ? formatDate(campaign.sent_at) : "Not sent yet"}</p>
                  </div>
                </div>

                {(campaign.status === "sent" || campaign.status === "sending") && campaign.stats && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 mb-2">Campaign Stats</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Recipients</p>
                        <p className="text-gray-200 font-medium">{campaign.stats.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Opened</p>
                        <p className="text-gray-200 font-medium">
                          {campaign.stats.opened} (
                          {campaign.stats.total ? ((campaign.stats.opened / campaign.stats.total) * 100).toFixed(1) : 0}
                          %)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Clicked</p>
                        <p className="text-gray-200 font-medium">
                          {campaign.stats.clicked} (
                          {campaign.stats.total
                            ? ((campaign.stats.clicked / campaign.stats.total) * 100).toFixed(1)
                            : 0}
                          %)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Bounced/Unsubscribed</p>
                        <p className="text-gray-200 font-medium">
                          {campaign.stats.bounced + campaign.stats.unsubscribed} (
                          {campaign.stats.total
                            ? (
                                ((campaign.stats.bounced + campaign.stats.unsubscribed) / campaign.stats.total) *
                                100
                              ).toFixed(1)
                            : 0}
                          %)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>

        {/* Templates Tab with improved UX */}
        <TabsContent value="templates" className="space-y-6">
          {templates.length === 0 ? (
            <Card className="bg-gray-800/80 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-gray-200 font-medium mb-2">No templates yet</h3>
                <p className="text-gray-400 mb-4 text-center">Create your first email template to get started</p>
                <Button onClick={handleCreateTemplate} className="bg-white text-black-200 hover:bg-gray-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-all duration-200 group">
                  <CardHeader>
                    <CardTitle className="text-gray-200 group-hover:text-white transition-colors">
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400">{template.subject}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Created: {formatDate(template.created_at)}</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTemplate(template)}
                          className="text-black-200 border-gray-600 hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-2 text-black-200" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab with improved UX */}
        <TabsContent value="analytics" className="space-y-6">
          {analyticsData.length === 0 ? (
            <Card className="bg-gray-800/80 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-gray-200 font-medium mb-2">No analytics data yet</h3>
                <p className="text-gray-400 mb-4 text-center">Send your first campaign to see analytics data</p>
                <Button onClick={() => setActiveTab("campaigns")} className="bg-white text-black-200 hover:bg-gray-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Go to Campaigns
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Recipients</p>
                        <p className="text-2xl font-bold text-gray-200">{totalRecipients.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Opened</p>
                        <p className="text-2xl font-bold text-gray-200">{totalOpened.toLocaleString()}</p>
                      </div>
                      <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Avg Open Rate</p>
                        <p className="text-2xl font-bold text-gray-200">{avgOpenRate}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Avg Click Rate</p>
                        <p className="text-2xl font-bold text-gray-200">{avgClickRate}%</p>
                      </div>
                      <MousePointer className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Comparison */}
              <Card className="bg-gray-800/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-200">Campaign Comparison</CardTitle>
                  <p className="text-sm text-gray-400">Select campaigns to compare their performance</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Campaign Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.filter(c => c.status === "sent" || c.status === "sending").map((campaign) => (
                      <div key={campaign.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={campaign.id}
                          checked={selectedCampaignsForComparison.includes(campaign.id)}
                          onCheckedChange={() => handleCampaignComparison(campaign.id)}
                        />
                        <label htmlFor={campaign.id} className="text-sm text-gray-200 cursor-pointer">
                          {campaign.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Comparison Chart */}
                  {comparisonData.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-200 mb-4">Performance Comparison</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="openRate" fill="#3B82F6" name="Open Rate (%)" />
                            <Bar dataKey="clickRate" fill="#10B981" name="Click Rate (%)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Individual Campaign Analytics */}
              {analyticsData.length > 0 && (
                <Card className="bg-gray-800/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Campaign Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F9FAFB'
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="openRate" stroke="#3B82F6" strokeWidth={2} name="Open Rate (%)" />
                          <Line type="monotone" dataKey="clickRate" stroke="#10B981" strokeWidth={2} name="Click Rate (%)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Enhanced Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create Email Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm
            onSuccess={() => {
              setIsCreateDialogOpen(false)
              loadCampaigns()
              toast({
                title: "Campaign created",
                description: "Your email campaign has been created successfully.",
              })
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Email Campaign</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <CampaignForm
              campaign={selectedCampaign}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                loadCampaigns()
                toast({
                  title: "Campaign updated",
                  description: "Your email campaign has been updated successfully.",
                })
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-white">Campaign Analytics: {selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && <CampaignAnalytics campaign={selectedCampaign} />}
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-200">Template Name</label>
              <input
                type="text"
                defaultValue={selectedTemplate?.name || ""}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Enter template name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-200">Subject Line</label>
              <input
                type="text"
                defaultValue={selectedTemplate?.subject || ""}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-200">Content</label>
              <textarea
                defaultValue={selectedTemplate?.content || ""}
                rows={8}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Enter email content"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsTemplateDialogOpen(false)}
                className="text-gray-200 border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsTemplateDialogOpen(false)
                  toast({
                    title: selectedTemplate ? "Template updated" : "Template created",
                    description: `Template has been ${selectedTemplate ? "updated" : "created"} successfully.`,
                  })
                }}
                className="bg-white text-black hover:bg-gray-200"
              >
                {selectedTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete "{campaignToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-200 border-gray-600 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCampaign}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 