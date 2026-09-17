'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Hourglass,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  Loader2,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from './DashboardLayout';

export default function DashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router, isBn, locale]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

  const content = {
    welcome_bn: 'স্বাগতম',
    welcome_en: 'Welcome',

    approvedDeeds_bn: 'অনুমোদিত দলিল',
    approvedDeeds_en: 'Approved Deeds',
    pendingDeeds_bn: 'অপেক্ষমাণ দলিল',
    pendingDeeds_en: 'Pending Deeds',
    approvedKhatian_bn: 'অনুমোদিত খতিয়ান',
    approvedKhatian_en: 'Approved Khatian',
    pendingKhatian_bn: 'অপেক্ষমাণ খতিয়ান',
    pendingKhatian_en: 'Pending Khatian',

    deedsChart_bn: 'দলিল পরিসংখ্যান',
    deedsChart_en: 'Deeds Statistics',
    deedsChartSub_bn: 'বছর ভিত্তিক দলিল',
    deedsChartSub_en: 'Yearly deeds overview',

    khatianChart_bn: 'খতিয়ান পরিসংখ্যান',
    khatianChart_en: 'Khatian Statistics',
    khatianChartSub_bn: 'বছর ভিত্তিক খতিয়ান',
    khatianChartSub_en: 'Yearly khatian overview',

    approved_bn: 'অনুমোদিত',
    approved_en: 'Approved',
    pending_bn: 'অপেক্ষমাণ',
    pending_en: 'Pending',

    profile_bn: 'প্রোফাইল তথ্য',
    profile_en: 'Profile Information',
    username_bn: 'ইউজারনেম',
    username_en: 'Username',
    email_bn: 'ইমেইল',
    email_en: 'Email',
    country_bn: 'দেশ',
    country_en: 'Country',
    phone_bn: 'মোবাইল',
    phone_en: 'Mobile',
    loginTime_bn: 'লগইন সময়',
    loginTime_en: 'Login Time',

    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  if (isLoading || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F8FAF9]">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-[#1F7A3F] mx-auto mb-4"
          />
          <p className="text-sm text-[#6B7280] text-bangla-safe">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  // ===== Stats Data =====
  const statsData = [
    {
      icon: CheckCircle2,
      label_bn: content.approvedDeeds_bn,
      label_en: content.approvedDeeds_en,
      value: '566',
      color: 'bg-[#1F7A3F]',
    },
    {
      icon: Hourglass,
      label_bn: content.pendingDeeds_bn,
      label_en: content.pendingDeeds_en,
      value: '0',
      color: 'bg-orange-500',
    },
    {
      icon: CheckCircle2,
      label_bn: content.approvedKhatian_bn,
      label_en: content.approvedKhatian_en,
      value: '342',
      color: 'bg-[#1F7A3F]',
    },
    {
      icon: Hourglass,
      label_bn: content.pendingKhatian_bn,
      label_en: content.pendingKhatian_en,
      value: '18',
      color: 'bg-orange-500',
    },
  ];

  // ===== Chart 1: Deeds =====
  const deedsChartData = [
    { year: '2020', approved: 0, pending: 0 },
    { year: '2021', approved: 20, pending: 5 },
    { year: '2022', approved: 50, pending: 12 },
    { year: '2023', approved: 8, pending: 2 },
    { year: '2024', approved: 140, pending: 15 },
    { year: '2025', approved: 210, pending: 20 },
    { year: '2026', approved: 120, pending: 8 },
  ];

  // ===== Chart 2: Khatian =====
  const khatianChartData = [
    { year: '2020', approved: 0, pending: 0 },
    { year: '2021', approved: 15, pending: 3 },
    { year: '2022', approved: 42, pending: 8 },
    { year: '2023', approved: 10, pending: 2 },
    { year: '2024', approved: 105, pending: 12 },
    { year: '2025', approved: 180, pending: 18 },
    { year: '2026', approved: 95, pending: 6 },
  ];

  const profileFields = [
    { icon: User, label: t('username'), value: user.username },
    { icon: Mail, label: t('email'), value: user.email },
    { icon: Globe, label: t('country'), value: user.country },
    { icon: Phone, label: t('phone'), value: user.phone },
  ];

  // ===== Chart Component =====
  const RenderChart = ({
    data,
    titleKey,
    subKey,
  }: {
    data: { year: string; approved: number; pending: number }[];
    titleKey: string;
    subKey: string;
  }) => {
    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.approved, d.pending))
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
      >
        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F2937] 
                             text-bangla-heading pt-1 pb-0.5">
                {t(titleKey)}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#6B7280] 
                            text-bangla-safe">
                {t(subKey)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1F7A3F]" />
                <span className="text-[10px] sm:text-xs font-medium 
                                 text-[#6B7280] text-bangla-safe">
                  {t('approved')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-[10px] sm:text-xs font-medium 
                                 text-[#6B7280] text-bangla-safe">
                  {t('pending')}
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-48 sm:h-56 flex items-end gap-2 sm:gap-3 
                          pt-6 pb-8">
            {/* Y-axis */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col 
                            justify-between text-[10px] sm:text-xs 
                            text-[#9CA3AF] pr-2">
              {[maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0].map(
                (v, i) => (
                  <span key={i} className="h-0 leading-none">
                    {v}
                  </span>
                )
              )}
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-around gap-1 
                            sm:gap-2 pl-8 h-full border-l border-b 
                            border-[#E5E7EB]">
              {data.map((d, i) => {
                const approvedH = (d.approved / maxVal) * 100;
                const pendingH = (d.pending / maxVal) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1 
                               max-w-[60px]"
                  >
                    <div className="w-full flex items-end justify-center 
                                    gap-0.5 h-full">
                      {/* Approved bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${approvedH}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.4 + i * 0.06,
                          ease: 'easeOut',
                        }}
                        className="w-1/2 rounded-t-md 
                                   bg-gradient-to-t from-[#1F7A3F] to-[#22C55E]
                                   shadow-sm min-h-[2px]"
                        title={`Approved ${d.year}: ${d.approved}`}
                      />
                      {/* Pending bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pendingH}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5 + i * 0.06,
                          ease: 'easeOut',
                        }}
                        className="w-1/2 rounded-t-md 
                                   bg-gradient-to-t from-orange-500 to-orange-400
                                   shadow-sm min-h-[2px]"
                        title={`Pending ${d.year}: ${d.pending}`}
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] 
                                     text-[#9CA3AF] -rotate-45 sm:rotate-0 
                                     origin-center whitespace-nowrap">
                      {d.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-5 sm:space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold 
                         text-[#1F2937] text-bangla-heading 
                         pt-1 pb-1 leading-tight">
            {t('welcome')}, {user.username}!
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe">
            {new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* ===== Stats Grid — 4 Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] 
                           p-4 sm:p-5 shadow-sm hover:shadow-lg 
                           hover:-translate-y-1 transition-all duration-300 
                           group"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.color} 
                               flex items-center justify-center mb-3
                               shadow-md group-hover:scale-110 
                               transition-transform duration-300`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-[11px] sm:text-xs font-semibold 
                              text-[#6B7280] uppercase tracking-wider 
                              text-bangla-safe mb-1">
                  {isBn ? stat.label_bn : stat.label_en}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#1F2937] 
                              leading-tight">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ===== Chart 1: Deeds ===== */}
        <RenderChart
          data={deedsChartData}
          titleKey="deedsChart"
          subKey="deedsChartSub"
        />

        {/* ===== Chart 2: Khatian ===== */}
        <RenderChart
          data={khatianChartData}
          titleKey="khatianChart"
          subKey="khatianChartSub"
        />

        {/* ===== Profile Info ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm"
        >
          <div className="p-4 sm:p-5 lg:p-6">
            <h3 className="text-base sm:text-lg font-bold text-[#1F2937] 
                           text-bangla-heading pt-1 pb-2 mb-3">
              {t('profile')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {profileFields.map((field, i) => {
                const Icon = field.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl 
                               bg-[#F8FAF9] border border-[#E5E7EB]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#1F7A3F]/10 
                                    flex items-center justify-center 
                                    flex-shrink-0">
                      <Icon size={16} className="text-[#1F7A3F]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider 
                                    text-[#6B7280] font-bold mb-0.5">
                        {field.label}
                      </p>
                      <p className="text-sm text-[#1F2937] font-semibold 
                                    text-bangla-safe break-all">
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-start gap-3 p-3 rounded-xl 
                              bg-[#F8FAF9] border border-[#E5E7EB] 
                              sm:col-span-2">
                <div className="w-9 h-9 rounded-lg bg-[#1F7A3F]/10 
                                flex items-center justify-center 
                                flex-shrink-0">
                  <Clock size={16} className="text-[#1F7A3F]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider 
                                text-[#6B7280] font-bold mb-0.5">
                    {t('loginTime')}
                  </p>
                  <p className="text-sm text-[#1F2937] font-semibold">
                    {new Date(user.loginTime).toLocaleString(
                      isBn ? 'bn-BD' : 'en-US'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}