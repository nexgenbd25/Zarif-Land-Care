'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileText,
  ChevronDown,
  Ticket,
  Shield,
  LogOut,
  Circle,
  Mail,
} from 'lucide-react';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

interface SidebarUser {
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
}

interface DashboardSidebarProps {
  user: SidebarUser;
  onLogout: () => void;
  onClose?: () => void;
}

// 🎯 React.memo — sidebar re-render bondho (input typing e re-render hobe na)
const DashboardSidebar = React.memo(function DashboardSidebar({
  user,
  onLogout,
  onClose,
}: DashboardSidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isBn = locale === 'bn';

  const [isDeedsOpen, setIsDeedsOpen] = React.useState(
    pathname.includes('/dashboard/deeds')
  );
  const [isKhatianOpen, setIsKhatianOpen] = React.useState(
    pathname.includes('/dashboard/khatian')
  );

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const displayName = fullName || user.username || 'User';
  const avatarLetter = (user.firstName || user.username || 'U')
    .charAt(0)
    .toUpperCase();

  const displayUsername = (user.username || '')
    .toLowerCase()
    .replace(/\s+/g, '');
  const displayEmail = (user.email || '').toLowerCase();

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

  return (
    <div className="flex flex-col h-full w-full">
      {/* Logo — Fixed */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
        <Link
          href={`/${isBn ? '' : locale}`}
          className="flex items-center justify-center group"
          onClick={onClose}
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

      {/* Scrollable Middle */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {/* User Card */}
        <div className="px-4 py-5">
          <div className="relative rounded-2xl border-2 border-dashed border-[#22C55E]/40 bg-[#1F7A3F]/10 p-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center shadow-lg mb-3">
              <span className="text-white text-xl font-bold uppercase">
                {avatarLetter}
              </span>
            </div>

            <p className="text-white font-bold text-sm text-bangla-safe break-words leading-tight">
              {displayName}
            </p>

            <p className="text-[#22C55E] text-[11px] font-medium mt-1 break-all">
              {displayUsername}
            </p>

            <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-start justify-center gap-1.5">
              <Mail size={11} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-[10px] break-all text-left leading-tight">
                {displayEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-3 pb-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              if (item.type === 'link') {
                return (
                  <li key={index}>
                    <Link
                      href={item.href!}
                      onClick={onClose}
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
                                  onClick={onClose}
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
      </div>

      {/* Footer — Fixed */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        <p className="text-[10px] text-center text-gray-400 text-bangla-safe">
          © {new Date().getFullYear()} Zarif Land Care
        </p>
      </div>
    </div>
  );
});

export default DashboardSidebar;
