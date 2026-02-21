import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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