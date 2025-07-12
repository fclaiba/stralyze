import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"

const formSchemas = {
  contact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
  }),
  proposal: z.object({
    clientId: z.string(),
    services: z.array(z.string()),
    budget: z.number().positive(),
    timeline: z.string(),
  }),
  contract: z.object({
    clientId: z.string(),
    terms: z.string(),
    amount: z.number().positive(),
    startDate: z.string().datetime(),
  }),
}

export async function formMiddleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next()
  }

  try {
    const formType = request.headers.get("x-form-type")
    if (!formType || !formSchemas[formType as keyof typeof formSchemas]) {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 })
    }

    const body = await request.json()
    const schema = formSchemas[formType as keyof typeof formSchemas]

    try {
      schema.parse(body)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
