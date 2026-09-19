// components/admin/AdminLayoutWrapper.tsx
// Decides whether to show AdminLayout based on current page

'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from './AdminLayout';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  locale: string;
}

export default function AdminLayoutWrapper({
  children,
  locale,
}: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}
