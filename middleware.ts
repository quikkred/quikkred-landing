import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Test Mode: bypass the auth guard so /user and /dashboard render with dummy
// data for demo recordings. Enabled by NEXT_PUBLIC_TEST_MODE=true, the
// ?testMode=1 query param, or the qk_test_mode cookie. See lib/testMode.
function isTestModeRequest(request: NextRequest): boolean {
  if (process.env.NEXT_PUBLIC_TEST_MODE === "true") return true;
  const q = request.nextUrl.searchParams.get("testMode");
  if (q === "1" || q === "true") return true;
  if (q === "0" || q === "false") return false;
  return request.cookies.get("qk_test_mode")?.value === "1";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Test Mode short-circuits all auth redirects.
  if (isTestModeRequest(request)) {
    return NextResponse.next();
  }

  // ✅ Securely verify the session token (checks signature & expiration)
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const loggedIn = !!token;

  // -------------------------
  // Auth redirects
  // -------------------------

  // ✅ If user is logged (valid token) and tries to open /login => send to /user
  if (pathname === "/login" && loggedIn) {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  // ✅ Protect routes: /user/* and /dashboard/*
  const isProtected =
    pathname === "/user" ||
    pathname.startsWith("/user/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (isProtected && !loggedIn) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // same exclusions + allow middleware to run on login/user/dashboard
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};