import { NextRequest, NextResponse } from "next/server"
import { getEmailAnalytics } from "@/lib/data/email-marketing"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') as '7days' | '30days' | '90days' || '30days'

    const analytics = await getEmailAnalytics(timeRange)
    return NextResponse.json({ success: true, data: analytics })
  } catch (error) {
    console.error("Error fetching email analytics:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch email analytics" },
      { status: 500 }
    )
  }
} 