import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Temporary no-op middleware to avoid Next.js startup errors.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};
