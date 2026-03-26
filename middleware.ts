import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

// Public routes that don't need auth session refresh
const PUBLIC_PATHS = [
  '/',
  '/firms',
  '/compare',
  '/discounts',
  '/leaderboard',
  '/pricing',
  '/blog',
  '/guide',
  '/faq',
  '/partner',
  '/contact',
  '/security',
  '/disclaimers',
];

function isPublicPath(pathname: string): boolean {
  // Exact match or starts with a public prefix (e.g. /firms/topstep, /blog/some-post)
  if (PUBLIC_PATHS.some(
    (p) => pathname === p || (p !== '/' && pathname.startsWith(p + '/'))
  )) {
    return true;
  }

  // SEO pages: /[slug]-alternatives and /[slug]-vs-[slug]
  if (pathname.endsWith('-alternatives') || /-vs-/.test(pathname)) {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  // Skip auth refresh for public pages — no session needed, saves a round-trip
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Refresh auth session before Server Components run
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/webhooks (webhook endpoints - no auth needed)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
