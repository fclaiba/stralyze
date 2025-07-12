import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createActivity } from "@/lib/data/activities"

export async function activityMiddleware(request: NextRequest) {
  const response = await NextResponse.next()

  try {
    const userId = request.headers.get("x-user-id")
    const method = request.method
    const path = request.nextUrl.pathname
    const resourceType = path.split("/")[2] // Assumes paths like /api/clients/...

    let action: "create" | "update" | "delete"
    switch (method) {
      case "POST":
        action = "create"
        break
      case "PUT":
      case "PATCH":
        action = "update"
        break
      case "DELETE":
        action = "delete"
        break
      default:
        return response
    }

    const body = await request.json()
    const resourceId = path.split("/")[3] || body.id

    if (userId && resourceType && resourceId) {
      await createActivity({
        userId,
        action,
        resourceType: resourceType as any,
        resourceId,
        changes: body,
      })
    }

    return response
  } catch (error) {
    console.error("Error in activity middleware:", error)
    return response
  }
}
