// components/admin/AdminLayout.tsx
// Admin layout shell — Sidebar + Topbar + Content

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Lock,
  Shield,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function AdminLayout({ children, locale }: AdminLayoutProps) {
  const pathname = usePathname();
  const isBn = locale === 'bn';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{
    email: string;
    username: string;
  } | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Fetch admin info from Supabase
    setAdminInfo({
      email: 'admin@zariflandcare.com',
      username: 'admin',
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isSidebarOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen]);

  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);

  const handleLogout = useCallback(async () => {
    // TODO: Supabase sign out
    if (typeof window !== 'undefined') {
      window.location.href = `/${isBn ? '' : locale + '/'}login`;
    }
  }, [isBn, locale]);

  const avatarLetter = (adminInfo?.username || 'A').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] text-white z-40">
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      {/* ===== Mobile Sidebar ===== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleCloseSidebar}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 w-[80%] max-w-[320px] bg-gradient-to-b from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] text-white z-[9999] flex flex-col overflow-hidden shadow-2xl"
            >
              <button
                onClick={handleCloseSidebar}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>

              <AdminSidebar onLogout={handleLogout} onClose={handleCloseSidebar} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== Main Content ===== */}
      <div className="flex flex-col min-h-screen lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenSidebar}
                className="lg:hidden w-10 h-10 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] hover:bg-[#1F7A3F]/10 hover:border-[#1F7A3F]/30 transition-all"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-2">
                <Shield size={20} className="text-[#1F7A3F]" />
                <span className="text-sm font-bold text-[#1F2937] text-bangla-safe hidden sm:inline">
                  {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] hover:border-[#1F7A3F]/30 hover:bg-[#1F7A3F]/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold uppercase">
                      {avatarLetter}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-[#1F2937] text-bangla-safe max-w-[120px] truncate">
                    {adminInfo?.username || 'admin'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#6B7280] transition-transform duration-300 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 z-[100] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-[#F8FAF9] border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold uppercase">
                              {avatarLetter}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#1F2937] truncate">
                              {adminInfo?.username || 'admin'}
                            </p>
                            <p className="text-[10px] text-[#6B7280] truncate">
                              {adminInfo?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href={`/${isBn ? '' : locale + '/'}admin/profile`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1F2937] hover:bg-[#1F7A3F]/5 hover:text-[#1F7A3F] transition-colors text-bangla-safe"
                        >
                          <User size={16} className="text-[#1F7A3F]" />
                          <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
                        </Link>

                        <Link
                          href={`/${isBn ? '' : locale + '/'}admin/settings/general`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1F2937] hover:bg-[#1F7A3F]/5 hover:text-[#1F7A3F] transition-colors text-bangla-safe"
                        >
                          <Lock size={16} className="text-[#1F7A3F]" />
                          <span>{isBn ? 'সেটিংস' : 'Settings'}</span>
                        </Link>

                        <div className="my-1 border-t border-[#F3F4F6]" />

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-bangla-safe"
                        >
                          <LogOut size={16} />
                          <span>{isBn ? 'লগ আউট' : 'Logout'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
