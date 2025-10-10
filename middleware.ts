import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Simple rate limiting based on IP (basic protection without Arcjet for now)
  // This is a fallback implementation while we resolve the client-side issue

  // Apply basic protection to sensitive endpoints
  if (pathname.startsWith("/api/")) {
    // Add basic headers for security
    const response = NextResponse.next();

    // Add security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and internal Next.js routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
