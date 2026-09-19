// app/[locale]/admin/layout.tsx
// Admin panel layout — NO Header/Footer

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import AdminLayout from '@/components/admin/AdminLayout';

export default async function AdminRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AdminLayout locale={locale}>{children}</AdminLayout>
    </NextIntlClientProvider>
  );
}
