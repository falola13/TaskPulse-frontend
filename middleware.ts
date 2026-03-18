import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isJwtValid } from "@/lib/jwt";

// Paths that require a valid, non-expired JWT cookie
const protectedPaths = ["/dashboard", "/profile"];

// Paths that should NOT be accessible when already authenticated
const authPaths = ["/login", "/register", "/verify-2fa"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // Quickly skip if route is neither protected nor an auth page
  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const isValid = isJwtValid(accessToken);

  // No/invalid token
  if (!isValid) {
    if (isProtected) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    // On auth pages, just continue as logged-out
    return NextResponse.next();
  }

  // Valid token:
  // - Allow protected routes.
  // - Redirect away from auth pages to dashboard.
  if (isAuthPage) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
