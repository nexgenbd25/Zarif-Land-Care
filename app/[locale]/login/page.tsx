'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

function LoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

    loginFailed_bn: 'ভুল ইউজারনেম/ইমেইল অথবা পাসওয়ার্ড',
    loginFailed_en: 'Invalid username/email or password',

    emailNotConfirmed_bn: 'ইমেইল কনফার্ম করা হয়নি। ইনবক্স চেক করুন।',
    emailNotConfirmed_en: 'Email not confirmed. Check your inbox.',

    registerSuccess_bn: 'অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।',
    registerSuccess_en: 'Account created! Now login.',

    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',

    or_bn: 'অথবা',
    or_en: 'OR',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  // Show register success toast
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setToast({ type: 'success', message: t('registerSuccess') });
      // Clean URL without reload
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `${prefix}/login`);
      }
    }
  }, [searchParams, isBn, prefix]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) newErrors.identifier = t('required');
    if (!password) newErrors.password = t('required');
    else if (password.length < 6) newErrors.password = t('passwordShort');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setToast(null);

    try {
      const supabase = createClient();

      let loginEmail = identifier.trim();

      // Username → email lookup
      if (!loginEmail.includes('@')) {
        const { data: profile } = await supabase
          .from('users')
          .select('email')
          .eq('username', loginEmail.toLowerCase())
          .maybeSingle();

        if (!profile?.email) {
          setToast({ type: 'error', message: t('loginFailed') });
          setIsLoading(false);
          return;
        }

        loginEmail = profile.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);

        if (error.message.includes('Email not confirmed')) {
          setToast({ type: 'error', message: t('emailNotConfirmed') });
        } else {
          setToast({ type: 'error', message: t('loginFailed') });
        }

        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setToast({ type: 'error', message: t('loginFailed') });
        setIsLoading(false);
        return;
      }

      // Get role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      setToast({ type: 'success', message: t('loginSuccess') });

      // 🎯 Force full page reload to dashboard
      setTimeout(() => {
        const redirectUrl =
          profile?.role === 'admin'
            ? `${prefix}/admin/dashboard`
            : `${prefix}/dashboard`;
        window.location.href = redirectUrl;
      }, 800);
    } catch (err) {
      console.error('Login exception:', err);
      setToast({ type: 'error', message: t('loginFailed') });
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-3 sm:py-6 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] overflow-hidden">
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-[#1F7A3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 🎯 Mobile Responsive Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-3 left-3 right-3 sm:top-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] sm:w-full sm:max-w-md"
          >
            <div
              className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl shadow-lg border-2 backdrop-blur-sm ${
                toast.type === 'success'
                  ? 'bg-[#DCFCE7]/95 border-[#22C55E]/40'
                  : 'bg-red-50/95 border-red-300'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toast.type === 'success' ? 'bg-[#22C55E]' : 'bg-red-500'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-white" />
                ) : (
                  <AlertCircle size={16} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                <p
                  className={`text-xs sm:text-sm font-semibold text-bangla-safe leading-snug ${
                    toast.type === 'success'
                      ? 'text-[#166534]'
                      : 'text-red-700'
                  }`}
                >
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  toast.type === 'success'
                    ? 'hover:bg-[#22C55E]/20 text-[#166534]'
                    : 'hover:bg-red-200 text-red-700'
                }`}
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm sm:max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-3 sm:mb-5">
          <Link href={`${prefix}/`} className="inline-block group">
            <Image
              src={LOGO_URL}
              alt="Zarif Landcare Center"
              width={200}
              height={60}
              className="h-10 sm:h-14 w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-1 leading-tight">
            {t('title')}
          </h1>
          <p className="text-[11px] sm:text-sm text-[#6B7280] text-bangla-safe leading-tight">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          {/* Identifier */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-1 text-bangla-safe">
              {t('identifierLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <User size={14} className="sm:hidden" />
                <User size={16} className="hidden sm:block" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier)
                    setErrors({ ...errors, identifier: undefined });
                }}
                placeholder={t('identifierPlaceholder')}
                disabled={isLoading}
                className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                  errors.identifier
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={10} />
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-1 text-bangla-safe">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <Lock size={14} className="sm:hidden" />
                <Lock size={16} className="hidden sm:block" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                placeholder={t('passwordPlaceholder')}
                disabled={isLoading}
                className={`w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
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

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-[#D1D5DB] text-[#1F7A3F] focus:ring-[#1F7A3F]/20 cursor-pointer"
              />
              <span className="text-[11px] sm:text-sm text-[#4B5563] group-hover:text-[#1F7A3F] transition-colors text-bangla-safe">
                {t('remember')}
              </span>
            </label>
            <Link
              href={`${prefix}/forgot-password`}
              className="text-[11px] sm:text-sm text-[#1F7A3F] hover:text-[#155E30] font-semibold transition-colors text-bangla-safe"
            >
              {t('forgot')}
            </Link>
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
                <span className="text-bangla-safe">{t('loginBtn')}</span>
                <ArrowRight size={14} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 py-0.5">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-[10px] sm:text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">
              {t('or')}
            </span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Register */}
          <Link
            href={`${prefix}/register`}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-[#1F7A3F] text-[13px] sm:text-base bg-[#F0FDF4] border-2 border-[#1F7A3F]/20 hover:bg-[#1F7A3F] hover:text-white hover:border-[#1F7A3F] transition-all duration-300 active:scale-[0.98]"
          >
            <span className="text-bangla-safe">{t('signUp')}</span>
            <ArrowRight size={14} className="sm:hidden" />
            <ArrowRight size={16} className="hidden sm:block" />
          </Link>
        </form>
      </motion.div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4]">
          <Loader2 size={40} className="animate-spin text-[#1F7A3F]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}