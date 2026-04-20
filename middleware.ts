import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value

  // Rutas protegidas
  const protectedRoutes = [
    "/activos",
    "/prestamos",
    "/mantenimientos",
    "/auditorias",
    "/reportes",
  ]

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Si intenta entrar sin token → lo mandas al login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}