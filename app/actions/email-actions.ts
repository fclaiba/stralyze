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

export async function deleteTemplate(id: string) {
  try {
    await emailData.deleteEmailTemplate(id)
    revalidatePath("/admin/email-marketing/templates")
    return { success: true }
  } catch (error) {
    console.error("Error deleting template:", error)
    return { success: false, error: "Failed to delete template" }
  }
}

// Campaign actions
const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  template_id: z.string().uuid("Invalid template ID"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
  status: z.enum(["draft", "scheduled", "sending", "sent", "cancelled"]),
  scheduled_at: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val && val.trim() !== "" ? val : null)),
})

export async function createCampaign(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const template_id = formData.get("template_id") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"
    const status = formData.get("status") as "draft" | "scheduled" | "sending" | "sent" | "cancelled"
    const scheduled_at = formData.get("scheduled_at") as string | null

    // Validate and transform the data
    const validatedData = campaignSchema.parse({
      name,
      template_id,
      segment,
      status,
      scheduled_at,
    })

    // If status is not scheduled, ensure scheduled_at is null
    const finalData = {
      ...validatedData,
      scheduled_at: validatedData.status !== "scheduled" ? null : validatedData.scheduled_at,
      sent_at: null,
    }

    const campaign = await emailData.createEmailCampaign(finalData)

    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error creating campaign:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    // Check for database-specific errors
    if (error instanceof Error) {
      if (error.message.includes("invalid input syntax for type timestamp")) {
        return { success: false, error: "Invalid date format. Please use a valid date and time." }
      }
    }
    return { success: false, error: "Failed to create campaign" }
  }
}

export async function updateCampaign(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const template_id = formData.get("template_id") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"
    const status = formData.get("status") as "draft" | "scheduled" | "sending" | "sent" | "cancelled"
    const scheduled_at = formData.get("scheduled_at") as string | null

    // Validate and transform the data
    const validatedData = campaignSchema.parse({
      name,
      template_id,
      segment,
      status,
      scheduled_at,
    })

    // If status is not scheduled, ensure scheduled_at is null
    const finalData = {
      ...validatedData,
      scheduled_at: validatedData.status !== "scheduled" ? null : validatedData.scheduled_at,
    }

    const campaign = await emailData.updateEmailCampaign(id, finalData)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error updating campaign:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    // Check for database-specific errors
    if (error instanceof Error) {
      if (error.message.includes("invalid input syntax for type timestamp")) {
        return { success: false, error: "Invalid date format. Please use a valid date and time." }
      }
    }
    return { success: false, error: "Failed to update campaign" }
  }
}

export async function deleteCampaign(id: string) {
  try {
    await emailData.deleteEmailCampaign(id)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true }
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return { success: false, error: "Failed to delete campaign" }
  }
}

// Send campaign action
export async function sendCampaign(id: string) {
  try {
    // Get the campaign
    const campaign = await emailData.getEmailCampaign(id)
    if (!campaign) {
      return { success: false, error: "Campaign not found" }
    }

    // Get the template
    const template = await emailData.getEmailTemplate(campaign.template_id)
    if (!template) {
      return { success: false, error: "Template not found" }
    }

    // Update campaign status to sent
    await emailData.updateEmailCampaign(id, {
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    // In a real implementation, you would send emails here
    // For now, we'll just simulate success
    console.log(`Simulating sending campaign "${campaign.name}" to segment "${campaign.segment}"`)

    return { success: true, message: "Campaign sent successfully" }
  } catch (error) {
    console.error("Error sending campaign:", error)
    return { success: false, error: "Failed to send campaign" }
  }
}

// Unsubscribe action
export async function unsubscribeFromEmails(clientId: string) {
  try {
    await emailData.unsubscribeClient(clientId)
    return { success: true }
  } catch (error) {
    console.error("Error unsubscribing client:", error)
    return { success: false, error: "Failed to unsubscribe" }
  }
}
