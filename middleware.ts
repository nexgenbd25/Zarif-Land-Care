// middleware.ts
// Complete middleware: i18n + Supabase auth + route protection

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

function getLocalePrefix(pathname: string): string {
  if (pathname.startsWith('/en/') || pathname === '/en') return '/en';
  return '';
}

function getPathWithoutLocale(pathname: string): string {
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  if (pathname === '/en') return '/';
  return pathname;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Step 1: Supabase session refresh
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Step 2: Path info
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const localePrefix = getLocalePrefix(pathname);

  // Step 3: Route classification
  const isAdminLogin = pathWithoutLocale === '/admin/login';
  const isAdminRoute =
    pathWithoutLocale.startsWith('/admin') && !isAdminLogin;
  const isUserRoute = pathWithoutLocale.startsWith('/user');
  const isAuthRoute =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/register' ||
    pathWithoutLocale === '/forgot-password';

  // Step 4: Fetch role if logged in
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
      userRole = 'user';
    }
  }

  // ============================================
  // Step 5: Route Protection
  // ============================================

  // --- Admin Login (public, but redirect if already admin) ---
  if (isAdminLogin) {
    if (user && userRole === 'admin') {
      // Already logged in as admin → dashboard
      return NextResponse.redirect(
        new URL(`${localePrefix}/admin/dashboard`, request.url)
      );
    }
    // Allow access
  }

  // --- Admin Routes (protected) ---
  if (isAdminRoute) {
    // Not logged in → Admin login
    if (!user) {
      const loginUrl = new URL(`${localePrefix}/admin/login`, request.url);
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

  // --- User Routes (protected) ---
  if (isUserRoute) {
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

  // Step 6: i18n Middleware
  const response = intlMiddleware(request);

  // Copy Supabase cookies to final response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
