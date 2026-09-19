// middleware.ts
// Only i18n + minimal auth check
// Role check is done in admin layout, not here

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

  // Session refresh ONLY (no role query!)
  const { supabaseResponse, user } = await updateSession(request);

  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const localePrefix = getLocalePrefix(pathname);

  // Routes that require login (but NOT role — role checked in layout)
  const isAdminRoute =
    pathWithoutLocale.startsWith('/admin') &&
    pathWithoutLocale !== '/admin/login';
  const isUserRoute = pathWithoutLocale.startsWith('/user');
  const isAuthRoute =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/register' ||
    pathWithoutLocale === '/forgot-password';

  // Admin routes: require login (role check happens in admin layout)
  if (isAdminRoute && !user) {
    const loginUrl = new URL(`${localePrefix}/admin/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User routes: require login
  if (isUserRoute && !user) {
    const loginUrl = new URL(`${localePrefix}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes: if already logged in, don't show login/register
  if (isAuthRoute && user) {
    // Let admin layout handle redirect logic
    return NextResponse.redirect(
      new URL(`${localePrefix}/admin/dashboard`, request.url)
    );
  }

  // i18n
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