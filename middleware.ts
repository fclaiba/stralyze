import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin/dashboard', '/admin/clients', '/admin/cases', '/admin/email-marketing']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Por ahora, permitir acceso a todas las rutas para desarrollo
  // La autenticación se manejará en el frontend
  if (isProtectedRoute) {
    // Verificar si hay una sesión en las cookies
    const sessionCookie = req.cookies.get('sb-access-token') || req.cookies.get('session')
    
    if (!sessionCookie) {
      // Redirigir al login solo si no hay sesión
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 