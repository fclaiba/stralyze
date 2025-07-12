import type { EmailCampaign, EmailTemplate } from "@/types/email-marketing"

// Add EmailAnalytics type locally since it's not in the main types file
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

// Mock data for development
const mockCampaigns: EmailCampaign[] = [
  {
    id: "camp_001",
    name: "Welcome New Leads",
    template_id: "template_001",
    segment: "new_lead",
    status: "sent",
    scheduled_at: "2024-02-15T10:00:00Z",
    sent_at: "2024-02-15T10:00:00Z",
    created_at: "2024-02-14T15:30:00Z",
    updated_at: "2024-02-15T10:00:00Z",
    stats: {
      total: 1250,
      sent: 1250,
      delivered: 1200,
      opened: 850,
      clicked: 150,
      bounced: 25,
      unsubscribed: 5,
      conversions: 100,
    },
  },
  {
    id: "camp_002",
    name: "Follow-up In Process",
    template_id: "template_002",
    segment: "in_process",
    status: "scheduled",
    scheduled_at: "2024-02-20T14:00:00Z",
    sent_at: null,
    created_at: "2024-02-16T09:15:00Z",
    updated_at: "2024-02-16T09:15:00Z",
    stats: {
      total: 450,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      conversions: 0,
    },
  },
  {
    id: "camp_003",
    name: "Closed Deal Celebration",
    template_id: "template_003",
    segment: "closed_deal",
    status: "draft",
    scheduled_at: null,
    sent_at: null,
    created_at: "2024-02-17T11:20:00Z",
    updated_at: "2024-02-17T11:20:00Z",
    stats: {
      total: 280,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      conversions: 0,
    },
  },
  {
    id: "camp_004",
    name: "Re-engagement Abandoned",
    template_id: "template_001",
    segment: "abandoned",
    status: "draft",
    scheduled_at: null,
    sent_at: null,
    created_at: "2024-02-18T16:45:00Z",
    updated_at: "2024-02-18T16:45:00Z",
    stats: {
      total: 200,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      conversions: 0,
    },
  },
]

const mockTemplates: EmailTemplate[] = [
  {
    id: "template_001",
    name: "Welcome Template",
    subject: "Welcome to {{company_name}}",
    content: "<h1>Welcome {{first_name}}!</h1><p>We're excited to have you on board.</p>",
    segment: "new_lead",
    created_at: "2024-02-10T10:00:00Z",
    updated_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "template_002",
    name: "Follow-up Template",
    subject: "Following up on {{topic}}",
    content: "<h2>Hi {{first_name}},</h2><p>Just checking in on {{topic}}.</p>",
    segment: "in_process",
    created_at: "2024-02-11T14:30:00Z",
    updated_at: "2024-02-11T14:30:00Z",
  },
  {
    id: "template_003",
    name: "Promotional Template",
    subject: "Special Offer: {{offer_title}}",
    content: "<h1>Special Offer!</h1><p>{{offer_description}}</p><a href='{{cta_link}}'>Learn More</a>",
    segment: "closed_deal",
    created_at: "2024-02-12T09:15:00Z",
    updated_at: "2024-02-12T09:15:00Z",
  },
]

const mockAnalytics: EmailAnalytics[] = [
  {
    id: "analytics_001",
    campaignId: "camp_001",
    date: "2024-02-15",
    opens: 850,
    clicks: 150,
    conversions: 100,
    bounces: 25,
    unsubscribes: 5,
  },
  {
    id: "analytics_002",
    campaignId: "camp_001",
    date: "2024-02-16",
    opens: 120,
    clicks: 18,
    conversions: 12,
    bounces: 2,
    unsubscribes: 1,
  },
]

/**
 * Get all email campaigns
 */
export async function getEmailCampaigns(): Promise<EmailCampaign[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockCampaigns
}

/**
 * Get a single email campaign by ID
 */
export async function getEmailCampaign(id: string): Promise<EmailCampaign | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockCampaigns.find(campaign => campaign.id === id) || null
}

/**
 * Create a new email campaign
 */
export async function createEmailCampaign(campaign: Omit<EmailCampaign, "id" | "created_at" | "updated_at">): Promise<EmailCampaign> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newCampaign: EmailCampaign = {
    ...campaign,
    id: `camp_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  mockCampaigns.push(newCampaign)
  return newCampaign
}

/**
 * Update an email campaign
 */
export async function updateEmailCampaign(id: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const index = mockCampaigns.findIndex(campaign => campaign.id === id)
  if (index === -1) return null
  
  mockCampaigns[index] = {
    ...mockCampaigns[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  return mockCampaigns[index]
}

/**
 * Delete an email campaign
 */
export async function deleteEmailCampaign(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const index = mockCampaigns.findIndex(campaign => campaign.id === id)
  if (index === -1) return false
  
  mockCampaigns.splice(index, 1)
  return true
}

/**
 * Get all email templates
 */
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockTemplates
}

/**
 * Get a single email template by ID
 */
export async function getEmailTemplate(id: string): Promise<EmailTemplate | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockTemplates.find(template => template.id === id) || null
}

/**
 * Create a new email template
 */
export async function createEmailTemplate(template: Omit<EmailTemplate, "id" | "created_at" | "updated_at">): Promise<EmailTemplate> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const newTemplate: EmailTemplate = {
    ...template,
    id: `template_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  mockTemplates.push(newTemplate)
  return newTemplate
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const index = mockTemplates.findIndex(template => template.id === id)
  if (index === -1) return null
  
  mockTemplates[index] = {
    ...mockTemplates[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  return mockTemplates[index]
}

/**
 * Delete an email template
 */
export async function deleteEmailTemplate(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = mockTemplates.findIndex(template => template.id === id)
  if (index === -1) return false
  
  mockTemplates.splice(index, 1)
  return true
}

/**
 * Get analytics for a specific campaign
 */
export async function getCampaignAnalytics(campaignId: string): Promise<EmailAnalytics[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  return mockAnalytics.filter(analytics => analytics.campaignId === campaignId)
}

/**
 * Get overall email marketing analytics
 */
export async function getEmailMarketingAnalytics(): Promise<{
  totalCampaigns: number
  totalSent: number
  totalOpens: number
  totalClicks: number
  totalConversions: number
  averageOpenRate: number
  averageClickRate: number
  averageConversionRate: number
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  const totalCampaigns = mockCampaigns.length
  const totalSent = mockCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.sent || 0), 0)
  const totalOpens = mockCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.opened || 0), 0)
  const totalClicks = mockCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.clicked || 0), 0)
  const totalConversions = mockCampaigns.reduce((sum, campaign) => sum + (campaign.stats?.conversions || 0), 0)
  
  const averageOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0
  const averageClickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0
  const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
  
  return {
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

/**
 * Unsubscribe a client from email marketing
 */
export async function unsubscribeClient(clientId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  // In a real implementation, this would update the client's subscription status
  return true
}

/**
 * Get email templates by segment
 */
export async function getEmailTemplatesBySegment(segmentId: string): Promise<EmailTemplate[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockTemplates.filter(template => template.segment === segmentId)
}

/**
 * Get campaign tracking data
 */
export async function getCampaignTracking(campaignId: string): Promise<{
  opens: number
  clicks: number
  conversions: number
  bounces: number
  unsubscribes: number
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  if (!campaign || !campaign.stats) {
    return {
      opens: 0,
      clicks: 0,
      conversions: 0,
      bounces: 0,
      unsubscribes: 0,
    }
  }
  
  return {
    opens: campaign.stats.opened,
    clicks: campaign.stats.clicked,
    conversions: campaign.stats.conversions || 0,
    bounces: campaign.stats.bounced,
    unsubscribes: campaign.stats.unsubscribed,
  }
}

/**
 * Update email tracking data
 */
export async function updateEmailTracking(campaignId: string, trackingData: {
  opens?: number
  clicks?: number
  conversions?: number
  bounces?: number
  unsubscribes?: number
}): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const campaign = mockCampaigns.find(c => c.id === campaignId)
  if (!campaign || !campaign.stats) {
    return false
  }
  
  // Update the campaign stats
  campaign.stats = {
    ...campaign.stats,
    ...trackingData,
  }
  
  return true
}

/**
 * Create email click record
 */
export async function createEmailClick(campaignId: string, clientId: string, linkUrl: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // In a real implementation, this would create a click record in the database
  console.log(`Email click recorded: Campaign ${campaignId}, Client ${clientId}, URL ${linkUrl}`)
  
  return true
}
