'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

interface FormErrors {
  identifier?: string;
  password?: string;
}

export default function LoginPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    remember: false,
  });

  const content = {
    title_bn: 'স্বাগতম',
    title_en: 'Welcome Back',
    subtitle_bn: 'আপনার অ্যাকাউন্টে প্রবেশ করুন',
    subtitle_en: 'Sign in to your account',
    identifierLabel_bn: 'ইউজারনেম বা ইমেইল',
    identifierLabel_en: 'Username or Email',
    identifierPlaceholder_bn: 'ইউজারনেম বা ইমেইল লিখুন',
    identifierPlaceholder_en: 'Enter username or email',
    passwordLabel_bn: 'পাসওয়ার্ড',
    passwordLabel_en: 'Password',
    passwordPlaceholder_bn: 'পাসওয়ার্ড লিখুন',
    passwordPlaceholder_en: 'Enter password',
    remember_bn: 'মনে রাখুন',
    remember_en: 'Remember me',
    forgot_bn: 'ভুলে গেছেন?',
    forgot_en: 'Forgot?',
    loginBtn_bn: 'লগইন করুন',
    loginBtn_en: 'Sign In',
    signUp_bn: 'রেজিস্টার করুন',
    signUp_en: 'Sign Up',
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    passwordShort_bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর',
    passwordShort_en: 'Password must be at least 6 characters',
    loginSuccess_bn: 'সফলভাবে লগইন হয়েছে!',
    loginSuccess_en: 'Logged in successfully!',
    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',
    or_bn: 'অথবা',
    or_en: 'OR',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!loginData.identifier.trim()) newErrors.identifier = t('required');
    if (!loginData.password) newErrors.password = t('required');
    else if (loginData.password.length < 6)
      newErrors.password = t('passwordShort');
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
      setSuccess(t('loginSuccess'));
    }, 1500);
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-4 sm:py-8 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-[#1F7A3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(31,122,63,0.25)] border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <div className="pt-6 pb-4 sm:pt-8 sm:pb-5 px-5 sm:px-6 text-center border-b border-[#F3F4F6]">
            <Link
              href={`/${isBn ? '' : locale}`}
              className="inline-block mb-3 group"
            >
              <Image
                src={LOGO_URL}
                alt="Zarif Landcare Center"
                width={200}
                height={60}
                className="h-11 sm:h-14 w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </Link>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1">
              {t('title')}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe">
              {t('subtitle')}
            </p>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-7 pt-4 sm:pt-5">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 sm:mb-4 flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-[#DCFCE7] border border-[#22C55E]/30"
              >
                <CheckCircle
                  size={16}
                  className="text-[#15803D] flex-shrink-0 mt-0.5"
                />
                <p className="text-xs sm:text-sm text-[#166534] text-bangla-safe">
                  {success}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Identifier */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 sm:mb-2 text-bangla-safe">
                  {t('identifierLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={loginData.identifier}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        identifier: e.target.value,
                      })
                    }
                    placeholder={t('identifierPlaceholder')}
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-white text-sm sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.identifier
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 sm:mb-2 text-bangla-safe">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    placeholder={t('passwordPlaceholder')}
                    className={`w-full pl-9 sm:pl-10 pr-11 sm:pr-12 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 bg-white text-sm sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        remember: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-[#D1D5DB] text-[#1F7A3F] focus:ring-[#1F7A3F]/20 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#4B5563] group-hover:text-[#1F7A3F] transition-colors text-bangla-safe">
                    {t('remember')}
                  </span>
                </label>
                <Link
                  href={`/${isBn ? '' : locale + '/'}forgot-password`}
                  className="text-xs sm:text-sm text-[#1F7A3F] hover:text-[#155E30] font-semibold transition-colors text-bangla-safe"
                >
                  {t('forgot')}
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm sm:text-base bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-3 sm:mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-bangla-safe">{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <span className="text-bangla-safe">{t('loginBtn')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[#E5E7EB]" />
                <span className="text-[10px] sm:text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">
                  {t('or')}
                </span>
                <div className="flex-1 h-px bg-[#E5E7EB]" />
              </div>

              {/* Register Button */}
              <Link
                href={`/${isBn ? '' : locale + '/'}register`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-[#1F7A3F] text-sm sm:text-base bg-[#F0FDF4] border-2 border-[#1F7A3F]/20 hover:bg-[#1F7A3F] hover:text-white hover:border-[#1F7A3F] transition-all duration-300 active:scale-[0.98]"
              >
                <span className="text-bangla-safe">{t('signUp')}</span>
                <ArrowRight size={16} />
              </Link>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}