"use server"

import * as emailData from "@/lib/data/email-marketing"
import type { EmailTracking } from "@/types/email-marketing"

/**
 * Server action to fetch campaign tracking data
 */
export async function fetchCampaignTracking(campaignId: string): Promise<{
  success: boolean
  data?: EmailTracking[]
  error?: string
}> {
  try {
    const tracking = await emailData.getEmailTracking(campaignId)
    return { success: true, data: tracking }
  } catch (error) {
    console.error("Error fetching campaign tracking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch campaign tracking",
    }
  }
}

/**
 * Server action to update tracking status
 */
export async function updateTrackingStatus(
  campaignId: string,
  recipientEmail: string,
  status: 'opened' | 'clicked' | 'bounced' | 'unsubscribed'
): Promise<{ success: boolean; error?: string }> {
  try {
    await emailData.updateTrackingStatus(campaignId, recipientEmail, status)
    return { success: true }
  } catch (error) {
    console.error("Error updating tracking status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update tracking status",
    }
  }
}

/**
 * Server action to get tracking statistics for a campaign
 */
export async function getCampaignTrackingStats(campaignId: string): Promise<{
  success: boolean
  data?: {
    totalRecipients: number
    totalOpened: number
    totalClicked: number
    totalBounced: number
    totalUnsubscribed: number
    openRate: number
    clickRate: number
    bounceRate: number
    unsubscribeRate: number
  }
  error?: string
}> {
  try {
    const tracking = await emailData.getEmailTracking(campaignId)
    
    const totalRecipients = tracking.length
    const totalOpened = tracking.filter(t => t.opened).length
    const totalClicked = tracking.filter(t => t.clicked).length
    const totalBounced = tracking.filter(t => t.bounced).length
    const totalUnsubscribed = tracking.filter(t => t.unsubscribed).length
    
    const openRate = totalRecipients > 0 ? (totalOpened / totalRecipients) * 100 : 0
    const clickRate = totalRecipients > 0 ? (totalClicked / totalRecipients) * 100 : 0
    const bounceRate = totalRecipients > 0 ? (totalBounced / totalRecipients) * 100 : 0
    const unsubscribeRate = totalRecipients > 0 ? (totalUnsubscribed / totalRecipients) * 100 : 0
    
    return {
      success: true,
      data: {
        totalRecipients,
        totalOpened,
        totalClicked,
        totalBounced,
        totalUnsubscribed,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        unsubscribeRate: Math.round(unsubscribeRate * 100) / 100,
      }
    }
  } catch (error) {
    console.error("Error getting campaign tracking stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get campaign tracking stats",
    }
  }
}

/**
 * Server action to get tracking data by date range
 */
export async function getTrackingByDateRange(
  campaignId: string,
  startDate: string,
  endDate: string
): Promise<{
  success: boolean
  data?: EmailTracking[]
  error?: string
}> {
  try {
    const tracking = await emailData.getEmailTracking(campaignId)
    
    // Filter by date range
    const filteredTracking = tracking.filter(track => {
      const trackDate = new Date(track.created_at).toISOString().split('T')[0]
      return trackDate >= startDate && trackDate <= endDate
    })
    
    return { success: true, data: filteredTracking }
  } catch (error) {
    console.error("Error getting tracking by date range:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get tracking by date range",
    }
  }
}
