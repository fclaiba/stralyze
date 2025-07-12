import { z } from "zod"

export const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
})

export const clientUpdateSchema = clientSchema.partial()

export type ClientFormData = z.infer<typeof clientSchema>
export type ClientUpdateData = z.infer<typeof clientUpdateSchema> 