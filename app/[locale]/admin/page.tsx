// app/[locale]/admin/page.tsx
// Redirect /admin → /admin/dashboard

import { redirect } from 'next/navigation';

export default function AdminRootPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const prefix = locale === 'bn' ? '' : `/${locale}`;
  redirect(`${prefix}/admin/dashboard`);
}
