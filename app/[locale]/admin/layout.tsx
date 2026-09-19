// app/[locale]/admin/layout.tsx
// Admin panel layout — Header/Footer ছাড়া
// কিন্তু /admin/login page এ AdminLayout ছাড়া render হবে

'use client';

import { usePathname } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const pathname = usePathname();

  // Login page হলে AdminLayout ছাড়া render করব
  const isLoginPage = pathname?.includes('/admin/login');

  return (
    <NextIntlClientProvider>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <AdminLayout locale={locale}>{children}</AdminLayout>
      )}
    </NextIntlClientProvider>
  );
}
