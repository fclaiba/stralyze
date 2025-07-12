import { z } from "zod"

export const consultationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  industry: z.string().min(2, { message: "Industry is required" }),
  services: z.array(z.string()).min(1, { message: "Select at least one service" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  budget: z.string().min(1, { message: "Please select a budget range" }),
})

export type ConsultationFormData = z.infer<typeof consultationFormSchema>
