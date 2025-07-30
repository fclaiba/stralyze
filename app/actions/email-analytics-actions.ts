"use server"

import * as emailData from "@/lib/data/email-marketing"
import type { EmailCampaign } from "@/types/email-marketing"

/**
 * Server action to fetch campaigns for analytics
 */
export async function fetchCampaignsForAnalytics(): Promise<{
  success: boolean
  data?: EmailCampaign[]
  error?: string
}> {
  try {
    const campaigns = await emailData.getEmailCampaigns()
    return { success: true, data: campaigns }
  } catch (error) {
    console.error("Error fetching campaigns for analytics:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch campaigns for analytics",
    }
  }
}

/**
 * Server action to get email analytics data
 */
export async function fetchEmailAnalytics(timeRange: '7days' | '30days' | '90days' = '30days'): Promise<{
  success: boolean
  data?: any[]
  error?: string
}> {
  try {
    const analytics = await emailData.getEmailAnalytics(timeRange)
    return { success: true, data: analytics }
  } catch (error) {
    console.error("Error fetching email analytics:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email analytics",
    }
  }
}

/**
 * Server action to get overall email marketing metrics
 */
export async function fetchEmailMarketingMetrics(): Promise<{
  success: boolean
  data?: {
    totalCampaigns: number
    totalSent: number
    totalOpens: number
    totalClicks: number
    totalConversions: number
    averageOpenRate: number
    averageClickRate: number
    averageConversionRate: number
  }
  error?: string
}> {
  try {
    const campaigns = await emailData.getEmailCampaigns()
    
    const totalCampaigns = campaigns.length
    const totalSent = campaigns.reduce((sum, campaign) => sum + (campaign.stats?.sent || 0), 0)
    const totalOpens = campaigns.reduce((sum, campaign) => sum + (campaign.stats?.opened || 0), 0)
    const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.stats?.clicked || 0), 0)
    const totalConversions = campaigns.reduce((sum, campaign) => sum + (campaign.stats?.conversions || 0), 0)
    
    const averageOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0
    const averageClickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0
    const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    
    return {
      success: true,
      data: {
        totalCampaigns,
        totalSent,
        totalOpens,
        totalClicks,
        totalConversions,
        averageOpenRate: Math.round(averageOpenRate * 100) / 100,
        averageClickRate: Math.round(averageClickRate * 100) / 100,
        averageConversionRate: Math.round(averageConversionRate * 100) / 100,
      }
    }
  } catch (error) {
    console.error("Error fetching email marketing metrics:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email marketing metrics",
    }
  }
}

/**
 * Server action to get campaign performance comparison
 */
export async function fetchCampaignComparison(campaignIds: string[]): Promise<{
  success: boolean
  data?: any[]
  error?: string
}> {
  try {
    const campaigns = await emailData.getEmailCampaigns()
    const selectedCampaigns = campaigns.filter(campaign => campaignIds.includes(campaign.id))
    
    const comparisonData = selectedCampaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      segment: campaign.segment,
      status: campaign.status,
      stats: campaign.stats || {
        total: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        conversions: 0
      }
    }))
    
    return { success: true, data: comparisonData }
  } catch (error) {
    console.error("Error fetching campaign comparison:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch campaign comparison",
    }
  }
}
