import { z } from "zod"

export const templateSchema = z.object({
  name: z.string().min(3, { message: "Template name must be at least 3 characters" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  category: z.enum(["welcome", "follow_up", "promotional", "newsletter", "notification", "other"]),
  is_active: z.boolean().default(true),
})

export const templateUpdateSchema = templateSchema.partial()

export type TemplateFormData = z.infer<typeof templateSchema>
export type TemplateUpdateData = z.infer<typeof templateUpdateSchema> 