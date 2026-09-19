'use client';

import { useLocale } from 'next-intl';
import { FileText } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KhatianApprovedPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
  }, [router, isBn, locale]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F8FAF9]">
        <p className="text-sm text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F8FAF9] flex items-center justify-center mb-4">
            <FileText size={28} className="text-[#9CA3AF]" />
          </div>
          <h1 className="text-lg font-bold text-[#1F2937] mb-2">
            {isBn ? 'খতিয়ান — অনুমোদিত' : 'Khatian — Approved'}
          </h1>
          <p className="text-sm text-[#6B7280]">
            {isBn ? 'শীঘ্রই আসছে...' : 'Coming soon...'}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
