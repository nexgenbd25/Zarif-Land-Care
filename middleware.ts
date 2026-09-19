// middleware.ts
// Complete middleware: i18n + Supabase auth + route protection

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { updateSession } from './lib/supabase/middleware';

// ============================================
// i18n Middleware
// ============================================
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// ============================================
// Helper: Get locale path prefix
// ============================================
function getLocalePrefix(pathname: string): string {
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return '/en';
  }
  return '';
}

// ============================================
// Helper: Extract path without locale
// ============================================
function getPathWithoutLocale(pathname: string): string {
  if (pathname.startsWith('/en/')) {
    return pathname.slice(3);
  }
  if (pathname === '/en') {
    return '/';
  }
  return pathname;
}

// ============================================
// Helper: Extract locale
// ============================================
function getLocale(pathname: string): string {
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }
  return 'bn';
}

// ============================================
// Main Middleware
// ============================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // Step 1: Supabase Session Refresh
  // ============================================
  const { supabaseResponse, user } = await updateSession(request);

  // ============================================
  // Step 2: Extract path info
  // ============================================
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const localePrefix = getLocalePrefix(pathname);
  const locale = getLocale(pathname);

  // ============================================
  // Step 3: Route Classification
  // ============================================
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isUserRoute = pathWithoutLocale.startsWith('/user');
  const isAuthRoute =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/register' ||
    pathWithoutLocale === '/forgot-password';

  // ============================================
  // Step 4: Fetch user role (if logged in)
  // ============================================
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabaseResponse // ekhane supabase client
      ? await (await import('@/lib/supabase/server')).createClient()
          .then((sb) =>
            sb
              .from('users')
              .select('role')
              .eq('id', user.id)
              .single()
          )
      : { data: null };

    userRole = profile?.role || 'user';
  }

  // ============================================
  // Step 5: Route Protection Logic
  // ============================================

  // --- Admin Routes ---
  if (isAdminRoute) {
    // Not logged in → Login
    if (!user) {
      const loginUrl = new URL(`${localePrefix}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'login-required');
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not admin → User dashboard
    if (userRole !== 'admin') {
      const userDashUrl = new URL(
        `${localePrefix}/user/dashboard`,
        request.url
      );
      userDashUrl.searchParams.set('error', 'admin-only');
      return NextResponse.redirect(userDashUrl);
    }

    // ✅ Admin → allow
  }

  // --- User Routes ---
  if (isUserRoute) {
    // Not logged in → Login
    if (!user) {
      const loginUrl = new URL(`${localePrefix}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'login-required');
      return NextResponse.redirect(loginUrl);
    }

    // ✅ Logged in → allow
  }

  // --- Auth Routes (login, register) ---
  if (isAuthRoute) {
    // Already logged in → Redirect to their dashboard
    if (user) {
      const redirectUrl =
        userRole === 'admin'
          ? `${localePrefix}/admin/dashboard`
          : `${localePrefix}/user/dashboard`;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // ✅ Not logged in → allow
  }

  // ============================================
  // Step 6: i18n Middleware
  // ============================================
  const response = intlMiddleware(request);

  // Supabase cookies copy করুন
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      ...cookie,
      // preserve options
    });
  });

  return response;
}

// ============================================
// Matcher Config
// ============================================
export const config = {
  matcher: [
    // সব route match করুন, but skip:
    // - api routes
    // - _next/static
    // - _next/image
    // - favicon
    // - static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
