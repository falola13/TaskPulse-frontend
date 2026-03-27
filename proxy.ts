import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isJwtValid } from "@/lib/jwt";

// Paths that require a valid, non-expired JWT cookie
const protectedPaths = ["/dashboard", "/profile"];

// Paths that should NOT be accessible when already authenticated
const authPaths = ["/login", "/register", "/verify-2fa"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  // Quickly skip if route is neither protected nor an auth page
  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const isValid = isJwtValid(accessToken);
  const tokenFromQuery = req.nextUrl.searchParams.get("token");
  const isOAuthTokenValid = isJwtValid(tokenFromQuery);

  // OAuth callback flow: backend redirects with ?token=...
  // Persist it as frontend cookie before route-guard checks redirect to /login.
  if (isProtected && !isValid && tokenFromQuery && isOAuthTokenValid) {
    const cleanedUrl = req.nextUrl.clone();
    cleanedUrl.searchParams.delete("token");
    cleanedUrl.searchParams.delete("message");

    const response = NextResponse.redirect(cleanedUrl);
    response.cookies.set("access_token", tokenFromQuery, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  }

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
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/verify-2fa",
  ],
};
