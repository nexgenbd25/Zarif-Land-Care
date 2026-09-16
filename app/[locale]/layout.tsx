import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

// ============================================
// Static Params (বাংলা + ইংরেজি প্রি-রেন্ডার)
// ============================================
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// ============================================
// Metadata (ভাষা অনুযায়ী)
// ============================================
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const titles: Record<string, string> = {
    bn: 'জারিফ ল্যান্ডকেয়ার সেন্টার - নির্ভরযোগ্য দলিল সেবা',
    en: 'Zarif Landcare Center - Reliable Deed Service',
  };

  const descriptions: Record<string, string> = {
    bn: 'নির্বিঘ্ন দলিল প্রস্তুত এবং রেজিস্ট্রেশনের পূর্ণ সহায়তার জন্য একটি নির্ভরযোগ্য প্রতিষ্ঠান।',
    en: 'A trusted institution for seamless deed preparation and complete registration support.',
  };

  return {
    title: titles[locale] || titles.bn,
    description: descriptions[locale] || descriptions.bn,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'bn-BD': '/bn',
        'en-US': '/en',
      },
    },
  };
}

// ============================================
// Locale Layout
// ============================================
export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ভাষা ভ্যালিডেট করুন
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // অনুবাদ মেসেজ লোড করুন
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} className="min-h-screen">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}