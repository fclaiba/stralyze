import { z } from "zod"

export const clientSchema = z.object({
  company: z.string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-&.,()]+$/, { message: "Company name contains invalid characters" }),
  
  status: z.enum(["New Lead", "In Process", "Closed Deal", "Abandoned"], {
    errorMap: () => ({ message: "Please select a valid status" })
  }),
  
  industry: z.string()
    .min(2, { message: "Industry must be at least 2 characters" })
    .max(50, { message: "Industry must be less than 50 characters" }),
  
  contact: z.string()
    .min(2, { message: "Contact name must be at least 2 characters" })
    .max(100, { message: "Contact name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Contact name can only contain letters and spaces" }),
  
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be less than 15 digits" })
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{9,14}$/, { message: "Please enter a valid phone number" }),
  
  paymentMethod: z.enum(["Credit Card", "Bank Transfer", "PayPal", "Cash", "Other"], {
    errorMap: () => ({ message: "Please select a valid payment method" })
  }),
  
  contractStatus: z.enum(["Pending", "Drafted", "Under Review", "Signed", "Completed", "Cancelled"], {
    errorMap: () => ({ message: "Please select a valid contract status" })
  }),
  
  deposit: z.number()
    .min(0, { message: "Deposit must be 0 or greater" })
    .max(999999999.99, { message: "Deposit amount is too large" }),
  
  finalPayment: z.number()
    .min(0, { message: "Final payment must be 0 or greater" })
    .max(999999999.99, { message: "Final payment amount is too large" }),
  
  totalAmount: z.number()
    .min(0, { message: "Total amount must be 0 or greater" })
    .max(999999999.99, { message: "Total amount is too large" }),
  
  budget: z.string()
    .min(1, { message: "Please select a budget range" })
    .max(50, { message: "Budget description is too long" }),
}).refine((data) => {
  // Validación personalizada: el depósito + pago final debe igualar el total
  return Math.abs((data.deposit + data.finalPayment) - data.totalAmount) < 0.01
}, {
  message: "Deposit plus final payment must equal total amount",
  path: ["totalAmount"]
}).refine((data) => {
  // Validación personalizada: el total debe ser mayor que 0 si hay depósito o pago final
  if (data.deposit > 0 || data.finalPayment > 0) {
    return data.totalAmount > 0
  }
  return true
}, {
  message: "Total amount must be greater than 0 if there are payments",
  path: ["totalAmount"]
})

export const clientUpdateSchema = clientSchema.partial()

export type ClientFormData = z.infer<typeof clientSchema>
export type ClientUpdateData = z.infer<typeof clientUpdateSchema> 