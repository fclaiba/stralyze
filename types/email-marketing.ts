export type EmailTemplate = {
  id: string
  name: string
  subject: string
  content: string
  segment: "new_lead" | "in_process" | "closed_deal" | "abandoned"
  created_at: string
  updated_at: string
}

export type EmailCampaign = {
  id: string
  name: string
  template_id: string
  segment: "new_lead" | "in_process" | "closed_deal" | "abandoned"
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled"
  scheduled_at: string | null
  sent_at: string | null
  created_at: string
  updated_at: string
  template?: EmailTemplate
  stats?: {
    total: number
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
    conversions: number
  }
}

export type EmailTracking = {
  id: string
  campaign_id: string
  client_id: string
  email: string
  status: "pending" | "sent" | "delivered" | "opened" | "clicked" | "bounced" | "unsubscribed"
  sent_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
  bounce_reason: string | null
  tracking_id: string
  created_at: string
  updated_at: string
  client?: {
    company: string
    contact: string
  }
}

export type EmailClick = {
  id: string
  tracking_id: string
  url: string
  clicked_at: string
}
