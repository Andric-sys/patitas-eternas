import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token

  // Rutas que requieren autenticación
  const authRoutes = ["/admin", "/perfil"]

  // Rutas que requieren rol de administrador
  const adminRoutes = ["/admin"]

  // Verificar si la ruta actual requiere autenticación
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Verificar si la ruta actual requiere rol de administrador
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (isAuthRoute && !isAuthenticated) {
    const url = new URL("/auth/login", req.url)
    url.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Si la ruta requiere rol de administrador y el usuario no es administrador
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/perfil/:path*"],
}

