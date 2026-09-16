import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// ============================================
// i18n Middleware
// ============================================
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  // ⚠️ এটিই মূল পরিবর্তন
  // 'as-needed' মানে: ডিফল্ট ভাষায় (bn) /bn থাকবে না
  // শুধু ইংরেজিতে /en থাকবে
  localePrefix: 'as-needed',
});

// ============================================
// Main Middleware
// ============================================
export async function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

// ============================================
// কোন রুটে Middleware চলবে
// ============================================
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};