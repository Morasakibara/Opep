import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect legacy /agencies routes to /companies
  if (pathname.startsWith('/agencies')) {
    const newPath = pathname.replace(/^\/agencies/, '/companies');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/agencies/:path*',
};
