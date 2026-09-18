'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, Hourglass, Loader2 } from 'lucide-react';
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
    deedsChartSub_bn: 'বছর ভিত্তিক অনুমোদিত দলিল',
    deedsChartSub_en: 'Yearly approved deeds',

    khatianChart_bn: 'খতিয়ান পরিসংখ্যান',
    khatianChart_en: 'Khatian Statistics',
    khatianChartSub_bn: 'বছর ভিত্তিক অনুমোদিত খতিয়ান',
    khatianChartSub_en: 'Yearly approved khatian',

    approved_bn: 'অনুমোদিত',
    approved_en: 'Approved',

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

  // 🎯 Full Name for Welcome
  const fullName = `${user.firstName || user.username || ''} ${
    user.lastName || ''
  }`.trim();
  const displayName = fullName || user.username || 'User';

  const statsData = [
    {
      icon: CheckCircle2,
      label_bn: content.approvedDeeds_bn,
      label_en: content.approvedDeeds_en,
      value: '566',
      iconColor: 'text-[#1F7A3F]',
      iconBg: 'bg-[#1F7A3F]/10',
      borderColor: 'border-[#1F7A3F]/20',
    },
    {
      icon: Hourglass,
      label_bn: content.pendingDeeds_bn,
      label_en: content.pendingDeeds_en,
      value: '0',
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      icon: CheckCircle2,
      label_bn: content.approvedKhatian_bn,
      label_en: content.approvedKhatian_en,
      value: '342',
      iconColor: 'text-[#1F7A3F]',
      iconBg: 'bg-[#1F7A3F]/10',
      borderColor: 'border-[#1F7A3F]/20',
    },
    {
      icon: Hourglass,
      label_bn: content.pendingKhatian_bn,
      label_en: content.pendingKhatian_en,
      value: '18',
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

  const deedsChartData = [
    { year: '2019', value: 42 },
    { year: '2020', value: 68 },
    { year: '2021', value: 95 },
    { year: '2022', value: 124 },
    { year: '2023', value: 178 },
    { year: '2024', value: 245 },
    { year: '2025', value: 312 },
  ];

  const khatianChartData = [
    { year: '2019', value: 28 },
    { year: '2020', value: 45 },
    { year: '2021', value: 72 },
    { year: '2022', value: 98 },
    { year: '2023', value: 145 },
    { year: '2024', value: 198 },
    { year: '2025', value: 256 },
  ];

  const RenderChart = ({
    data,
    titleKey,
    subKey,
  }: {
    data: { year: string; value: number }[];
    titleKey: string;
    subKey: string;
  }) => {
    const maxVal = Math.max(...data.map((d) => d.value));
    const yMax = Math.ceil(maxVal / 50) * 50;

    const yLabels = [
      yMax,
      Math.round(yMax * 0.75),
      Math.round(yMax * 0.5),
      Math.round(yMax * 0.25),
      0,
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
      >
        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-start sm:items-center justify-between mb-5 flex-col sm:flex-row gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1F2937] text-bangla-heading pt-1 pb-0.5">
                {t(titleKey)}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#6B7280] text-bangla-safe">
                {t(subKey)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#1F7A3F]" />
              <span className="text-[10px] sm:text-xs font-medium text-[#6B7280] text-bangla-safe">
                {t('approved')}
              </span>
            </div>
          </div>

          <div className="relative h-52 sm:h-64 flex items-end">
            <div className="w-10 sm:w-12 flex flex-col justify-between h-full pb-8 text-[10px] sm:text-xs text-[#9CA3AF] font-medium">
              {yLabels.map((v, i) => (
                <span key={i} className="leading-none text-right pr-1">
                  {v}
                </span>
              ))}
            </div>

            <div className="flex-1 relative h-full">
              <div className="absolute inset-0 bottom-8 flex flex-col justify-between">
                {yLabels.map((_, i) => (
                  <div
                    key={i}
                    className="w-full border-t border-dashed border-[#E5E7EB]"
                  />
                ))}
              </div>

              <div className="absolute inset-0 bottom-8 flex items-end justify-around gap-1 sm:gap-2">
                {data.map((d, i) => {
                  const heightPct = (d.value / yMax) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex items-end justify-center h-full max-w-[60px] relative group"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{
                          duration: 0.9,
                          delay: 0.3 + i * 0.07,
                          ease: 'easeOut',
                        }}
                        className="w-[70%] rounded-t-md bg-gradient-to-t from-[#1F7A3F] to-[#22C55E] shadow-sm min-h-[3px] relative"
                        title={`${d.year}: ${d.value}`}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#1F7A3F] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {d.value}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-around gap-1 sm:gap-2">
                {data.map((d, i) => (
                  <div key={i} className="flex-1 text-center max-w-[60px]">
                    <span className="text-[9px] sm:text-[10px] text-[#9CA3AF] font-medium">
                      {d.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-5 sm:space-y-6">
        {/* 🎯 Welcome — Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1 leading-tight">
            {t('welcome')}, {displayName}!
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.iconBg} border ${stat.borderColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} strokeWidth={2} className={stat.iconColor} />
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-bangla-safe mb-1">
                  {isBn ? stat.label_bn : stat.label_en}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#1F2937] leading-tight">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <RenderChart
          data={deedsChartData}
          titleKey="deedsChart"
          subKey="deedsChartSub"
        />

        <RenderChart
          data={khatianChartData}
          titleKey="khatianChart"
          subKey="khatianChartSub"
        />
      </div>
    </DashboardLayout>
  );
}