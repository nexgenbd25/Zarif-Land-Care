'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  FileText,
  ClipboardList,
  Ticket,
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalDeeds: 0,
    pendingDeeds: 0,
    approvedDeeds: 0,
    totalKhatian: 0,
    pendingKhatian: 0,
    approvedKhatian: 0,
    totalTickets: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: profile } = await supabase
          .from('users')
          .select('first_name, last_name, username')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setUserName(
            `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
              profile.username ||
              'User'
          );
        }

        const { data: deeds } = await supabase
          .from('deeds')
          .select('status')
          .eq('user_id', user.id);

        const { data: khatians } = await supabase
          .from('khatians')
          .select('status')
          .eq('user_id', user.id);

        const { data: tickets } = await supabase
          .from('support_tickets')
          .select('status')
          .eq('user_id', user.id);

        setStats({
          totalDeeds: deeds?.length || 0,
          pendingDeeds:
            deeds?.filter((d) => d.status === 'pending').length || 0,
          approvedDeeds:
            deeds?.filter((d) => d.status === 'approved').length || 0,
          totalKhatian: khatians?.length || 0,
          pendingKhatian:
            khatians?.filter((k) => k.status === 'pending').length || 0,
          approvedKhatian:
            khatians?.filter((k) => k.status === 'approved').length || 0,
          totalTickets: tickets?.length || 0,
        });
      } catch (err) {
        console.error('Load data error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#1F7A3F]" />
      </div>
    );
  }

  const content = {
    welcome_bn: 'স্বাগতম',
    welcome_en: 'Welcome',
    subtitle_bn: 'আপনার ড্যাশবোর্ডে সব কিছু দেখুন',
    subtitle_en: 'See everything in your dashboard',
    deeds_bn: 'দলিল',
    deeds_en: 'Deeds',
    khatian_bn: 'খতিয়ান',
    khatian_en: 'Khatian',
    tickets_bn: 'টিকেট',
    tickets_en: 'Tickets',
    total_bn: 'মোট',
    total_en: 'Total',
    pending_bn: 'পেন্ডিং',
    pending_en: 'Pending',
    approved_bn: 'অনুমোদিত',
    approved_en: 'Approved',
    quickActions_bn: 'দ্রুত কাজ',
    quickActions_en: 'Quick Actions',
    newDeed_bn: 'নতুন দলিল',
    newDeed_en: 'New Deed',
    newKhatian_bn: 'নতুন খতিয়ান',
    newKhatian_en: 'New Khatian',
    newTicket_bn: 'নতুন টিকেট',
    newTicket_en: 'New Ticket',
    viewDeeds_bn: 'দলিল দেখুন',
    viewDeeds_en: 'View Deeds',
    viewKhatian_bn: 'খতিয়ান দেখুন',
    viewKhatian_en: 'View Khatian',
    viewTickets_bn: 'টিকেট দেখুন',
    viewTickets_en: 'View Tickets',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const statCards = [
    {
      icon: FileText,
      label: t('deeds'),
      total: stats.totalDeeds,
      pending: stats.pendingDeeds,
      approved: stats.approvedDeeds,
      color: '#1F7A3F',
      href: `${prefix}/dashboard/deeds/pending`,
    },
    {
      icon: ClipboardList,
      label: t('khatian'),
      total: stats.totalKhatian,
      pending: stats.pendingKhatian,
      approved: stats.approvedKhatian,
      color: '#8B5CF6',
      href: `${prefix}/dashboard/khatian/pending`,
    },
    {
      icon: Ticket,
      label: t('tickets'),
      total: stats.totalTickets,
      pending: 0,
      approved: 0,
      color: '#EF4444',
      href: `${prefix}/dashboard/support`,
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: t('newDeed'),
      href: `${prefix}/dashboard/deeds/new`,
      color: '#1F7A3F',
    },
    {
      icon: Plus,
      label: t('newKhatian'),
      href: `${prefix}/dashboard/khatian/new`,
      color: '#8B5CF6',
    },
    {
      icon: Plus,
      label: t('newTicket'),
      href: `${prefix}/dashboard/support/new`,
      color: '#EF4444',
    },
  ];

  return (
    <div className="w-full">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5 sm:mb-6"
      >
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] text-bangla-heading">
          {t('welcome')}, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe mt-1">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href}>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#1F7A3F]/40 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon size={24} style={{ color: card.color }} />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-[#9CA3AF] group-hover:text-[#1F7A3F] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <p className="text-sm text-[#6B7280] text-bangla-safe mb-3">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-[#1F2937] mb-3">
                    {card.total}
                  </p>
                  <div className="flex gap-3 pt-3 border-t border-[#F3F4F6]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-500" />
                      <span className="text-[11px] text-[#6B7280] text-bangla-safe">
                        {t('pending')}: {card.pending}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-[11px] text-[#6B7280] text-bangla-safe">
                        {t('approved')}: {card.approved}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] p-5"
      >
        <h2 className="text-base font-bold text-[#1F2937] text-bangla-heading mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#1F7A3F]" />
          {t('quickActions')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#F8FAF9] hover:bg-[#1F7A3F]/5 border border-transparent hover:border-[#1F7A3F]/20 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon size={18} style={{ color: action.color }} />
                </div>
                <span className="text-sm font-semibold text-[#1F2937] text-bangla-safe">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}