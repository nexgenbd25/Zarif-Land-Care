// app/[locale]/admin/layout.tsx
// Admin layout with role check

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;
  const isLoginPage = pathname?.includes('/admin/login');

  const [status, setStatus] = useState<'checking' | 'ok' | 'denied'>('checking');

  useEffect(() => {
    // Skip check on login page
    if (isLoginPage) {
      setStatus('ok');
      return;
    }

    let cancelled = false;

    async function checkAdmin() {
      try {
        const supabase = createClient();

        // Get user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) {
            router.push(`${prefix}/admin/login`);
          }
          return;
        }

        // Get role
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (!cancelled) {
          if (profile?.role === 'admin') {
            setStatus('ok');
          } else {
            setStatus('denied');
            setTimeout(() => {
              router.push(`${prefix}/admin/login`);
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Admin check error:', err);
        if (!cancelled) {
          router.push(`${prefix}/admin/login`);
        }
      }
    }

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [pathname, isLoginPage, router, prefix]);

  // Login page: render directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Checking
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#22C55E] mx-auto mb-4" />
          <p className="text-gray-400 text-sm">
            {isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying access...'}
          </p>
        </div>
      </div>
    );
  }

  // Denied
  if (status === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <ShieldAlert size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {isBn ? 'অ্যাক্সেস অস্বীকৃত' : 'Access Denied'}
          </h2>
          <p className="text-red-300 text-sm">
            {isBn
              ? 'আপনি অ্যাডমিন নন। লগইন পেজে ফিরে যাচ্ছে...'
              : 'You are not an admin. Redirecting to login...'}
          </p>
        </div>
      </div>
    );
  }

  // OK — render admin panel
  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}