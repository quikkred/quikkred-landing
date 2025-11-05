import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only apply redirect logic to root path
  if (pathname !== '/') {
    return NextResponse.next();
  }

  // Check if user has already selected a language (via cookie)
  const languageSelected = request.cookies.get('languageSelected');

  // If language not selected and visiting home page, redirect to language selection
  if (!languageSelected) {
    // Redirect WITHOUT setting cookie yet - let the select-language page set it
    return NextResponse.redirect(new URL('/select-language', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - select-language (language selection page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|select-language).*)',
  ],
};
