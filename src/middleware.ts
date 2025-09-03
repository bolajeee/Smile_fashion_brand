import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest) {
    const token = (req as any).nextauth?.token;
    const isAdmin = token?.role === 'ADMIN';
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith('/admin') || path === '/add-product') {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Protected routes for all authenticated users
    if (path.startsWith('/account') || path === '/checkout') {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// Configure protected routes
export const config = {
  matcher: ['/admin/:path*', '/add-product', '/account/:path*', '/checkout'],
};
