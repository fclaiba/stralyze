// Export all types with named exports (not wildcard exports)
import type { Client } from "./client"
import type { User, UserRole } from "./user"
import type { Activity } from "./activity"
import type { Form } from "./form"

// Re-export with named exports
export type { Client, User, UserRole, Activity, Form }

export type ClientType = {
  id: string
  company: string
  status: "New Lead" | "In Process" | "Closed Deal" | "Abandoned"
  industry: string
  contact: string
  email: string
  phone: string
  paymentMethod: string
  contractStatus: "Pending" | "Drafted" | "Under Review" | "Signed" | "Completed" | "Cancelled"
  deposit: number
  finalPayment: number
  totalAmount: number
  services: string[]
  budget: string
  createdAt: string
  updatedAt: string
}

export type UserType = {
  id: string
  email: string
  name: string
  role: "super-admin" | "admin" | "gestor" | "user"
  password: string
  createdAt: string
  updatedAt: string
}

export type ActivityType = {
  id: string
  userId: string
  action: "create" | "update" | "delete"
  resourceType: "client" | "form" | "user"
  resourceId: string
  changes: any
  createdAt: string
}

export type FormType = {
  id: string
  clientId: string
  type: string
  status: string
  data: any
  createdAt: string
  updatedAt: string
}
