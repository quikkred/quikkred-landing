import { NextRequest, NextResponse } from "next/server";

function isLoggedIn(request: NextRequest) {
  // NextAuth JWT cookie names (dev vs prod)
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  return Boolean(token);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = isLoggedIn(request);

  // -------------------------
  // 1) Language cookie logic
  // -------------------------
  // const languageSelected = request.cookies.get("languageSelected");

  // if (!languageSelected) {
  //   const res = NextResponse.next();
  //   res.cookies.set("languageSelected", "true", {
  //     path: "/",
  //     maxAge: 31536000,
  //   });
  //   return res;
  // }

  // -------------------------
  // 2) Auth redirects
  // -------------------------

  // ✅ If user is already logged in and tries to open /login => send to /user
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
    // optional: store callback
    // loginUrl.searchParams.set("callbackUrl", pathname);
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
