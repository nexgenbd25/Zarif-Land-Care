// components/admin/AdminSidebar.tsx
// Admin Sidebar — Complete menu

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Ticket,
  Palette,
  Settings,
  Wrench,
  User,
  LogOut,
  ChevronDown,
  Circle,
} from 'lucide-react';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

interface AdminSidebarProps {
  onLogout: () => void;
  onClose?: () => void;
}

interface MenuItem {
  type: 'link' | 'dropdown';
  icon: any;
  label_bn: string;
  label_en: string;
  href?: string;
  children?: {
    label_bn: string;
    label_en: string;
    href: string;
  }[];
}

const AdminSidebar = React.memo(function AdminSidebar({
  onLogout,
  onClose,
}: AdminSidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  // Track open dropdowns
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({
    deeds: pathname.includes('/admin/deeds'),
    khatian: pathname.includes('/admin/khatian'),
    tickets: pathname.includes('/admin/tickets'),
    frontend: pathname.includes('/admin/frontend'),
    settings: pathname.includes('/admin/settings'),
    extra: pathname.includes('/admin/extra'),
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const menuItems: MenuItem[] = [
    {
      type: 'link',
      icon: LayoutDashboard,
      label_bn: 'ড্যাশবোর্ড',
      label_en: 'Dashboard',
      href: `${prefix}/admin/dashboard`,
    },
    {
      type: 'dropdown',
      icon: FileText,
      label_bn: 'দলিল ম্যানেজ',
      label_en: 'Manage Deeds',
      children: [
        {
          label_bn: 'পেন্ডিং দলিল',
          label_en: 'Pending Deeds',
          href: `${prefix}/admin/deeds/pending`,
        },
        {
          label_bn: 'অনুমোদিত দলিল',
          label_en: 'Approved Deeds',
          href: `${prefix}/admin/deeds/approved`,
        },
        {
          label_bn: 'বাতিল দলিল',
          label_en: 'Rejected Deeds',
          href: `${prefix}/admin/deeds/rejected`,
        },
      ],
    },
    {
      type: 'dropdown',
      icon: ClipboardList,
      label_bn: 'খতিয়ান ম্যানেজ',
      label_en: 'Manage Khatian',
      children: [
        {
          label_bn: 'পেন্ডিং খতিয়ান',
          label_en: 'Pending Khatian',
          href: `${prefix}/admin/khatian/pending`,
        },
        {
          label_bn: 'অনুমোদিত খতিয়ান',
          label_en: 'Approved Khatian',
          href: `${prefix}/admin/khatian/approved`,
        },
        {
          label_bn: 'বাতিল খতিয়ান',
          label_en: 'Rejected Khatian',
          href: `${prefix}/admin/khatian/rejected`,
        },
      ],
    },
    {
      type: 'link',
      icon: Users,
      label_bn: 'ইউজার ম্যানেজ',
      label_en: 'Manage Users',
      href: `${prefix}/admin/users`,
    },
    {
      type: 'dropdown',
      icon: Ticket,
      label_bn: 'সাপোর্ট টিকেট',
      label_en: 'Support Ticket',
      children: [
        {
          label_bn: 'সব টিকেট',
          label_en: 'All Tickets',
          href: `${prefix}/admin/tickets`,
        },
        {
          label_bn: 'পেন্ডিং টিকেট',
          label_en: 'Pending Tickets',
          href: `${prefix}/admin/tickets/pending`,
        },
        {
          label_bn: 'উত্তর দেওয়া',
          label_en: 'Answered Tickets',
          href: `${prefix}/admin/tickets/answered`,
        },
        {
          label_bn: 'বন্ধ টিকেট',
          label_en: 'Closed Tickets',
          href: `${prefix}/admin/tickets/closed`,
        },
      ],
    },
    {
      type: 'dropdown',
      icon: Palette,
      label_bn: 'ফ্রন্টএন্ড ম্যানেজার',
      label_en: 'Frontend Manager',
      children: [
        {
          label_bn: 'হিরো সেকশন',
          label_en: 'Hero Section',
          href: `${prefix}/admin/frontend/hero`,
        },
        {
          label_bn: 'সার্ভিস সেকশন',
          label_en: 'Services Section',
          href: `${prefix}/admin/frontend/services`,
        },
        {
          label_bn: 'আমাদের সম্পর্কে',
          label_en: 'About Us',
          href: `${prefix}/admin/frontend/about`,
        },
        {
          label_bn: 'কিভাবে কাজ করে',
          label_en: 'How It Works',
          href: `${prefix}/admin/frontend/how-it-works`,
        },
        {
          label_bn: 'FAQ সেকশন',
          label_en: 'FAQ Section',
          href: `${prefix}/admin/frontend/faq`,
        },
        {
          label_bn: 'টিম সেকশন',
          label_en: 'Team Section',
          href: `${prefix}/admin/frontend/team`,
        },
        {
          label_bn: 'ব্লগ সেকশন',
          label_en: 'Blog Section',
          href: `${prefix}/admin/frontend/blog`,
        },
        {
          label_bn: 'যোগাযোগ',
          label_en: 'Contact Us',
          href: `${prefix}/admin/frontend/contact`,
        },
        {
          label_bn: 'ফুটার সেকশন',
          label_en: 'Footer Section',
          href: `${prefix}/admin/frontend/footer`,
        },
        {
          label_bn: 'পলিসি পেজ',
          label_en: 'Policy Pages',
          href: `${prefix}/admin/frontend/policy`,
        },
      ],
    },
    {
      type: 'dropdown',
      icon: Settings,
      label_bn: 'সেটিংস',
      label_en: 'Settings',
      children: [
        {
          label_bn: 'জেনারেল সেটিং',
          label_en: 'General Setting',
          href: `${prefix}/admin/settings/general`,
        },
        {
          label_bn: 'সিস্টেম কনফিগ',
          label_en: 'System Configuration',
          href: `${prefix}/admin/settings/system`,
        },
        {
          label_bn: 'লোগো ও ফ্যাভিকন',
          label_en: 'Logo & Favicon',
          href: `${prefix}/admin/settings/branding`,
        },
        {
          label_bn: 'SEO ম্যানেজার',
          label_en: 'SEO Manager',
          href: `${prefix}/admin/settings/seo`,
        },
      ],
    },
    {
      type: 'dropdown',
      icon: Wrench,
      label_bn: 'এক্সট্রা',
      label_en: 'Extra',
      children: [
        {
          label_bn: 'মেইনটেন্যান্স মোড',
          label_en: 'Maintenance Mode',
          href: `${prefix}/admin/extra/maintenance`,
        },
        {
          label_bn: 'GDPR কুকি',
          label_en: 'GDPR Cookie',
          href: `${prefix}/admin/extra/gdpr`,
        },
      ],
    },
  ];

  const getDropdownKey = (label_en: string) => {
    return label_en.toLowerCase().split(' ')[0];
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
        <Link
          href={`${prefix}/admin/dashboard`}
          className="flex flex-col items-center group"
          onClick={onClose}
        >
          <Image
            src={LOGO_URL}
            alt="Zarif Landcare"
            width={140}
            height={42}
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          <span className="text-[10px] mt-2 text-[#22C55E] font-bold uppercase tracking-widest">
            {isBn ? 'অ্যাডমিন' : 'Admin'}
          </span>
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              if (item.type === 'link' && item.href) {
                const active = isActive(item.href);
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-bangla-safe ${
                        active
                          ? 'bg-[#1F7A3F] text-white shadow-md shadow-[#1F7A3F]/30'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span>{isBn ? item.label_bn : item.label_en}</span>
                    </Link>
                  </li>
                );
              }

              if (item.type === 'dropdown') {
                const key = getDropdownKey(item.label_en);
                const isOpen = openDropdowns[key] || false;
                const active = item.children?.some((child) =>
                  isActive(child.href)
                );

                return (
                  <li key={index}>
                    <button
                      onClick={() => toggleDropdown(key)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-bangla-safe ${
                        active
                          ? 'bg-[#1F7A3F]/20 text-white'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="flex-shrink-0" />
                        <span>{isBn ? item.label_bn : item.label_en}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden ml-4 mt-1 space-y-1"
                        >
                          {item.children?.map((child, i) => {
                            const childActive = isActive(child.href);
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
                                  <span>
                                    {isBn ? child.label_bn : child.label_en}
                                  </span>
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

          {/* Profile Link */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href={`${prefix}/admin/profile`}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-bangla-safe ${
                isActive(`${prefix}/admin/profile`)
                  ? 'bg-[#1F7A3F] text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <User size={18} className="flex-shrink-0" />
              <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
            </Link>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 mt-1 rounded-lg text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 text-bangla-safe"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span>{isBn ? 'লগ আউট' : 'Logout'}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        <p className="text-[10px] text-center text-gray-400 text-bangla-safe">
          © {new Date().getFullYear()} Zarif Land Care
        </p>
      </div>
    </div>
  );
});

export default AdminSidebar;
