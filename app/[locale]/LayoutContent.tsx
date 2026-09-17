'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.includes('/login') || pathname.includes('/register');

  return (
    <>
      {!isAuthPage && <Header />}

      <main className="flex-1">{children}</main>

      {!isAuthPage && <Footer />}
    </>
  );
}