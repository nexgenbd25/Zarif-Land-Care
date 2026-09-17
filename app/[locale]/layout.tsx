import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Anek_Bangla, Inter } from 'next/font/google';
import { locales, type Locale } from '@/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-hind',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
    bn: 'নির্ভুল দলিল প্রস্তুত এবং রেজিস্ট্রেশনের পূর্ণ সহায়তার জন্য একটি নির্ভরযোগ্য প্রতিষ্ঠান।',
    en: 'A trusted institution for accurate deed preparation and complete registration support.',
  };

  return {
    title: titles[locale] || titles.bn,
    description: descriptions[locale] || descriptions.bn,
    alternates: {
      canonical: locale === 'bn' ? '/' : '/en',
      languages: {
        'bn-BD': '/',
        'en-US': '/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div
        lang={locale}
        className={`${anekBangla.variable} ${inter.variable} min-h-screen flex flex-col bg-white ${
          locale === 'bn' ? 'font-bangla' : 'font-english'
        }`}
        style={{
          fontFamily:
            locale === 'bn'
              ? 'var(--font-hind), "Anek Bangla", "Hind Siliguri", "Noto Sans Bengali", sans-serif'
              : 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
