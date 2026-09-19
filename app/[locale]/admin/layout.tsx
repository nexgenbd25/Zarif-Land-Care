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

  const [status, setStatus] = useState<'checking' | 'ok' | 'denied'>(
    'checking'
  );

  useEffect(() => {
    // 🎯 Login page এ check skip
    if (isLoginPage) {
      setStatus('ok');
      return;
    }

    let cancelled = false;

    async function checkAdmin() {
      try {
        const supabase = createClient();

        // 🎯 Get user with retry logic (session propagation)
        let authUser = null;
        for (let i = 0; i < 3; i++) {
          const { data, error } = await supabase.auth.getUser();
          if (!cancelled && data?.user && !error) {
            authUser = data.user;
            break;
          }
          // Wait 300ms before retry
          if (i < 2) await new Promise((r) => setTimeout(r, 300));
        }

        if (cancelled) return;

        if (!authUser) {
          console.log('No auth user, redirect to admin login');
          router.replace(`${prefix}/admin/login`);
          return;
        }

        console.log('Auth user found:', authUser.email);

        // Get role from users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .maybeSingle();

        if (cancelled) return;

        console.log('Profile:', profile, 'Error:', profileError);

        if (profile?.role === 'admin') {
          setStatus('ok');
        } else {
          console.log('Not admin, access denied');
          setStatus('denied');
          setTimeout(() => {
            router.replace(`${prefix}/admin/login`);
          }, 2500);
        }
      } catch (err) {
        console.error('Admin check error:', err);
        if (!cancelled) {
          router.replace(`${prefix}/admin/login`);
        }
      }
    }

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [pathname, isLoginPage, router, prefix]);

  // 🎯 Login page: render children directly (no auth check)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 🎯 Checking state
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D]">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-[#22C55E] mx-auto mb-4"
          />
          <p className="text-gray-400 text-sm text-bangla-safe">
            {isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying access...'}
          </p>
        </div>
      </div>
    );
  }

  // 🎯 Access denied
  if (status === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <ShieldAlert size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2 text-bangla-safe">
            {isBn ? 'অ্যাক্সেস অস্বীকৃত' : 'Access Denied'}
          </h2>
          <p className="text-red-300 text-sm text-bangla-safe">
            {isBn
              ? 'আপনি অ্যাডমিন নন। লগইন পেজে ফিরে যাচ্ছে...'
              : 'You are not an admin. Redirecting to login...'}
          </p>
        </div>
      </div>
    );
  }

  // 🎯 Admin verified — render with AdminLayout
  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}
