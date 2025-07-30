import { z } from "zod"

export const caseSchema = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be less than 200 characters" })
    .regex(/^[a-zA-Z0-9\s\-_.,()]+$/, { message: "Title contains invalid characters" }),
  
  client_id: z.string()
    .uuid({ message: "Please select a valid client" }),
  
  status: z.enum(["open", "in_progress", "completed", "cancelled"], {
    errorMap: () => ({ message: "Please select a valid status" })
  }),
  
  priority: z.enum(["low", "medium", "high", "urgent"], {
    errorMap: () => ({ message: "Please select a valid priority level" })
  }),
  
  assigned_to: z.string()
    .uuid({ message: "Please select a valid user" })
    .optional(),
  
  budget: z.number()
    .min(0, { message: "Budget must be 0 or greater" })
    .max(999999999.99, { message: "Budget amount is too large" })
    .optional(),
  
  start_date: z.date({
    errorMap: () => ({ message: "Please enter a valid start date" })
  }).optional(),
  
  due_date: z.date({
    errorMap: () => ({ message: "Please enter a valid due date" })
  }).optional(),
  
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
  
  progress: z.number()
    .min(0, { message: "Progress must be between 0 and 100" })
    .max(100, { message: "Progress must be between 0 and 100" })
    .default(0),
}).refine((data) => {
  // Validación personalizada: la fecha de vencimiento debe ser posterior a la fecha de inicio
  if (data.start_date && data.due_date) {
    return data.due_date > data.start_date
  }
  return true
}, {
  message: "Due date must be after start date",
  path: ["due_date"]
}).refine((data) => {
  // Validación personalizada: el progreso debe ser 100% si el estado es completado
  if (data.status === "completed") {
    return data.progress === 100
  }
  return true
}, {
  message: "Progress must be 100% when status is completed",
  path: ["progress"]
}).refine((data) => {
  // Validación personalizada: el progreso debe ser 0% si el estado es cancelado
  if (data.status === "cancelled") {
    return data.progress === 0
  }
  return true
}, {
  message: "Progress must be 0% when status is cancelled",
  path: ["progress"]
})

export const caseUpdateSchema = caseSchema.partial()

export type CaseFormData = z.infer<typeof caseSchema>
export type CaseUpdateData = z.infer<typeof caseUpdateSchema> 