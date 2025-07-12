import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"

const clientSchema = z.object({
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

export async function clientMiddleware(request: NextRequest) {
  if (!["POST", "PUT", "PATCH"].includes(request.method)) {
    return NextResponse.next()
  }

  try {
    const body = await request.json()

    try {
      clientSchema.parse(body)

      // Validate business rules
      if (body.deposit + body.finalPayment !== body.totalAmount) {
        return NextResponse.json({ error: "Deposit plus final payment must equal total amount" }, { status: 400 })
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
