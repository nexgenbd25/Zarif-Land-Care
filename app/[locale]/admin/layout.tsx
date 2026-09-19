// app/[locale]/admin/layout.tsx
// Admin panel layout — dynamic rendering

export const dynamic = 'force-dynamic';

import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';

export default function AdminRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <AdminLayoutWrapper locale={locale}>{children}</AdminLayoutWrapper>;
}
