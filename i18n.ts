import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// ============================================
// সাপোর্টেড ভাষা
// ============================================
export const locales = ['bn', 'en'] as const;
export const defaultLocale = 'bn';

// ============================================
// Type Definition
// ============================================
export type Locale = (typeof locales)[number];

// ============================================
// অনুবাদ ফাইল লোড
// ============================================
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // যদি locale না থাকে, ডিফল্ট বাংলা ব্যবহার করো
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});