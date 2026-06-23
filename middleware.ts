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

  // ── Admin area (obscured path) ────────────────────────────────────────────
  // The admin tooling lives under /latur-ka-fraud-customer (deliberately
  // unguessable; not linked anywhere in the customer UI). The entry page is the
  // public sign-in (email + password → POST /api/user/login). Everything else
  // under it requires a session; the page + backend enforce the ADMIN role.
  // Admins sign in here, NOT via the customer OTP flow at /login, so an
  // unauthenticated admin sub-route redirects to the entry page (not /login).
  const ADMIN_BASE = "/latur-ka-fraud-customer";
  const isAdminEntry = pathname === ADMIN_BASE;
  const isAdminArea = pathname === ADMIN_BASE || pathname.startsWith(`${ADMIN_BASE}/`);

  if (isAdminEntry && loggedIn) {
    return NextResponse.redirect(new URL(`${ADMIN_BASE}/impersonate`, request.url));
  }
  if (isAdminArea && !isAdminEntry && !loggedIn) {
    return NextResponse.redirect(new URL(ADMIN_BASE, request.url));
  }

  // ✅ Protect customer routes: /user/*, /profile/*, /dashboard/*
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