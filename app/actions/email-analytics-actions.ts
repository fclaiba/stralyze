"use server"

import * as emailData from "@/lib/data/email-marketing"
import type { EmailCampaign } from "@/types/email-marketing"

/**
 * Server action to fetch all email campaigns for analytics
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
      error: error instanceof Error ? error.message : "Failed to fetch campaign analytics data",
    }
  }
}
