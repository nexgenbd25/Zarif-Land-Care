'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import DashboardLayout from './DashboardLayout';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export default function DashboardRootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const router = useRouter();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [status, setStatus] = useState<'checking' | 'ok' | 'redirect'>(
    'checking'
  );
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const supabase = createClient();

        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (error || !authUser) {
          setStatus('redirect');
          window.location.href = `${prefix}/login`;
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('id, first_name, last_name, username, email, role')
          .eq('id', authUser.id)
          .maybeSingle();

        if (cancelled) return;

        // Admin → redirect to admin dashboard
        if (profile?.role === 'admin') {
          setStatus('redirect');
          window.location.href = `${prefix}/admin/dashboard`;
          return;
        }

        setUser({
          id: authUser.id,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          username: profile?.username || '',
          email: profile?.email || authUser.email || '',
        });

        setStatus('ok');
      } catch (err) {
        console.error('Auth check error:', err);
        if (!cancelled) {
          setStatus('redirect');
          window.location.href = `${prefix}/login`;
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [prefix]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-[#1F7A3F] mx-auto mb-4"
          />
          <p className="text-sm text-[#6B7280]">
            {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'redirect' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <Loader2 size={40} className="animate-spin text-[#1F7A3F]" />
      </div>
    );
  }

  return (
    <DashboardLayout user={user} locale={locale}>
      {children}
    </DashboardLayout>
  );
}