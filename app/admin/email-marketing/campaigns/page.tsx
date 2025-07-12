"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Send, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import CampaignForm from "@/components/email-marketing/campaign-form"
import CampaignAnalytics from "@/components/email-marketing/campaign-analytics"
import { fetchEmailCampaigns, deleteEmailCampaignAction } from "@/app/actions/email-campaign-actions"
import { sendCampaign } from "@/app/actions/email-actions"
import type { EmailCampaign } from "@/types/email-marketing"
import { format } from "date-fns"

export default function CampaignsPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    try {
      setLoading(true)
      setError(null)

      // Use the server action instead of direct data access
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

  async function handleDeleteCampaign(id: string) {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return
    }

    try {
      // Use the server action instead of direct data access
      const result = await deleteEmailCampaignAction(id)

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
    }
  }

  function handleEditCampaign(campaign: EmailCampaign) {
    setSelectedCampaign(campaign)
    setIsEditDialogOpen(true)
  }

  function handleViewAnalytics(campaign: EmailCampaign) {
    setSelectedCampaign(campaign)
    setIsAnalyticsDialogOpen(true)
  }

  async function handleSendCampaign(id: string) {
    if (!confirm("Are you sure you want to send this campaign now?")) {
      return
    }

    try {
      setIsSending(true)
      const result = await sendCampaign(id)

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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Email Campaigns</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading campaigns...</p>
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
      ) : campaigns.length === 0 ? (
        <Card className="bg-gray-800/80 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 mb-4">No email campaigns found</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-gray-800/80 border-gray-700 hover:border-gray-500 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-white">{campaign.name}</CardTitle>
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
                      className="text-black bg-white border-gray-600 hover:bg-gray-200"
                    >
                      <Eye className="h-4 w-4 mr-2 text-black" />
                      Analytics
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCampaign(campaign)}
                        className="text-white border-gray-600 hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendCampaign(campaign.id)}
                        disabled={isSending || campaign.status !== "draft"}
                        className="text-white border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Template</p>
                    <p className="text-white">{campaign.template?.name || "Unknown template"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Scheduled For</p>
                    <p className="text-white">
                      {campaign.scheduled_at ? formatDate(campaign.scheduled_at) : "Not scheduled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sent At</p>
                    <p className="text-white">{campaign.sent_at ? formatDate(campaign.sent_at) : "Not sent yet"}</p>
                  </div>
                </div>

                {(campaign.status === "sent" || campaign.status === "sending") && campaign.stats && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 mb-2">Campaign Stats</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Recipients</p>
                        <p className="text-white font-medium">{campaign.stats.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Opened</p>
                        <p className="text-white font-medium">
                          {campaign.stats.opened} (
                          {campaign.stats.total ? ((campaign.stats.opened / campaign.stats.total) * 100).toFixed(1) : 0}
                          %)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Clicked</p>
                        <p className="text-white font-medium">
                          {campaign.stats.clicked} (
                          {campaign.stats.total
                            ? ((campaign.stats.clicked / campaign.stats.total) * 100).toFixed(1)
                            : 0}
                          %)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Bounced/Unsubscribed</p>
                        <p className="text-white font-medium">
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

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create Email Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm
            onSuccess={() => {
              setIsCreateDialogOpen(false)
              loadCampaigns()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
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
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-white">Campaign Analytics: {selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && <CampaignAnalytics campaign={selectedCampaign} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
