// middleware.ts
// Only i18n handling — Auth checks run at page/layout level

import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  // 🎯 ONLY i18n — no auth check to avoid redirect loops
  // Auth checks are done in:
  //   - app/[locale]/dashboard/layout.tsx
  //   - app/[locale]/admin/layout.tsx
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
