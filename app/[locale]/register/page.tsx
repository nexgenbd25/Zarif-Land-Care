'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

interface FormData {
  username: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  country?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const COUNTRIES = [
  { code: '+880', name_bn: 'বাংলাদেশ', name_en: 'Bangladesh', flag: '🇧🇩' },
  { code: '+91', name_bn: 'ভারত', name_en: 'India', flag: '🇮🇳' },
  { code: '+92', name_bn: 'পাকিস্তান', name_en: 'Pakistan', flag: '🇵🇰' },
  { code: '+1', name_bn: 'যুক্তরাষ্ট্র', name_en: 'United States', flag: '🇺🇸' },
  { code: '+44', name_bn: 'যুক্তরাজ্য', name_en: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', name_bn: 'সংযুক্ত আরব আমিরাত', name_en: 'UAE', flag: '🇦🇪' },
  { code: '+966', name_bn: 'সৌদি আরব', name_en: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+60', name_bn: 'মালয়েশিয়া', name_en: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name_bn: 'সিঙ্গাপুর', name_en: 'Singapore', flag: '🇸🇬' },
  { code: '+974', name_bn: 'কাতার', name_en: 'Qatar', flag: '🇶🇦' },
  { code: '+965', name_bn: 'কুয়েত', name_en: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', name_bn: 'বাহরাইন', name_en: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', name_bn: 'ওমান', name_en: 'Oman', flag: '🇴🇲' },
  { code: '+39', name_bn: 'ইতালি', name_en: 'Italy', flag: '🇮🇹' },
  { code: '+82', name_bn: 'দক্ষিণ কোরিয়া', name_en: 'South Korea', flag: '🇰🇷' },
  { code: '+81', name_bn: 'জাপান', name_en: 'Japan', flag: '🇯🇵' },
];

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    country: '+880',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const content = {
    title_bn: 'নতুন অ্যাকাউন্ট',
    title_en: 'Create Account',
    subtitle_bn: 'আপনার তথ্য দিয়ে রেজিস্টার করুন',
    subtitle_en: 'Register with your information',
    usernameLabel_bn: 'ইউজারনেম',
    usernameLabel_en: 'Username',
    usernamePlaceholder_bn: 'ইউজারনেম লিখুন',
    usernamePlaceholder_en: 'Enter username',
    emailLabel_bn: 'ইমেইল',
    emailLabel_en: 'Email',
    emailPlaceholder_bn: 'ইমেইল লিখুন',
    emailPlaceholder_en: 'Enter email',
    countryLabel_bn: 'দেশ',
    countryLabel_en: 'Country',
    phoneLabel_bn: 'মোবাইল নম্বর',
    phoneLabel_en: 'Mobile Number',
    phonePlaceholder_bn: 'নম্বর লিখুন',
    phonePlaceholder_en: 'Enter number',
    passwordLabel_bn: 'পাসওয়ার্ড',
    passwordLabel_en: 'Password',
    passwordPlaceholder_bn: 'পাসওয়ার্ড লিখুন',
    passwordPlaceholder_en: 'Enter password',
    confirmPasswordLabel_bn: 'পাসওয়ার্ড নিশ্চিত করুন',
    confirmPasswordLabel_en: 'Confirm Password',
    confirmPasswordPlaceholder_bn: 'আবার লিখুন',
    confirmPasswordPlaceholder_en: 'Re-enter',
    registerBtn_bn: 'রেজিস্টার করুন',
    registerBtn_en: 'Create Account',
    haveAccount_bn: 'অ্যাকাউন্ট আছে?',
    haveAccount_en: 'Already have an account?',
    signIn_bn: 'লগইন করুন',
    signIn_en: 'Sign In',
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    invalidEmail_bn: 'সঠিক ইমেইল দিন',
    invalidEmail_en: 'Enter a valid email',
    invalidPhone_bn: 'সঠিক নম্বর দিন',
    invalidPhone_en: 'Enter a valid number',
    passwordShort_bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর',
    passwordShort_en: 'Min 6 characters',
    passwordMismatch_bn: 'পাসওয়ার্ড মিলছে না',
    passwordMismatch_en: 'Passwords do not match',
    usernameShort_bn: 'ইউজারনেম কমপক্ষে ৩ অক্ষর',
    usernameShort_en: 'Min 3 characters',
    registerSuccess_bn: 'অ্যাকাউন্ট তৈরি হয়েছে!',
    registerSuccess_en: 'Account created!',
    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = t('required');
    else if (formData.username.trim().length < 3)
      newErrors.username = t('usernameShort');

    if (!formData.email.trim()) newErrors.email = t('required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('invalidEmail');

    if (!formData.country) newErrors.country = t('required');

    if (!formData.phone.trim()) newErrors.phone = t('required');
    else if (!/^\d{6,15}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = t('invalidPhone');

    if (!formData.password) newErrors.password = t('required');
    else if (formData.password.length < 6)
      newErrors.password = t('passwordShort');

    if (!formData.confirmPassword) newErrors.confirmPassword = t('required');
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t('passwordMismatch');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(t('registerSuccess'));
      setTimeout(() => {
        router.push(`/${isBn ? '' : locale + '/'}login`);
      }, 1200);
    }, 1500);
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-3 sm:py-6 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] overflow-hidden">
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-[#1F7A3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm sm:max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-2.5 sm:mb-4">
          <Link href={`/${isBn ? '' : locale}`} className="inline-block group">
            <Image
              src={LOGO_URL}
              alt="Zarif Landcare Center"
              width={200}
              height={60}
              className="h-9 sm:h-12 w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-3 sm:mb-5">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-0.5 leading-tight">
            {t('title')}
          </h1>
          <p className="text-[11px] sm:text-sm text-[#6B7280] text-bangla-safe leading-tight">
            {t('subtitle')}
          </p>
        </div>

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 flex items-start gap-2 p-2 rounded-lg bg-[#DCFCE7] border border-[#22C55E]/30"
          >
            <CheckCircle
              size={14}
              className="text-[#15803D] flex-shrink-0 mt-0.5"
            />
            <p className="text-[11px] sm:text-sm text-[#166534] text-bangla-safe">
              {success}
            </p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
          {/* Username */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-0.5 text-bangla-safe">
              {t('usernameLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <User size={14} className="sm:hidden" />
                <User size={16} className="hidden sm:block" />
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder={t('usernamePlaceholder')}
                className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                  errors.username
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              />
            </div>
            {errors.username && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-0.5 text-bangla-safe">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <Mail size={14} className="sm:hidden" />
                <Mail size={16} className="hidden sm:block" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t('emailPlaceholder')}
                className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-0.5 text-bangla-safe">
              {t('countryLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none z-10">
                <Globe size={14} className="sm:hidden" />
                <Globe size={16} className="hidden sm:block" />
              </div>
              <select
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className={`w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] text-bangla-safe focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                  errors.country
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {isBn ? c.name_bn : c.name_en} ({c.code})
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.country && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.country}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-0.5 text-bangla-safe">
              {t('phoneLabel')}
            </label>
            <div className="relative flex">
              <div className="flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-l-lg border border-r-0 border-[#E5E7EB] bg-[#F8FAF9] text-[#1F2937] font-semibold text-[11px] sm:text-sm min-w-[64px] sm:min-w-[85px]">
                <Phone size={12} className="text-[#1F7A3F] sm:hidden" />
                <Phone size={14} className="text-[#1F7A3F] hidden sm:block" />
                <span>{formData.country}</span>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/[^\d\s-]/g, ''),
                  })
                }
                placeholder={t('phonePlaceholder')}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-r-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-0.5 text-bangla-safe">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <Lock size={14} className="sm:hidden" />
                <Lock size={16} className="hidden sm:block" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={t('passwordPlaceholder')}
                className={`w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                aria-label="Toggle password"
              >
                {showPassword ? (
                  <EyeOff size={14} className="sm:hidden" />
                ) : (
                  <Eye size={14} className="sm:hidden" />
                )}
                {showPassword ? (
                  <EyeOff size={16} className="hidden sm:block" />
                ) : (
                  <Eye size={16} className="hidden sm:block" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-0.5 text-bangla-safe">
              {t('confirmPasswordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <Lock size={14} className="sm:hidden" />
                <Lock size={16} className="hidden sm:block" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder={t('confirmPasswordPlaceholder')}
                className={`w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                aria-label="Toggle password"
              >
                {showConfirmPassword ? (
                  <EyeOff size={14} className="sm:hidden" />
                ) : (
                  <Eye size={14} className="sm:hidden" />
                )}
                {showConfirmPassword ? (
                  <EyeOff size={16} className="hidden sm:block" />
                ) : (
                  <Eye size={16} className="hidden sm:block" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-white text-[13px] sm:text-base bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin sm:hidden" />
                <Loader2 size={16} className="animate-spin hidden sm:block" />
                <span className="text-bangla-safe">{t('loading')}</span>
              </>
            ) : (
              <>
                <span className="text-bangla-safe">{t('registerBtn')}</span>
                <ArrowRight size={14} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-[11px] sm:text-sm text-[#6B7280] pt-1 text-bangla-safe leading-tight">
            {t('haveAccount')}{' '}
            <Link
              href={`/${isBn ? '' : locale + '/'}login`}
              className="text-[#1F7A3F] hover:text-[#155E30] font-bold transition-colors"
            >
              {t('signIn')}
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}