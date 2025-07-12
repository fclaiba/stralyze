"use server"

import { revalidatePath } from "next/cache"
import * as emailData from "@/lib/data/email-marketing"
import type { EmailCampaign } from "@/types/email-marketing"

/**
 * Server action to fetch all email campaigns
 * This keeps the service role credentials on the server side
 */
export async function fetchEmailCampaigns(): Promise<{ success: boolean; data?: EmailCampaign[]; error?: string }> {
  try {
    const campaigns = await emailData.getEmailCampaigns()
    return { success: true, data: campaigns }
  } catch (error) {
    console.error("Error fetching email campaigns:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email campaigns",
    }
  }
}

/**
 * Server action to fetch a single email campaign
 */
export async function fetchEmailCampaign(
  id: string,
): Promise<{ success: boolean; data?: EmailCampaign; error?: string }> {
  try {
    const campaign = await emailData.getEmailCampaign(id)
    if (!campaign) {
      return { success: false, error: "Campaign not found" }
    }
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error fetching email campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email campaign",
    }
  }
}

/**
 * Server action to delete an email campaign
 */
export async function deleteEmailCampaignAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await emailData.deleteEmailCampaign(id)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true }
  } catch (error) {
    console.error("Error deleting email campaign:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete email campaign",
    }
  }
}
