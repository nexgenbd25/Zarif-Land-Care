'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Shield,
  CheckCircle2,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

function AdminLoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const urlError = searchParams.get('error');
    if (urlError === 'login-required') {
      setToast({
        type: 'error',
        message: isBn
          ? 'অ্যাডমিন প্যানেলে ঢুকতে লগইন করুন'
          : 'Login required for admin panel',
      });
    } else if (urlError === 'admin-only') {
      setToast({
        type: 'error',
        message: isBn
          ? 'শুধুমাত্র অ্যাডমিন অ্যাক্সেস করতে পারবেন'
          : 'Only admins can access this',
      });
    }
  }, [searchParams, isBn]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const content = {
    title_bn: 'অ্যাডমিন লগইন',
    title_en: 'Admin Login',
    subtitle_bn: 'শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাক্সেস করতে পারবেন',
    subtitle_en: 'Only authorized administrators can access',

    emailLabel_bn: 'ইমেইল',
    emailLabel_en: 'Email',
    emailPh_bn: 'admin@zariflandcare.com',
    emailPh_en: 'admin@zariflandcare.com',

    passwordLabel_bn: 'পাসওয়ার্ড',
    passwordLabel_en: 'Password',
    passwordPh_bn: 'পাসওয়ার্ড লিখুন',
    passwordPh_en: 'Enter password',

    loginBtn_bn: 'লগইন করুন',
    loginBtn_en: 'Sign In',
    loggingIn_bn: 'লগইন হচ্ছে...',
    loggingIn_en: 'Signing in...',

    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',

    invalidEmail_bn: 'সঠিক ইমেইল দিন',
    invalidEmail_en: 'Enter a valid email',

    invalidCred_bn: 'ভুল ইমেইল অথবা পাসওয়ার্ড',
    invalidCred_en: 'Invalid email or password',

    notAdmin_bn:
      'আপনি অ্যাডমিন নন। শুধুমাত্র অ্যাডমিন এই প্যানেলে ঢুকতে পারেন।',
    notAdmin_en:
      'You are not an admin. Only admins can access this panel.',

    loginSuccess_bn: 'সফলভাবে লগইন হয়েছে!',
    loginSuccess_en: 'Logged in successfully!',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t('invalidEmail');
    }

    if (!password) {
      newErrors.password = t('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const supabase = createClient();

      // 🎯 Supabase Auth
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

      if (signInError) {
        console.error('Sign in error:', signInError);
        setToast({
          type: 'error',
          message: signInError.message || t('invalidCred'),
        });
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setToast({ type: 'error', message: t('invalidCred') });
        setIsLoading(false);
        return;
      }

      // 🎯 Role check
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        setToast({ type: 'error', message: t('notAdmin') });
        setIsLoading(false);
        return;
      }

      // ✅ Admin verified
      setToast({ type: 'success', message: t('loginSuccess') });

      // Full page reload to admin dashboard
      setTimeout(() => {
        window.location.href = `${prefix}/admin/dashboard`;
      }, 800);
    } catch (err: any) {
      console.error('Login exception:', err);
      setToast({
        type: 'error',
        message: err?.message || t('invalidCred'),
      });
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D]">
        <Loader2 size={40} className="animate-spin text-[#22C55E]" />
      </div>
    );
  }

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-6 bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1F7A3F]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#22C55E 1px, transparent 1px), linear-gradient(90deg, #22C55E 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

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
        className="relative w-full max-w-md z-10"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E] via-[#1F7A3F] to-[#22C55E] rounded-3xl p-[1.5px]">
            <div className="w-full h-full bg-[#0A2E17] rounded-[22px]" />
          </div>

          {/* Content */}
          <div className="relative p-6 sm:p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <Image
                src={LOGO_URL}
                alt="Zarif Landcare"
                width={160}
                height={48}
                className="h-12 w-auto object-contain mx-auto"
                unoptimized
              />
            </div>

            {/* Shield Icon */}
            <div className="relative mx-auto w-16 h-16 mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#1F7A3F] shadow-lg shadow-[#22C55E]/30 rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield
                  size={28}
                  className="text-white relative z-10"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white text-bangla-heading mb-1">
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 text-bangla-safe leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 text-bangla-safe">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors({ ...errors, email: undefined });
                    }}
                    placeholder={t('emailPh')}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 focus:ring-[#22C55E]/40 focus:border-[#22C55E]/40'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 text-bangla-safe">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    placeholder={t('passwordPh')}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/10 focus:ring-[#22C55E]/40 focus:border-[#22C55E]/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#22C55E] transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm bg-gradient-to-r from-[#22C55E] to-[#1F7A3F] hover:from-[#1F7A3F] hover:to-[#155E30] shadow-lg shadow-[#22C55E]/20 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('loggingIn')}</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span>{t('loginBtn')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-500 mt-6">
          © {new Date().getFullYear()} Zarif Land Care — Admin Panel
        </p>
      </motion.div>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F3D1F] via-[#0A2E17] to-[#061B0D]">
          <Loader2 size={40} className="animate-spin text-[#22C55E]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}