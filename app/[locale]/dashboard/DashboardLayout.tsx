'use client';

import { useState, useEffect } from 'react';
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
  Bell,
  Mail,
} from 'lucide-react';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
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
  const [isDeedsOpen, setIsDeedsOpen] = useState(
    pathname.includes('/dashboard/deeds')
  );
  const [isKhatianOpen, setIsKhatianOpen] = useState(
    pathname.includes('/dashboard/khatian')
  );

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
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  // 🎯 Dynamic Page Title
  const getPageTitle = (): string => {
    const base = isBn ? '' : `/${locale}`;

    // Dashboard
    if (pathname === `${base}/dashboard` || pathname === '/dashboard') {
      return t('dashboard');
    }

    // Deeds
    if (pathname.includes('/dashboard/deeds/new')) return t('newDeed');
    if (pathname.includes('/dashboard/deeds/approved'))
      return t('approvedDeed');
    if (pathname.includes('/dashboard/deeds/pending')) return t('pendingDeed');
    if (pathname.includes('/dashboard/deeds')) return t('deeds');

    // Khatian
    if (pathname.includes('/dashboard/khatian/new')) return t('newKhatian');
    if (pathname.includes('/dashboard/khatian/approved'))
      return t('approvedKhatian');
    if (pathname.includes('/dashboard/khatian/pending'))
      return t('pendingKhatian');
    if (pathname.includes('/dashboard/khatian')) return t('khatian');

    // Support
    if (pathname.includes('/dashboard/support')) return t('support');

    // Security
    if (pathname.includes('/dashboard/security')) return t('security');

    return t('dashboard');
  };

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

      {/* User Card */}
      <div className="px-4 py-5">
        <div className="relative rounded-2xl border-2 border-dashed border-[#22C55E]/40 bg-[#1F7A3F]/10 p-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center shadow-lg mb-3">
            <span className="text-white text-xl font-bold uppercase">
              {user.username.charAt(0)}
            </span>
          </div>

          <p className="text-white font-bold text-sm text-bangla-safe break-words leading-tight">
            {user.username}
          </p>

          <p className="text-[#22C55E] text-[11px] font-medium mt-0.5 break-all">
            @{user.username}
          </p>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-start justify-center gap-1.5">
            <Mail size={11} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-[10px] break-all text-left leading-tight">
              {user.email}
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

            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1 flex-1 lg:flex-none ml-3 lg:ml-0 truncate">
              {getPageTitle()}
            </h1>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="relative w-10 h-10 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] flex items-center justify-center text-[#1F2937] hover:bg-[#1F7A3F]/10 hover:border-[#1F7A3F]/30 transition-all"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22C55E] rounded-full" />
              </button>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">
                    {user.username.charAt(0)}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-[#1F2937] text-bangla-safe max-w-[100px] truncate">
                  {user.username}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
