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
  // নতুন API: requestLocale (deprecated locale এর বদলে)
  const locale = await requestLocale;

  // ভাষা সাপোর্টেড কিনা চেক
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});