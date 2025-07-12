import { NextResponse } from "next/server"
import { getClients, createClient } from "@/lib/data/clients"
import { z } from "zod"

const createClientSchema = z.object({
  company: z.string().min(2),
  status: z.enum(["New Lead", "In Process", "Closed Deal", "Abandoned"]),
  industry: z.string(),
  contact: z.string(),
  email: z.string().email(),
  phone: z.string(),
  paymentMethod: z.string(),
  contractStatus: z.enum(["Pending", "Drafted", "Under Review", "Signed", "Completed", "Cancelled"]),
  deposit: z.number().min(0),
  finalPayment: z.number().min(0),
  totalAmount: z.number().min(0),
})

export async function GET() {
  try {
    const clients = await getClients()
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    try {
      const validatedData = createClientSchema.parse(body)
      const newClient = await createClient(validatedData)
      return NextResponse.json(newClient, { status: 201 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation failed", details: error.format() }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
