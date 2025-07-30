"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import * as emailData from "@/lib/data/email-marketing"
import { updateTrackingStatus } from "./email-tracking-actions"
import { z } from "zod"

// Template actions
const templateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(10000, "Content must be less than 10,000 characters"),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned"]),
})

export async function createTemplate(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"

    // Validación adicional
    if (!name?.trim()) {
      return { success: false, error: "Template name is required" }
    }

    if (!subject?.trim()) {
      return { success: false, error: "Email subject is required" }
    }

    if (!content?.trim()) {
      return { success: false, error: "Email content is required" }
    }

    const validatedData = templateSchema.parse({
      name: name.trim(),
      subject: subject.trim(),
      content: content.trim(),
      segment,
    })

    const template = await emailData.createEmailTemplate(validatedData)
    revalidatePath("/admin/email-marketing/templates")
    return { success: true, data: template }
  } catch (error) {
    console.error("Error creating template:", error)
    
    // Manejo específico de errores de validación
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: `Validation error: ${errorMessages}` }
    }
    
    // Manejo de errores de base de datos
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return { success: false, error: "A template with this name already exists" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error. Please try again." }
      }
    }
    
    return { success: false, error: "Failed to create template. Please try again." }
  }
}

export async function updateTemplate(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"

    // Validación adicional
    if (!name?.trim()) {
      return { success: false, error: "Template name is required" }
    }

    if (!subject?.trim()) {
      return { success: false, error: "Email subject is required" }
    }

    if (!content?.trim()) {
      return { success: false, error: "Email content is required" }
    }

    const validatedData = templateSchema.parse({
      name: name.trim(),
      subject: subject.trim(),
      content: content.trim(),
      segment,
    })

    const template = await emailData.updateEmailTemplate(id, validatedData)
    revalidatePath("/admin/email-marketing/templates")
    return { success: true, data: template }
  } catch (error) {
    console.error("Error updating template:", error)
    
    // Manejo específico de errores de validación
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: `Validation error: ${errorMessages}` }
    }
    
    // Manejo de errores de base de datos
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return { success: false, error: "Template not found" }
      }
      if (error.message.includes('duplicate key')) {
        return { success: false, error: "A template with this name already exists" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error. Please try again." }
      }
    }
    
    return { success: false, error: "Failed to update template. Please try again." }
  }
}

// Campaign actions
const campaignSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  template_id: z.string().min(1, "Template is required").uuid("Invalid template ID"),
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

    // Validación adicional
    if (!name?.trim()) {
      return { success: false, error: "Campaign name is required" }
    }

    if (!template_id?.trim()) {
      return { success: false, error: "Template selection is required" }
    }

    const validatedData = campaignSchema.parse({
      name: name.trim(),
      template_id: template_id.trim(),
      segment,
      status,
      scheduled_at: scheduled_at || null,
    })

    // Validación de fecha programada
    if (status === "scheduled" && !scheduled_at) {
      return { success: false, error: "Scheduled date is required when status is 'scheduled'" }
    }

    if (scheduled_at) {
      const scheduledDate = new Date(scheduled_at)
      const now = new Date()
      if (scheduledDate <= now) {
        return { success: false, error: "Scheduled date must be in the future" }
      }
    }

    const campaign = await emailData.createEmailCampaign(validatedData)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error creating campaign:", error)
    
    // Manejo específico de errores de validación
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: `Validation error: ${errorMessages}` }
    }
    
    // Manejo de errores de base de datos
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return { success: false, error: "A campaign with this name already exists" }
      }
      if (error.message.includes('foreign key')) {
        return { success: false, error: "Selected template does not exist" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error. Please try again." }
      }
    }
    
    return { success: false, error: "Failed to create campaign. Please try again." }
  }
}

export async function updateCampaign(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const template_id = formData.get("template_id") as string
    const segment = formData.get("segment") as "new_lead" | "in_process" | "closed_deal" | "abandoned"
    const status = formData.get("status") as "draft" | "scheduled"
    const scheduled_at = formData.get("scheduled_at") as string

    // Validación adicional
    if (!name?.trim()) {
      return { success: false, error: "Campaign name is required" }
    }

    if (!template_id?.trim()) {
      return { success: false, error: "Template selection is required" }
    }

    const validatedData = campaignSchema.parse({
      name: name.trim(),
      template_id: template_id.trim(),
      segment,
      status,
      scheduled_at: scheduled_at || null,
    })

    // Validación de fecha programada
    if (status === "scheduled" && !scheduled_at) {
      return { success: false, error: "Scheduled date is required when status is 'scheduled'" }
    }

    if (scheduled_at) {
      const scheduledDate = new Date(scheduled_at)
      const now = new Date()
      if (scheduledDate <= now) {
        return { success: false, error: "Scheduled date must be in the future" }
      }
    }

    const campaign = await emailData.updateEmailCampaign(id, validatedData)
    revalidatePath("/admin/email-marketing/campaigns")
    return { success: true, data: campaign }
  } catch (error) {
    console.error("Error updating campaign:", error)
    
    // Manejo específico de errores de validación
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: `Validation error: ${errorMessages}` }
    }
    
    // Manejo de errores de base de datos
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return { success: false, error: "Campaign not found" }
      }
      if (error.message.includes('duplicate key')) {
        return { success: false, error: "A campaign with this name already exists" }
      }
      if (error.message.includes('foreign key')) {
        return { success: false, error: "Selected template does not exist" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error. Please try again." }
      }
    }
    
    return { success: false, error: "Failed to update campaign. Please try again." }
  }
}

// Send campaign action
export async function sendCampaign(campaignId: string) {
  try {
    // Validación de entrada
    if (!campaignId?.trim()) {
      return { success: false, error: "Campaign ID is required" }
    }

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
    
    // Manejo específico de errores
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return { success: false, error: "Campaign not found" }
      }
      if (error.message.includes('permission')) {
        return { success: false, error: "You don't have permission to send this campaign" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Email service connection error. Please try again." }
      }
    }
    
    return { success: false, error: "Failed to send campaign. Please try again." }
  }
}

// Email tracking actions
export async function trackEmailOpen(campaignId: string, recipientEmail: string) {
  try {
    // Validación de entrada
    if (!campaignId?.trim()) {
      return { success: false, error: "Campaign ID is required" }
    }

    if (!recipientEmail?.trim()) {
      return { success: false, error: "Recipient email is required" }
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return { success: false, error: "Invalid email format" }
    }

    await updateTrackingStatus(campaignId, recipientEmail, "opened")
    return { success: true }
  } catch (error) {
    console.error("Error tracking email open:", error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return { success: false, error: "Campaign or recipient not found" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error" }
      }
    }
    
    return { success: false, error: "Failed to track email open" }
  }
}

export async function trackEmailClick(campaignId: string, recipientEmail: string) {
  try {
    // Validación de entrada
    if (!campaignId?.trim()) {
      return { success: false, error: "Campaign ID is required" }
    }

    if (!recipientEmail?.trim()) {
      return { success: false, error: "Recipient email is required" }
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return { success: false, error: "Invalid email format" }
    }

    await updateTrackingStatus(campaignId, recipientEmail, "clicked")
    return { success: true }
  } catch (error) {
    console.error("Error tracking email click:", error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return { success: false, error: "Campaign or recipient not found" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error" }
      }
    }
    
    return { success: false, error: "Failed to track email click" }
  }
}

export async function unsubscribeEmail(campaignId: string, recipientEmail: string) {
  try {
    // Validación de entrada
    if (!campaignId?.trim()) {
      return { success: false, error: "Campaign ID is required" }
    }

    if (!recipientEmail?.trim()) {
      return { success: false, error: "Recipient email is required" }
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return { success: false, error: "Invalid email format" }
    }

    await updateTrackingStatus(campaignId, recipientEmail, "unsubscribed")
    return { success: true }
  } catch (error) {
    console.error("Error unsubscribing email:", error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return { success: false, error: "Campaign or recipient not found" }
      }
      if (error.message.includes('connection')) {
        return { success: false, error: "Database connection error" }
      }
    }
    
    return { success: false, error: "Failed to unsubscribe" }
  }
}
