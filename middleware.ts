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
// Helper: Get locale prefix
// ============================================
function getLocalePrefix(pathname: string): string {
  if (pathname.startsWith('/en/') || pathname === '/en') return '/en';
  return '';
}

// ============================================
// Helper: Get path without locale
// ============================================
function getPathWithoutLocale(pathname: string): string {
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  if (pathname === '/en') return '/';
  return pathname;
}

// ============================================
// Main Middleware
// ============================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Step 1: Supabase session refresh
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Step 2: Path info
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const localePrefix = getLocalePrefix(pathname);

  // Step 3: Route classification
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isUserRoute = pathWithoutLocale.startsWith('/user');
  const isAuthRoute =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/register' ||
    pathWithoutLocale === '/forgot-password';

  // Step 4: Fetch role if logged in (but handle users table not existing yet)
  let userRole: string | null = null;
  if (user) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      userRole = profile?.role || 'user';
    } catch {
      // users table না থাকলে বা error হলে default user
      userRole = 'user';
    }
  }

  // ============================================
  // Step 5: Route Protection
  // ============================================

  // --- Admin Routes ---
  if (isAdminRoute && !pathWithoutLocale.startsWith('/admin/login')) {
    // Not logged in → Login
    if (!user) {
      const loginUrl = new URL(`${localePrefix}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'login-required');
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not admin → User dashboard
    if (userRole !== 'admin') {
      const userDash = new URL(`${localePrefix}/user/dashboard`, request.url);
      userDash.searchParams.set('error', 'admin-only');
      return NextResponse.redirect(userDash);
    }
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
  }

  // --- Auth Routes (login, register, forgot-password) ---
  if (isAuthRoute && user) {
    const dest =
      userRole === 'admin'
        ? `${localePrefix}/admin/dashboard`
        : `${localePrefix}/user/dashboard`;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ============================================
  // Step 6: i18n Middleware
  // ============================================
  const response = intlMiddleware(request);

  // Copy Supabase cookies to final response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

// ============================================
// Matcher Config
// ============================================
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
