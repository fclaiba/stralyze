// Client-specific types
export type Client = {
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
  services?: string[]
  budget?: string
  createdAt: string
  updatedAt: string
}
