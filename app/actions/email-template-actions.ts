"use server"

import { revalidatePath } from "next/cache"
import * as emailData from "@/lib/data/email-marketing"
import type { EmailTemplate } from "@/types/email-marketing"

/**
 * Server action to fetch all email templates
 */
export async function fetchEmailTemplates(): Promise<{ success: boolean; data?: EmailTemplate[]; error?: string }> {
  try {
    const templates = await emailData.getEmailTemplates()
    return { success: true, data: templates }
  } catch (error) {
    console.error("Error fetching email templates:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email templates",
    }
  }
}

/**
 * Server action to fetch email templates by segment
 */
export async function fetchEmailTemplatesBySegment(segment: string): Promise<{
  success: boolean
  data?: EmailTemplate[]
  error?: string
}> {
  try {
    const templates = await emailData.getEmailTemplatesBySegment(segment)
    return { success: true, data: templates }
  } catch (error) {
    console.error("Error fetching email templates by segment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch email templates",
    }
  }
}

/**
 * Server action to delete an email template
 */
export async function deleteEmailTemplateAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await emailData.deleteEmailTemplate(id)
    revalidatePath("/admin/email-marketing/templates")
    return { success: true }
  } catch (error) {
    console.error("Error deleting email template:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete email template",
    }
  }
}
