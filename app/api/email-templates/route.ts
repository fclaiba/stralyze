import { NextRequest, NextResponse } from "next/server"
import { createEmailTemplate, getEmailTemplates } from "@/lib/data/email-marketing"

export async function GET() {
  try {
    const templates = await getEmailTemplates()
    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    console.error("Error fetching email templates:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch email templates" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subject, content, segment } = body

    if (!name || !subject || !content || !segment) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const template = await createEmailTemplate({
      name,
      subject,
      content,
      segment
    })

    return NextResponse.json({ success: true, data: template })
  } catch (error) {
    console.error("Error creating email template:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create email template" },
      { status: 500 }
    )
  }
} 