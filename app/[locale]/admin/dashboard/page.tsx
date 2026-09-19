'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  ClipboardList,
  Ticket,
  TrendingUp,
  Activity,
  ArrowRight,
  Palette,
  Clock,
} from 'lucide-react';

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  href: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  href,
}: StatCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#1F7A3F]/40 hover:shadow-lg transition-all duration-300 group cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          {trend && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              {trend}
            </span>
          )}
        </div>
        <p className="text-sm text-[#6B7280] text-bangla-safe mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      </motion.div>
    </Link>
  );
}

export default function AdminDashboard() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [stats, setStats] = useState({
    users: 0,
    pendingDeeds: 0,
    pendingKhatian: 0,
    openTickets: 0,
  });

  useEffect(() => {
    setStats({
      users: 1,
      pendingDeeds: 0,
      pendingKhatian: 0,
      openTickets: 0,
    });
  }, []);

  const content = {
    welcome_bn: 'স্বাগতম, অ্যাডমিন',
    welcome_en: 'Welcome back, Admin',
    subtitle_bn: 'এখানে আপনার সাইটের সব কিছু দেখতে পাবেন',
    subtitle_en: 'Here is everything about your site',

    statUsers_bn: 'মোট ইউজার',
    statUsers_en: 'Total Users',
    statDeeds_bn: 'পেন্ডিং দলিল',
    statDeeds_en: 'Pending Deeds',
    statKhatian_bn: 'পেন্ডিং খতিয়ান',
    statKhatian_en: 'Pending Khatian',
    statTickets_bn: 'ওপেন টিকেট',
    statTickets_en: 'Open Tickets',

    quickActions_bn: 'দ্রুত কাজ',
    quickActions_en: 'Quick Actions',

    recent_bn: 'সাম্প্রতিক কার্যক্রম',
    recent_en: 'Recent Activity',

    reviewDeeds_bn: 'দলিল রিভিউ',
    reviewDeeds_en: 'Review Deeds',
    reviewKhatian_bn: 'খতিয়ান রিভিউ',
    reviewKhatian_en: 'Review Khatian',
    replyTickets_bn: 'টিকেট উত্তর',
    replyTickets_en: 'Reply Tickets',
    editHero_bn: 'হিরো সেকশন সম্পাদনা',
    editHero_en: 'Edit Hero Section',

    noActivity_bn: 'কোনো কার্যক্রম নেই',
    noActivity_en: 'No activity yet',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const statCards: StatCardProps[] = [
    {
      icon: Users,
      label: t('statUsers'),
      value: stats.users,
      color: '#3B82F6',
      href: `${prefix}/admin/users`,
    },
    {
      icon: FileText,
      label: t('statDeeds'),
      value: stats.pendingDeeds,
      color: '#F59E0B',
      href: `${prefix}/admin/deeds/pending`,
    },
    {
      icon: ClipboardList,
      label: t('statKhatian'),
      value: stats.pendingKhatian,
      color: '#8B5CF6',
      href: `${prefix}/admin/khatian/pending`,
    },
    {
      icon: Ticket,
      label: t('statTickets'),
      value: stats.openTickets,
      color: '#EF4444',
      href: `${prefix}/admin/tickets/pending`,
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: t('reviewDeeds'),
      href: `${prefix}/admin/deeds/pending`,
      color: '#F59E0B',
    },
    {
      icon: ClipboardList,
      label: t('reviewKhatian'),
      href: `${prefix}/admin/khatian/pending`,
      color: '#8B5CF6',
    },
    {
      icon: Ticket,
      label: t('replyTickets'),
      href: `${prefix}/admin/tickets/pending`,
      color: '#EF4444',
    },
    {
      icon: Palette,
      label: t('editHero'),
      href: `${prefix}/admin/frontend/hero`,
      color: '#1F7A3F',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading">
          {t('welcome')}
        </h1>
        <p className="text-sm text-[#6B7280] text-bangla-safe mt-1">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 bg-white rounded-2xl border border-[#E5E7EB] p-5"
        >
          <h2 className="text-base font-bold text-[#1F2937] text-bangla-heading mb-4 flex items-center gap-2">
            <Activity size={18} className="text-[#1F7A3F]" />
            {t('quickActions')}
          </h2>

          <div className="space-y-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAF9] hover:bg-[#1F7A3F]/5 border border-transparent hover:border-[#1F7A3F]/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <Icon size={16} style={{ color: action.color }} />
                    </div>
                    <span className="text-sm font-semibold text-[#1F2937] text-bangla-safe">
                      {action.label}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[#9CA3AF] group-hover:text-[#1F7A3F] transition-colors"
                  />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-5"
        >
          <h2 className="text-base font-bold text-[#1F2937] text-bangla-heading mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#1F7A3F]" />
            {t('recent')}
          </h2>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F8FAF9] flex items-center justify-center mb-3">
              <Activity size={28} className="text-[#9CA3AF]" />
            </div>
            <p className="text-sm text-[#6B7280] text-bangla-safe">
              {t('noActivity')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
