// app/[locale]/admin/page.tsx
// Redirect /admin → /admin/dashboard

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    router.replace(`${prefix}/admin/dashboard`);
  }, [router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
      <Loader2 size={40} className="animate-spin text-[#1F7A3F]" />
    </div>
  );
}
