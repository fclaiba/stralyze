"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import * as emailData from "@/lib/data/email-marketing"
import { updateTrackingStatus } from "./email-tracking-actions"
import { z } from "zod"

// Template actions
const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
})

export async function createTemplate(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"

    const validatedData = templateSchema.parse({
      name,
      subject,
      content,
      segment,
    })

    const template = await emailData.createEmailTemplate(validatedData)
    revalidatePath("/admin/email-marketing/templates")
    return { success: true, data: template }
  } catch (error) {
    console.error("Error creating template:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: "Failed to create template" }
  }
}

export async function updateTemplate(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"

    const validatedData = templateSchema.parse({
      name,
      subject,
      content,
      segment,
    })

    const template = await emailData.updateEmailTemplate(id, validatedData)
    revalidatePath("/admin/email-marketing/templates")
    return { success: true, data: template }
  } catch (error) {
    console.error("Error updating template:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: "Failed to update template" }
  }
}

// Campaign actions
const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  template_id: z.string().min(1, "Template is required"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
  status: z.enum(["draft", "scheduled"]),
  scheduled_at: z.string().nullable().optional(),
})

export async function createCampaign(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const template_id = formData.get("template_id") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"
    const status = formData.get("status") as "draft" | "scheduled"
    const scheduled_at = formData.get("scheduled_at") as string

    const validatedData = campaignSchema.parse({
      name,
      template_id,
      segment,
      status,
      scheduled_at: scheduled_at || null,
    })

    const campaign = await emailData.createEmailCampaign(validatedData)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error creating campaign:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: "Failed to create campaign" }
  }
}

export async function updateCampaign(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const template_id = formData.get("template_id") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"
    const status = formData.get("status") as "draft" | "scheduled"
    const scheduled_at = formData.get("scheduled_at") as string

    const validatedData = campaignSchema.parse({
      name,
      template_id,
      segment,
      status,
      scheduled_at: scheduled_at || null,
    })

    const campaign = await emailData.updateEmailCampaign(id, validatedData)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error updating campaign:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: "Failed to update campaign" }
  }
}

// Send campaign action
export async function sendCampaign(campaignId: string) {
  try {
    // Get campaign details
    const campaign = await emailData.getEmailCampaign(campaignId)
    if (!campaign) {
      return { success: false, error: "Campaign not found" }
    }

    if (campaign.status !== "draft") {
      return { success: false, error: "Only draft campaigns can be sent" }
    }

    // Update campaign status to sending
    await emailData.updateEmailCampaign(campaignId, {
      status: "sending"
    })

    // Simulate email sending process
    // In a real implementation, this would:
    // 1. Get recipients based on segment
    // 2. Send emails through email service (SendGrid, Mailgun, etc.)
    // 3. Track delivery, opens, clicks
    // 4. Update campaign status to sent

    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate sending time

    // Update campaign status to sent
    await emailData.updateEmailCampaign(campaignId, {
      status: "sent",
      sent_at: new Date().toISOString()
    })

    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, message: "Campaign sent successfully" }
  } catch (error) {
    console.error("Error sending campaign:", error)
    return { success: false, error: "Failed to send campaign" }
  }
}

// Email tracking actions
export async function trackEmailOpen(campaignId: string, recipientEmail: string) {
  try {
    await updateTrackingStatus(campaignId, recipientEmail, "opened")
    return { success: true }
  } catch (error) {
    console.error("Error tracking email open:", error)
    return { success: false, error: "Failed to track email open" }
  }
}

export async function trackEmailClick(campaignId: string, recipientEmail: string) {
  try {
    await updateTrackingStatus(campaignId, recipientEmail, "clicked")
    return { success: true }
  } catch (error) {
    console.error("Error tracking email click:", error)
    return { success: false, error: "Failed to track email click" }
  }
}

export async function unsubscribeEmail(campaignId: string, recipientEmail: string) {
  try {
    await updateTrackingStatus(campaignId, recipientEmail, "unsubscribed")
    return { success: true }
  } catch (error) {
    console.error("Error unsubscribing email:", error)
    return { success: false, error: "Failed to unsubscribe" }
  }
}
