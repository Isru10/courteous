import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    // Protect customer routes
    if (pathname.startsWith("/profile") || pathname.startsWith("/checkout")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/products") ||
          pathname.startsWith("/api/webhooks") ||
          pathname === "/" ||
          pathname.startsWith("/products") ||
          pathname.startsWith("/cart") ||
          pathname.startsWith("/auth")
        ) {
          return true
        }

        // For protected routes, check if user is authenticated
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/api/admin/:path*",
    "/api/orders/:path*",
    "/api/reviews/:path*",
    "/api/users/:path*",
  ],
}
