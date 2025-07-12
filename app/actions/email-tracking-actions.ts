"use server"

import { createServiceClient } from "@/lib/supabase/server"
import * as emailData from "@/lib/data/email-marketing"
import type { EmailTracking } from "@/types/email-marketing"

/**
 * Server action to fetch tracking data for a campaign
 */
export async function fetchCampaignTracking(campaignId: string): Promise<{
  success: boolean
  data?: {
    opens: number
    clicks: number
    conversions: number
    bounces: number
    unsubscribes: number
  }
  error?: string
}> {
  try {
    const trackingData = await emailData.getCampaignTracking(campaignId)
    return { success: true, data: trackingData }
  } catch (error) {
    console.error("Error fetching campaign tracking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch campaign tracking data",
    }
  }
}

/**
 * Updates the status of an email tracking record by tracking_id
 * This function handles finding the record by tracking_id and updating it
 */
export async function updateTrackingStatus(
  trackingId: string,
  status: string,
  additionalData: Record<string, any> = {},
) {
  try {
    // Find the tracking record by tracking_id
    const supabase = createServiceClient()
    const { data: trackingRecords, error: findError } = await supabase
      .from("email_tracking")
      .select("id")
      .eq("tracking_id", trackingId)

    if (findError) {
      console.error("Error finding tracking record:", findError)
      throw new Error(findError.message)
    }

    if (!trackingRecords || trackingRecords.length === 0) {
      throw new Error(`Tracking record with tracking_id ${trackingId} not found`)
    }

    // If multiple records found (shouldn't happen but let's handle it)
    if (trackingRecords.length > 1) {
      console.warn(`Multiple tracking records found with tracking_id ${trackingId}. Updating the first one.`)
    }

    const recordId = trackingRecords[0].id

    // Now update the record using the internal ID
    const updateData: Record<string, any> = {
      status,
      ...additionalData,
    }

    // Add timestamp based on status
    switch (status) {
      case "sent":
        updateData.sent_at = new Date().toISOString()
        break
      case "delivered":
        updateData.delivered_at = new Date().toISOString()
        break
      case "opened":
        updateData.opened_at = new Date().toISOString()
        break
      case "clicked":
        updateData.clicked_at = new Date().toISOString()
        break
    }

    // Update the record
    await emailData.updateEmailTracking(recordId, updateData)
    return { success: true }
  } catch (error) {
    console.error(`Error updating tracking status to ${status}:`, error)
    throw error
  }
}

/**
 * Records an email open event
 */
export async function recordEmailOpen(trackingId: string) {
  try {
    await updateTrackingStatus(trackingId, "opened")
    return { success: true }
  } catch (error) {
    console.error("Error recording email open:", error)
    return { success: false, error: "Failed to record email open" }
  }
}

/**
 * Records an email click event
 */
export async function recordEmailClick(trackingId: string, url: string) {
  try {
    // Find the tracking record by tracking_id
    const supabase = createServiceClient()
    const { data: trackingRecords, error: findError } = await supabase
      .from("email_tracking")
      .select("id")
      .eq("tracking_id", trackingId)

    if (findError) {
      console.error("Error finding tracking record:", findError)
      throw new Error(findError.message)
    }

    if (!trackingRecords || trackingRecords.length === 0) {
      throw new Error(`Tracking record with tracking_id ${trackingId} not found`)
    }

    const recordId = trackingRecords[0].id

    // Update the tracking record
    await updateTrackingStatus(trackingId, "clicked")

    // Record the click
    await emailData.createEmailClick(recordId, trackingId, url)

    return { success: true }
  } catch (error) {
    console.error("Error recording email click:", error)
    return { success: false, error: "Failed to record email click" }
  }
}

export async function getCampaignTracking(campaignId: string): Promise<{
  success: boolean
  data?: {
    opens: number
    clicks: number
    conversions: number
    bounces: number
    unsubscribes: number
  }
  error?: string
}> {
  try {
    const trackingData = await emailData.getCampaignTracking(campaignId)
    return { success: true, data: trackingData }
  } catch (error) {
    return { success: false, error: "Failed to get campaign tracking" }
  }
}
