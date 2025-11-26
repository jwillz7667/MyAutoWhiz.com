/**
 * MyAutoWhiz.com - Next.js Middleware
 * 
 * Handles:
 * - Authentication protection for dashboard routes
 * - Session refresh
 * - Redirects for authenticated/unauthenticated users
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/analysis',
  '/reports',
  '/settings',
  '/api/analysis',
  '/api/user',
];

// Routes only for unauthenticated users
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
];

// Public routes that don't need any auth check
const publicRoutes = [
  '/',
  '/pricing',
  '/features',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/api/webhooks',
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if it exists
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if current path is auth-only (login, signup, etc.)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && user) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    return NextResponse.redirect(
      new URL(redirect || '/dashboard', request.url)
    );
  }

  // Add user info to headers for API routes
  if (user && pathname.startsWith('/api/')) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email || '');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions (.svg, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};
