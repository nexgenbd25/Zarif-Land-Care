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
} from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
  };
  onLogout: () => void;
}

export default function DashboardLayout({
  children,
  user,
  onLogout,
}: DashboardLayoutProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isBn = locale === 'bn';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const displayName = fullName || user.username || 'User';
  const avatarLetter = (user.firstName || user.username || 'U')
    .charAt(0)
    .toUpperCase();

  const displayUsername = (user.username || '')
    .toLowerCase()
    .replace(/\s+/g, '');
  const displayEmail = (user.email || '').toLowerCase();

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
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollBarWidth}px`;

      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
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
  const handleLogout = useCallback(() => onLogout(), [onLogout]);

  const content = {
    myProfile_bn: 'আমার প্রোফাইল',
    myProfile_en: 'My Profile',
    changePassword_bn: 'পাসওয়ার্ড পরিবর্তন',
    changePassword_en: 'Change Password',
    logout_bn: 'লগআউট',
    logout_en: 'Log Out',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  return (
    <div
      className="min-h-screen bg-[#F8FAF9]"
      style={{
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className="hidden lg:flex lg:flex-col sidebar-fixed bg-gradient-to-b from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] text-white z-40"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform',
          contain: 'layout style paint',
          width: '18rem',
          maxWidth: '18rem',
        }}
      >
        <DashboardSidebar user={user} onLogout={handleLogout} />
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
              style={{
                touchAction: 'none',
                overscrollBehavior: 'none',
              }}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 w-[80%] max-w-[320px] bg-gradient-to-b from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] text-white z-[9999] flex flex-col overflow-hidden shadow-2xl"
              style={{
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
              }}
            >
              <button
                onClick={handleCloseSidebar}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>

              <DashboardSidebar
                user={user}
                onLogout={handleLogout}
                onClose={handleCloseSidebar}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== Main Content — FIXED ===== */}
      <div
        className="lg:ml-72 flex flex-col min-h-screen w-full"
        style={{
          minWidth: 0,
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm w-full">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <button
              onClick={handleOpenSidebar}
              className="lg:hidden w-10 h-10 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] hover:bg-[#1F7A3F]/10 hover:border-[#1F7A3F]/30 transition-all shrink-0"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto min-w-0">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] hover:border-[#1F7A3F]/30 hover:bg-[#1F7A3F]/5 transition-all"
                  aria-label="Open profile menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold uppercase">
                      {avatarLetter}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-[#1F2937] text-bangla-safe max-w-[120px] lg:max-w-[140px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#6B7280] transition-transform duration-300 shrink-0 ${
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
                      className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] z-[100] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-[#F8FAF9] border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold uppercase">
                              {avatarLetter}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#1F2937] text-bangla-safe truncate">
                              {displayName}
                            </p>
                            <p className="text-[10px] text-[#22C55E] font-medium truncate">
                              {displayUsername}
                            </p>
                            <p className="text-[10px] text-[#6B7280] truncate">
                              {displayEmail}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href={`/${isBn ? '' : locale + '/'}dashboard/profile`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1F2937] hover:bg-[#1F7A3F]/5 hover:text-[#1F7A3F] transition-colors text-bangla-safe"
                        >
                          <User size={16} className="text-[#1F7A3F]" />
                          <span>{t('myProfile')}</span>
                        </Link>

                        <Link
                          href={`/${isBn ? '' : locale + '/'}dashboard/change-password`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#1F2937] hover:bg-[#1F7A3F]/5 hover:text-[#1F7A3F] transition-colors text-bangla-safe"
                        >
                          <Lock size={16} className="text-[#1F7A3F]" />
                          <span>{t('changePassword')}</span>
                        </Link>

                        <div className="my-1 border-t border-[#F3F4F6]" />

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-bangla-safe"
                        >
                          <LogOut size={16} />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* ===== Main Content Area ===== */}
        <main
          className="flex-1 p-3 sm:p-4 lg:p-6 w-full"
          style={{
            minWidth: 0,
            maxWidth: '100%',
            overflowX: 'hidden',
            overflowAnchor: 'none',
          }}
        >
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}