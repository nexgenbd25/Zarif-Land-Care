'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Globe,
  LogOut,
  Home,
  FileText,
  MessageCircle,
  Settings,
  Award,
  Clock,
  Shield,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

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
    subtitle_bn: 'আপনার ড্যাশবোর্ডে স্বাগতম',
    subtitle_en: 'Welcome to your dashboard',
    profile_bn: 'প্রোফাইল তথ্য',
    profile_en: 'Profile Information',
    username_bn: 'ইউজারনেম',
    username_en: 'Username',
    email_bn: 'ইমেইল',
    email_en: 'Email',
    country_bn: 'দেশ',
    country_en: 'Country',
    phone_bn: 'মোবাইল নম্বর',
    phone_en: 'Mobile Number',
    loginTime_bn: 'লগইন সময়',
    loginTime_en: 'Login Time',
    quickActions_bn: 'দ্রুত অ্যাকশন',
    quickActions_en: 'Quick Actions',
    logout_bn: 'লগআউট',
    logout_en: 'Logout',
    home_bn: 'হোম',
    home_en: 'Home',
    services_bn: 'সেবাসমূহ',
    services_en: 'Services',
    blog_bn: 'ব্লগ',
    blog_en: 'Blog',
    settings_bn: 'সেটিংস',
    settings_en: 'Settings',
    demoBadge_bn: 'ডেমো অ্যাকাউন্ট',
    demoBadge_en: 'Demo Account',
    demoNotice_bn:
      'এটি একটি ডেমো ড্যাশবোর্ড। প্রকৃত অ্যাকাউন্টের জন্য রেজিস্ট্রেশন করুন।',
    demoNotice_en:
      'This is a demo dashboard. Register for a real account.',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  if (isLoading || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4]">
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

  const quickActions = [
    {
      icon: Home,
      label_bn: content.home_bn,
      label_en: content.home_en,
      href: `/${isBn ? '' : locale}`,
      color: 'bg-blue-500',
    },
    {
      icon: FileText,
      label_bn: content.services_bn,
      label_en: content.services_en,
      href: `/${isBn ? '' : locale + '/'}services`,
      color: 'bg-[#1F7A3F]',
    },
    {
      icon: MessageCircle,
      label_bn: content.blog_bn,
      label_en: content.blog_en,
      href: `/${isBn ? '' : locale + '/'}blog`,
      color: 'bg-purple-500',
    },
    {
      icon: Settings,
      label_bn: content.settings_bn,
      label_en: content.settings_en,
      href: `/${isBn ? '' : locale + '/'}settings`,
      color: 'bg-gray-500',
    },
  ];

  const profileFields = [
    {
      icon: User,
      label: t('username'),
      value: user.username,
    },
    {
      icon: Mail,
      label: t('email'),
      value: user.email,
    },
    {
      icon: Globe,
      label: t('country'),
      value: user.country,
    },
    {
      icon: Phone,
      label: t('phone'),
      value: user.phone,
    },
  ];

  return (
    <section className="relative min-h-[100dvh] w-full bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] py-6 sm:py-8 px-4">
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-[#1F7A3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <Link
            href={`/${isBn ? '' : locale}`}
            className="flex items-center gap-2 group"
          >
            <Image
              src={LOGO_URL}
              alt="Zarif Landcare"
              width={160}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain"
              unoptimized
            />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg
                       bg-white border border-[#E5E7EB] 
                       text-[#1F2937] hover:text-red-600 hover:border-red-200
                       hover:bg-red-50 transition-all duration-300
                       text-xs sm:text-sm font-semibold shadow-sm"
          >
            <LogOut size={14} />
            <span className="text-bangla-safe">{t('logout')}</span>
          </button>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-2xl 
                     shadow-[0_20px_60px_-15px_rgba(31,122,63,0.25)] 
                     border border-[#E5E7EB] overflow-hidden mb-5 sm:mb-6"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F7A3F] via-[#22C55E] to-[#1F7A3F]" />

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                              bg-gradient-to-br from-[#1F7A3F] to-[#155E30]
                              flex items-center justify-center flex-shrink-0
                              shadow-lg"
              >
                <span className="text-white text-2xl sm:text-3xl font-bold uppercase">
                  {user.username.charAt(0)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 
                                   rounded-full bg-[#DCFCE7] text-[#166534]
                                   text-[10px] font-bold uppercase tracking-wider"
                  >
                    <Award size={10} />
                    {t('demoBadge')}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1">
                  {t('welcome')}, {user.username}!
                </h1>
                <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            <div
              className="mt-5 flex items-start gap-2 p-3 rounded-lg 
                            bg-[#FEF3C7] border border-[#FCD34D]/30"
            >
              <Shield
                size={16}
                className="text-[#B45309] flex-shrink-0 mt-0.5"
              />
              <p className="text-[11px] sm:text-xs text-[#92400E] text-bangla-safe leading-bangla">
                {t('demoNotice')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] 
                     shadow-sm overflow-hidden mb-5 sm:mb-6"
        >
          <div className="p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4">
              {t('profile')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {profileFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl 
                               bg-[#F8FAF9] border border-[#E5E7EB]"
                  >
                    <div
                      className="w-9 h-9 rounded-lg bg-[#1F7A3F]/10 
                                    flex items-center justify-center flex-shrink-0"
                    >
                      <Icon size={16} className="text-[#1F7A3F]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] uppercase tracking-wider 
                                    text-[#6B7280] font-bold mb-0.5"
                      >
                        {field.label}
                      </p>
                      <p
                        className="text-sm text-[#1F2937] font-semibold 
                                    text-bangla-safe break-all"
                      >
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div
                className="flex items-start gap-3 p-3 rounded-xl 
                              bg-[#F8FAF9] border border-[#E5E7EB] sm:col-span-2"
              >
                <div
                  className="w-9 h-9 rounded-lg bg-[#1F7A3F]/10 
                                flex items-center justify-center flex-shrink-0"
                >
                  <Clock size={16} className="text-[#1F7A3F]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[10px] uppercase tracking-wider 
                                text-[#6B7280] font-bold mb-0.5"
                  >
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] 
                     shadow-sm overflow-hidden"
        >
          <div className="p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4">
              {t('quickActions')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="group flex flex-col items-center gap-2 p-4 
                               rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]
                               hover:border-[#1F7A3F]/30 hover:bg-white
                               hover:shadow-md transition-all duration-300
                               hover:-translate-y-1"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} 
                                   flex items-center justify-center text-white
                                   shadow-md group-hover:scale-110 
                                   transition-transform duration-300`}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className="text-xs sm:text-sm font-semibold 
                                    text-[#1F2937] text-bangla-safe 
                                    text-center"
                    >
                      {isBn ? action.label_bn : action.label_en}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-[#1F7A3F] opacity-0 
                                 group-hover:opacity-100 
                                 transition-opacity duration-300"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        <p
          className="text-center text-[11px] sm:text-xs text-[#9CA3AF] 
                      mt-6 sm:mt-8 text-bangla-safe"
        >
          © {new Date().getFullYear()} Zarif Land Care Center
        </p>
      </div>
    </section>
  );
}