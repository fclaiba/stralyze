import { NextResponse } from "next/server"
import { getClientById, updateClient, deleteClient } from "@/lib/data/clients"
import { z } from "zod"

const updateClientSchema = z.object({
  company: z.string().min(2).optional(),
  status: z.enum(["New Lead", "In Process", "Closed Deal", "Abandoned"]).optional(),
  industry: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  paymentMethod: z.string().optional(),
  contractStatus: z.enum(["Pending", "Drafted", "Under Review", "Signed", "Completed", "Cancelled"]).optional(),
  deposit: z.number().min(0).optional(),
  finalPayment: z.number().min(0).optional(),
  totalAmount: z.number().min(0).optional(),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await getClientById(params.id)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    try {
      const validatedData = updateClientSchema.parse(body)
      const updatedClient = await updateClient(params.id, validatedData)

      if (!updatedClient) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
      }

      return NextResponse.json(updatedClient)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation failed", details: error.format() }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteClient(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
