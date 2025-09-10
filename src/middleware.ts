import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function that runs before withAuth
function handleRedirects(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Redirect /products to /product
  if (path === '/products') {
    return NextResponse.redirect(new URL('/product', req.url));
  }

  return null;
}

export default withAuth(
  function middleware(req: NextRequest) {
    // Check for redirects first
    const redirectResponse = handleRedirects(req);
    if (redirectResponse) return redirectResponse;
    const token = (req as any).nextauth?.token;
    const path = req.nextUrl.pathname;
    
    // Debug logging
    console.log('Middleware Debug:', {
      path,
      token: {
        ...token,
        role: token?.role,
      },
      hasToken: !!token,
      isAdminRoute: path.startsWith('/admin') || path.startsWith('/api/products/featured'),
      timestamp: new Date().toISOString()
    });

    // Admin routes check
    if (path.startsWith('/admin')) {
      // Make sure we have a token and it has the ADMIN role
      if (!token || token.role !== 'ADMIN') {
        console.log('Access denied: Not an admin');
        if (path.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ message: 'Unauthorized' }),
            { status: 403, headers: { 'content-type': 'application/json' }}
          );
        }
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Always check the token exists for protected routes
        return !!token;
      },
    },
  },
);

// Configure protected routes and redirects
export const config = {
  matcher: [
    '/products',  
    '/admin/:path*', 
    '/account/:path*', 
    '/checkout'
  ],
};
