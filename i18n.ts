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
export default getRequestConfig(async ({ locale }) => {
  // ভাষা সাপোর্টেড কিনা চেক
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});