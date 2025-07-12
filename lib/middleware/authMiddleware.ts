import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUser } from "@/lib/data/users"

export async function authMiddleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  try {
    const user = await getUser(session)
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Add user to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", user.id)
    requestHeaders.set("x-user-role", user.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
