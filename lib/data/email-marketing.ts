import type { EmailCampaign, EmailTemplate, EmailTracking } from "@/types/email-marketing"
import { createClient } from "@/lib/supabase/server"

// Tipos locales para analytics
type EmailAnalytics = {
  id: string
  campaignId: string
  date: string
  opens: number
  clicks: number
  conversions: number
  bounces: number
  unsubscribes: number
}

/**
 * Get all email campaigns
 */
export async function getEmailCampaigns(): Promise<EmailCampaign[]> {
  try {
    const supabase = createClient()
    
    const { data: campaigns, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        template:email_templates(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching campaigns:', error)
      throw new Error(error.message)
    }

    // Transform data to match EmailCampaign type
    return campaigns?.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      template_id: campaign.template_id,
      segment: campaign.segment,
      status: campaign.status,
      scheduled_at: campaign.scheduled_at,
      sent_at: campaign.sent_at,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      template: campaign.template ? {
        id: campaign.template.id,
        name: campaign.template.name,
        subject: campaign.template.subject,
        content: campaign.template.content,
        segment: campaign.template.segment,
        created_at: campaign.template.created_at,
        updated_at: campaign.template.updated_at
      } : undefined,
      stats: {
        total: 0, // Will be calculated from tracking data
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        conversions: 0
      }
    })) || []
  } catch (error) {
    console.error('Error in getEmailCampaigns:', error)
    throw error
  }
}

/**
 * Get a single email campaign by ID
 */
export async function getEmailCampaign(id: string): Promise<EmailCampaign | null> {
  try {
    const supabase = createClient()
    
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        template:email_templates(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching campaign:', error)
      throw new Error(error.message)
    }

    if (!campaign) return null

    // Transform data to match EmailCampaign type
    return {
      id: campaign.id,
      name: campaign.name,
      template_id: campaign.template_id,
      segment: campaign.segment,
      status: campaign.status,
      scheduled_at: campaign.scheduled_at,
      sent_at: campaign.sent_at,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      template: campaign.template ? {
        id: campaign.template.id,
        name: campaign.template.name,
        subject: campaign.template.subject,
        content: campaign.template.content,
        segment: campaign.template.segment,
        created_at: campaign.template.created_at,
        updated_at: campaign.template.updated_at
      } : undefined,
      stats: {
        total: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        conversions: 0
      }
    }
  } catch (error) {
    console.error('Error in getEmailCampaign:', error)
    throw error
  }
}

/**
 * Create a new email campaign
 */
export async function createEmailCampaign(campaignData: {
  name: string
  template_id: string
  segment: string
  status?: string
  scheduled_at?: string | null
}): Promise<EmailCampaign> {
  try {
    const supabase = createClient()
    
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .insert({
        name: campaignData.name,
        template_id: campaignData.template_id,
        segment: campaignData.segment,
        status: campaignData.status || 'draft',
        scheduled_at: campaignData.scheduled_at
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign:', error)
      throw new Error(error.message)
    }

    return {
      id: campaign.id,
      name: campaign.name,
      template_id: campaign.template_id,
      segment: campaign.segment,
      status: campaign.status,
      scheduled_at: campaign.scheduled_at,
      sent_at: campaign.sent_at,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      stats: {
        total: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        conversions: 0
      }
    }
  } catch (error) {
    console.error('Error in createEmailCampaign:', error)
    throw error
  }
}

/**
 * Update an email campaign
 */
export async function updateEmailCampaign(id: string, campaignData: {
  name?: string
  template_id?: string
  segment?: string
  status?: string
  scheduled_at?: string | null
}): Promise<EmailCampaign> {
  try {
    const supabase = createClient()
    
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .update({
        ...campaignData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating campaign:', error)
      throw new Error(error.message)
    }

    return {
      id: campaign.id,
      name: campaign.name,
      template_id: campaign.template_id,
      segment: campaign.segment,
      status: campaign.status,
      scheduled_at: campaign.scheduled_at,
      sent_at: campaign.sent_at,
      created_at: campaign.created_at,
      updated_at: campaign.updated_at,
      stats: {
        total: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        conversions: 0
      }
    }
  } catch (error) {
    console.error('Error in updateEmailCampaign:', error)
    throw error
  }
}

/**
 * Delete an email campaign
 */
export async function deleteEmailCampaign(id: string): Promise<void> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting campaign:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error in deleteEmailCampaign:', error)
    throw error
  }
}

/**
 * Get all email templates
 */
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const supabase = createClient()
    
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates:', error)
      throw new Error(error.message)
    }

    return templates?.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      segment: template.segment,
      created_at: template.created_at,
      updated_at: template.updated_at
    })) || []
  } catch (error) {
    console.error('Error in getEmailTemplates:', error)
    throw error
  }
}

/**
 * Get email templates by segment
 */
export async function getEmailTemplatesBySegment(segment: string): Promise<EmailTemplate[]> {
  try {
    const supabase = createClient()
    
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('segment', segment)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates by segment:', error)
      throw new Error(error.message)
    }

    return templates?.map(template => ({
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      segment: template.segment,
      created_at: template.created_at,
      updated_at: template.updated_at
    })) || []
  } catch (error) {
    console.error('Error in getEmailTemplatesBySegment:', error)
    throw error
  }
}

/**
 * Create a new email template
 */
export async function createEmailTemplate(templateData: {
  name: string
  subject: string
  content: string
  segment: string
}): Promise<EmailTemplate> {
  try {
    const supabase = createClient()
    
    const { data: template, error } = await supabase
      .from('email_templates')
      .insert(templateData)
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      throw new Error(error.message)
    }

    return {
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      segment: template.segment,
      created_at: template.created_at,
      updated_at: template.updated_at
    }
  } catch (error) {
    console.error('Error in createEmailTemplate:', error)
    throw error
  }
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(id: string, templateData: {
  name?: string
  subject?: string
  content?: string
  segment?: string
}): Promise<EmailTemplate> {
  try {
    const supabase = createClient()
    
    const { data: template, error } = await supabase
      .from('email_templates')
      .update({
        ...templateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      throw new Error(error.message)
    }

    return {
      id: template.id,
      name: template.name,
      subject: template.subject,
      content: template.content,
      segment: template.segment,
      created_at: template.created_at,
      updated_at: template.updated_at
    }
  } catch (error) {
    console.error('Error in updateEmailTemplate:', error)
    throw error
  }
}

/**
 * Delete an email template
 */
export async function deleteEmailTemplate(id: string): Promise<void> {
  try {
    const supabase = createClient()
    
    // Check if template is being used by any campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .select('id, name')
      .eq('template_id', id)

    if (campaignsError) {
      console.error('Error checking template usage:', campaignsError)
      throw new Error(campaignsError.message)
    }

    if (campaigns && campaigns.length > 0) {
      const campaignNames = campaigns.map(c => c.name).join(', ')
      throw new Error(`Cannot delete template. It is being used by the following campaigns: ${campaignNames}`)
    }

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting template:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error in deleteEmailTemplate:', error)
    throw error
  }
}

/**
 * Get email tracking data for a campaign
 */
export async function getEmailTracking(campaignId: string): Promise<EmailTracking[]> {
  try {
    const supabase = createClient()
    
    const { data: tracking, error } = await supabase
      .from('email_tracking')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tracking data:', error)
      throw new Error(error.message)
    }

    return tracking?.map(track => ({
      id: track.id,
      campaign_id: track.campaign_id,
      recipient_email: track.recipient_email,
      opened: track.opened,
      clicked: track.clicked,
      bounced: track.bounced,
      unsubscribed: track.unsubscribed,
      opened_at: track.opened_at,
      clicked_at: track.clicked_at,
      bounced_at: track.bounced_at,
      unsubscribed_at: track.unsubscribed_at,
      created_at: track.created_at
    })) || []
  } catch (error) {
    console.error('Error in getEmailTracking:', error)
    throw error
  }
}

/**
 * Update tracking status for an email
 */
export async function updateTrackingStatus(
  campaignId: string,
  recipientEmail: string,
  status: 'opened' | 'clicked' | 'bounced' | 'unsubscribed'
): Promise<void> {
  try {
    const supabase = createClient()
    
    const updateData: any = {
      [status]: true,
      [`${status}_at`]: new Date().toISOString()
    }

    const { error } = await supabase
      .from('email_tracking')
      .update(updateData)
      .eq('campaign_id', campaignId)
      .eq('recipient_email', recipientEmail)

    if (error) {
      console.error('Error updating tracking status:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error in updateTrackingStatus:', error)
    throw error
  }
}

/**
 * Get analytics data for campaigns
 */
export async function getEmailAnalytics(timeRange: '7days' | '30days' | '90days' = '30days'): Promise<EmailAnalytics[]> {
  try {
    const supabase = createClient()
    
    const startDate = new Date()
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90
    startDate.setDate(startDate.getDate() - days)

    const { data: analytics, error } = await supabase
      .from('email_analytics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching analytics:', error)
      throw new Error(error.message)
    }

    return analytics?.map(analytic => ({
      id: analytic.id,
      campaignId: analytic.campaign_id,
      date: analytic.date,
      opens: analytic.total_opened,
      clicks: analytic.total_clicked,
      conversions: analytic.total_conversions,
      bounces: analytic.total_bounced,
      unsubscribes: analytic.total_unsubscribed
    })) || []
  } catch (error) {
    console.error('Error in getEmailAnalytics:', error)
    throw error
  }
}
