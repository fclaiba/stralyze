import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  case_id: z.string().uuid().optional(),
  date: z.date(),
  time: z.string().optional(),
  duration: z.number().positive().optional(),
  type: z.enum(["meeting", "call", "deadline", "reminder", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  location: z.string().optional(),
  is_all_day: z.boolean().default(false),
  color: z.string().optional(),
  recurring: z.enum(["none", "daily", "weekly", "monthly", "yearly"]).default("none"),
})

export const eventUpdateSchema = eventSchema.partial()

export type EventFormData = z.infer<typeof eventSchema>
export type EventUpdateData = z.infer<typeof eventUpdateSchema> 