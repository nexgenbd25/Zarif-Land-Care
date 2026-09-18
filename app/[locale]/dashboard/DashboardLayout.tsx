'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  FileText,
  ChevronDown,
  Ticket,
  Shield,
  LogOut,
  Circle,
  Mail,
  User,
  Lock,
} from 'lucide-react';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

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
  const [isDeedsOpen, setIsDeedsOpen] = useState(
    pathname.includes('/dashboard/deeds')
  );
  const [isKhatianOpen, setIsKhatianOpen] = useState(
    pathname.includes('/dashboard/khatian')
  );

  const profileRef = useRef<HTMLDivElement>(null);

  // 🎯 Full Name
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const displayName = fullName || user.username || 'User';
  const avatarLetter = (user.firstName || user.username || 'U')
    .charAt(0)
    .toUpperCase();

  // 🎯 Username (lowercase, space chara)
  const displayUsername = (user.username || '')
    .toLowerCase()
    .replace(/\s+/g, '');

  // 🎯 Email (lowercase)
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

  const content = {
    dashboard_bn: 'ড্যাশবোর্ড',
    dashboard_en: 'Dashboard',
    deeds_bn: 'দলিল',
    deeds_en: 'Deeds',
    newDeed_bn: 'নতুন দলিল',
    newDeed_en: 'New Deed',
    approvedDeed_bn: 'অনুমোদিত দলিল',
    approvedDeed_en: 'Approved Deed List',
    pendingDeed_bn: 'অপেক্ষমাণ দলিল',
    pendingDeed_en: 'Pending Deed List',
    khatian_bn: 'খতিয়ান',
    khatian_en: 'Khatian',
    newKhatian_bn: 'নতুন খতিয়ান',
    newKhatian_en: 'New Khatian',
    approvedKhatian_bn: 'অনুমোদিত খতিয়ান',
    approvedKhatian_en: 'Approved Khatian List',
    pendingKhatian_bn: 'অপেক্ষমাণ খতিয়ান',
    pendingKhatian_en: 'Pending Khatian List',
    support_bn: 'সাপোর্ট টিকেট',
    support_en: 'Support Ticket',
    security_bn: '২এফএ সিকিউরিটি',
    security_en: '2FA Security',
    logout_bn: 'লগআউট',
    logout_en: 'Log Out',
    myProfile_bn: 'আমার প্রোফাইল',
    myProfile_en: 'My Profile',
    changePassword_bn: 'পাসওয়ার্ড পরিবর্তন',
    changePassword_en: 'Change Password',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const menuItems = [
    {
      type: 'link' as const,
      icon: Home,
      label: t('dashboard'),
      href: `/${isBn ? '' : locale + '/'}dashboard`,
      active: pathname === `/${isBn ? '' : locale + '/'}dashboard`,
    },
    {
      type: 'dropdown' as const,
      icon: FileText,
      label: t('deeds'),
      isOpen: isDeedsOpen,
      onToggle: () => setIsDeedsOpen(!isDeedsOpen),
      active: pathname.includes('/dashboard/deeds'),
      children: [
        {
          label: t('newDeed'),
          href: `/${isBn ? '' : locale + '/'}dashboard/deeds/new`,
        },
        {
          label: t('approvedDeed'),
          href: `/${isBn ? '' : locale + '/'}dashboard/deeds/approved`,
        },
        {
          label: t('pendingDeed'),
          href: `/${isBn ? '' : locale + '/'}dashboard/deeds/pending`,
        },
      ],
    },
    {
      type: 'dropdown' as const,
      icon: FileText,
      label: t('khatian'),
      isOpen: isKhatianOpen,
      onToggle: () => setIsKhatianOpen(!isKhatianOpen),
      active: pathname.includes('/dashboard/khatian'),
      children: [
        {
          label: t('newKhatian'),
          href: `/${isBn ? '' : locale + '/'}dashboard/khatian/new`,
        },
        {
          label: t('approvedKhatian'),
          href: `/${isBn ? '' : locale + '/'}dashboard/khatian/approved`,
        },
        {
          label: t('pendingKhatian'),
          href: `/${isBn ? '' : locale + '/'}dashboard/khatian/pending`,
        },
      ],
    },
    {
      type: 'link' as const,
      icon: Ticket,
      label: t('support'),
      href: `/${isBn ? '' : locale + '/'}dashboard/support`,
      active: pathname.includes('/dashboard/support'),
    },
    {
      type: 'link' as const,
      icon: Shield,
      label: t('security'),
      href: `/${isBn ? '' : locale + '/'}dashboard/security`,
      active: pathname.includes('/dashboard/security'),
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <Link
          href={`/${isBn ? '' : locale}`}
          className="flex items-center justify-center group"
          onClick={() => setIsSidebarOpen(false)}
        >
          <Image
            src={LOGO_URL}
            alt="Zarif Landcare Center"
            width={180}
            height={54}
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </Link>
      </div>

      {/* ===== User Card: Full Name + Username + Email ===== */}
      <div className="px-4 py-5">
        <div className="relative rounded-2xl border-2 border-dashed border-[#22C55E]/40 bg-[#1F7A3F]/10 p-4 text-center">
          {/* Avatar */}
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center shadow-lg mb-3">
            <span className="text-white text-xl font-bold uppercase">
              {avatarLetter}
            </span>
          </div>

          {/* 🎯 Line 1: Full Name */}
          <p className="text-white font-bold text-sm text-bangla-safe break-words leading-tight">
            {displayName}
          </p>

          {/* 🎯 Line 2: Username (register er, no @, lowercase) */}
          <p className="text-[#22C55E] text-[11px] font-medium mt-1 break-all">
            {displayUsername}
          </p>

          {/* 🎯 Line 3: Email (lowercase) */}
          <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-start justify-center gap-1.5">
            <Mail size={11} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-[10px] break-all text-left leading-tight">
              {displayEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            if (item.type === 'link') {
              return (
                <li key={index}>
                  <Link
                    href={item.href!}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-bangla-safe ${
                      item.active
                        ? 'bg-[#1F7A3F] text-white shadow-md shadow-[#1F7A3F]/30'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            }

            if (item.type === 'dropdown') {
              return (
                <li key={index}>
                  <button
                    onClick={item.onToggle}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-bangla-safe ${
                      item.active
                        ? 'bg-[#1F7A3F]/20 text-white'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        item.isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {item.isOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden ml-4 mt-1 space-y-1"
                      >
                        {item.children?.map((child, i) => {
                          const childActive = pathname === child.href;
                          return (
                            <li key={i}>
                              <Link
                                href={child.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all text-bangla-safe ${
                                  childActive
                                    ? 'bg-[#1F7A3F]/20 text-[#22C55E]'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-[#22C55E]'
                                }`}
                              >
                                <Circle
                                  size={6}
                                  className="fill-current flex-shrink-0"
                                />
                                <span>{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            return null;
          })}
        </ul>

        {/* Logout */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 text-bangla-safe"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-center text-gray-400 text-bangla-safe">
          © {new Date().getFullYear()} Zarif Land Care
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF9] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-gradient-to-b from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] text-white fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 w-[80%] max-w-[320px] bg-gradient-to-b from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] text-white z-50 flex flex-col overflow-y-auto"
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>

              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] hover:bg-[#1F7A3F]/10 hover:border-[#1F7A3F]/30 transition-all"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
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
                  <span className="hidden sm:inline text-sm font-semibold text-[#1F2937] text-bangla-safe max-w-[140px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#6B7280] transition-transform duration-300 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 z-[100] bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden"
                    >
                      {/* User Info Header — 3 line */}
                      <div className="px-4 py-3 bg-[#F8FAF9] border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold uppercase">
                              {avatarLetter}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            {/* Line 1: Full Name */}
                            <p className="text-sm font-bold text-[#1F2937] text-bangla-safe truncate">
                              {displayName}
                            </p>
                            {/* Line 2: Username */}
                            <p className="text-[10px] text-[#22C55E] font-medium truncate">
                              {displayUsername}
                            </p>
                            {/* Line 3: Email */}
                            <p className="text-[10px] text-[#6B7280] truncate">
                              {displayEmail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
