import { z } from "zod"

export const caseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  client_id: z.string().uuid({ message: "Please select a valid client" }),
  status: z.enum(["open", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assigned_to: z.string().uuid().optional(),
  budget: z.number().positive().optional(),
  start_date: z.date().optional(),
  due_date: z.date().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  progress: z.number().min(0).max(100).default(0),
})

export const caseUpdateSchema = caseSchema.partial()

export type CaseFormData = z.infer<typeof caseSchema>
export type CaseUpdateData = z.infer<typeof caseUpdateSchema> 