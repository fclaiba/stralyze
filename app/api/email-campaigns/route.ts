import { NextRequest, NextResponse } from "next/server"
import { createEmailCampaign, getEmailCampaigns } from "@/lib/data/email-marketing"

export async function GET() {
  try {
    const campaigns = await getEmailCampaigns()
    return NextResponse.json({ success: true, data: campaigns })
  } catch (error) {
    console.error("Error fetching email campaigns:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch email campaigns" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, template_id, segment, status, scheduled_at } = body

    if (!name || !template_id || !segment) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const campaign = await createEmailCampaign({
      name,
      template_id,
      segment,
      status: status || 'draft',
      scheduled_at: scheduled_at || null
    })

    return NextResponse.json({ success: true, data: campaign })
  } catch (error) {
    console.error("Error creating email campaign:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create email campaign" },
      { status: 500 }
    )
  }
} 