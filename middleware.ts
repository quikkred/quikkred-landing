import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user has already selected a language (via cookie)
  const languageSelected = request.cookies.get('languageSelected');

  // If language not selected, set English as default (no redirect needed)
  if (!languageSelected) {
    const response = NextResponse.next();
    // Set cookie to indicate language has been set (default: English)
    response.cookies.set('languageSelected', 'true', {
      path: '/',
      maxAge: 31536000, // 1 year
    });
    return response;
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
