'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Shield,
} from 'lucide-react';
import { signInClient } from '@/lib/auth-client';
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
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const urlError = searchParams.get('error');
    if (urlError === 'login-required') {
      setError(
        isBn
          ? 'অ্যাডমিন প্যানেলে ঢুকতে লগইন করুন'
          : 'Login required for admin panel'
      );
    } else if (urlError === 'admin-only') {
      setError(
        isBn
          ? 'শুধুমাত্র অ্যাডমিন অ্যাক্সেস করতে পারবেন'
          : 'Only admins can access this'
      );
    }
  }, [searchParams, isBn]);

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
    notAdmin_en: 'You are not an admin. Only admins can access this panel.',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const validate = () => {
    if (!email.trim()) {
      setError(t('required'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('invalidEmail'));
      return false;
    }
    if (!password) {
      setError(t('required'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const { data, error: signInError } = await signInClient(email, password);

      if (signInError || !data.user) {
        setError(t('invalidCred'));
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        setError(t('notAdmin'));
        setIsLoading(false);
        return;
      }

      router.push(`${prefix}/admin/dashboard`);
      router.refresh();
    } catch (err) {
      setError(t('invalidCred'));
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card */}
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

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <AlertCircle
                  size={16}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs sm:text-sm text-red-300 text-bangla-safe">
                  {error}
                </p>
              </motion.div>
            )}

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
                      if (error) setError('');
                    }}
                    placeholder={t('emailPh')}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40 focus:border-[#22C55E]/40 transition-all"
                  />
                </div>
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
                      if (error) setError('');
                    }}
                    placeholder={t('passwordPh')}
                    className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40 focus:border-[#22C55E]/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#22C55E] transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                    <span className="text-bangla-safe">{t('loggingIn')}</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span className="text-bangla-safe">{t('loginBtn')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-500 mt-6 text-bangla-safe">
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
