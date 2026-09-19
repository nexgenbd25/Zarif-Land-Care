// middleware.ts
// i18n + Auth protection

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

  // Session refresh
  const { supabaseResponse, user } = await updateSession(request);

  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const localePrefix = getLocalePrefix(pathname);

  // Route classification
  const isAdminLogin = pathWithoutLocale === '/admin/login';
  const isUserLogin = pathWithoutLocale === '/login';
  const isUserRegister = pathWithoutLocale === '/register';
  const isForgotPassword = pathWithoutLocale === '/forgot-password';

  const isAdminRoute =
    pathWithoutLocale.startsWith('/admin') && !isAdminLogin;
  const isUserDashboard =
    pathWithoutLocale === '/dashboard' ||
    pathWithoutLocale.startsWith('/dashboard/');

  const isAuthRoute =
    isUserLogin || isUserRegister || isForgotPassword || isAdminLogin;

  // 🎯 CRITICAL: Allow auth routes always (no redirect to break loop)
  if (isAuthRoute) {
    // Still refresh i18n
    const response = intlMiddleware(request);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });
    return response;
  }

  // Admin routes: require login
  if (isAdminRoute && !user) {
    const loginUrl = new URL(`${localePrefix}/admin/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User dashboard routes: require login
  if (isUserDashboard && !user) {
    const loginUrl = new URL(`${localePrefix}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Apply i18n
  const response = intlMiddleware(request);

  // Copy Supabase cookies
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};