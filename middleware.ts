import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

// ============================================
// i18n Middleware তৈরি
// ============================================
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // URL এ সবসময় ভাষা থাকবে (যেমন: /bn, /en)
});

// ============================================
// Protected Routes (Login ছাড়া ঢোকা যাবে না)
// ============================================
const protectedPaths = ['/dashboard', '/admin'];

// ============================================
// Auth Routes (Login করা থাকলে ঢোকা যাবে না)
// ============================================
const authPaths = ['/login', '/signup', '/forgot-password'];

// ============================================
// Main Middleware
// ============================================
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ১. ভাষা রাউটিং (i18n)
  const intlResponse = intlMiddleware(request);

  // ২. ভাষা ছাড়া URL হলে ডিফল্ট ভাষায় রিডাইরেক্ট
  // (next-intl অটো করে, তবে চেক করা ভালো)

  // ৩. Protected Routes চেক
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.includes(path)
  );

  const isAuthPath = authPaths.some((path) => pathname.includes(path));

  // আপাতত সেশন চেক বন্ধ রাখছি (পরে Supabase Client যোগ করলে চালু করব)
  // ভবিষ্যতে এখানে Supabase Session চেক হবে

  return intlResponse;
}

// ============================================
// কোন রুটে Middleware চলবে
// ============================================
export const config = {
  matcher: [
    // সব রুটে চলবে, তবে নিচেরগুলো বাদ
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};