import { z } from "zod"

export const campaignSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters" }),
  template_id: z.string().uuid({ message: "Please select a valid template" }),
  segment: z.enum(["new_lead", "in_process", "closed_deal", "abandoned", "all"]),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  scheduled_at: z.date().optional(),
  status: z.enum(["draft", "scheduled", "sending", "sent", "cancelled"]).default("draft"),
})

export const campaignUpdateSchema = campaignSchema.partial()

export type CampaignFormData = z.infer<typeof campaignSchema>
export type CampaignUpdateData = z.infer<typeof campaignUpdateSchema> 