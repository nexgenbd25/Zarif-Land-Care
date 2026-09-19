'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { demoLogin } from '@/lib/auth';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

// 🎯 Demo OTP (fixed for demo)
const DEMO_OTP = '123456';

type Step = 'credentials' | '2fa';

interface FormErrors {
  identifier?: string;
  password?: string;
  otp?: string;
}

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [step, setStep] = useState<Step>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    remember: false,
  });

  const [otp, setOtp] = useState('');
  const [userEmail, setUserEmail] = useState('');

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

    // 🎯 2FA Step
    twofaTitle_bn: '২এফএ যাচাইকরণ',
    twofaTitle_en: '2FA Verification',
    twofaSub_bn:
      'Google Authenticator অ্যাপ থেকে ৬ ডিজিটের কোড লিখুন',
    twofaSub_en: 'Enter 6-digit code from Google Authenticator app',
    otpLabel_bn: '৬ ডিজিটের কোড',
    otpLabel_en: '6-digit code',
    otpPlaceholder_bn: 'কোড লিখুন',
    otpPlaceholder_en: 'Enter code',
    verifyBtn_bn: 'যাচাই করুন',
    verifyBtn_en: 'Verify',
    backBtn_bn: 'ফিরে যান',
    backBtn_en: 'Back',
    setupLink_bn: '২এফএ সেটআপ',
    setupLink_en: '2FA Setup',

    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    passwordShort_bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর',
    passwordShort_en: 'Password must be at least 6 characters',
    loginSuccess_bn: 'সফলভাবে লগইন হয়েছে!',
    loginSuccess_en: 'Logged in successfully!',
    loginFailed_bn: 'লগইন ব্যর্থ হয়েছে',
    loginFailed_en: 'Login failed',
    invalidOtp_bn: 'ভুল কোড। আবার চেষ্টা করুন।',
    invalidOtp_en: 'Invalid code. Please try again.',
    otpRequired_bn: '৬ ডিজিটের কোড দিন',
    otpRequired_en: 'Enter 6-digit code',
    verifying_bn: 'যাচাই হচ্ছে...',
    verifying_en: 'Verifying...',
    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',
    or_bn: 'অথবা',
    or_en: 'OR',
    demoHint_bn: 'ডেমো: যেকোনো ইউজারনেম + ৬ অক্ষরের পাসওয়ার্ড',
    demoHint_en: 'Demo: Any username + 6 char password',
    demoOtpHint_bn: 'ডেমো OTP: 123456',
    demoOtpHint_en: 'Demo OTP: 123456',
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

  // 🎯 STEP 1: Credentials Submit
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setIsLoading(true);

    // 🎯 DEMO LOGIN
    setTimeout(() => {
      const result = demoLogin(loginData.identifier, loginData.password);

      if (!result.success) {
        setIsLoading(false);
        setErrors({ password: t('loginFailed') });
        return;
      }

      const email = result.user?.email || loginData.identifier;

      // 🎯 2FA enabled check
      const enabled =
        typeof window !== 'undefined'
          ? localStorage.getItem(`2fa_enabled_${email}`) === 'true'
          : false;

      setIsLoading(false);

      if (enabled) {
        // ✅ 2FA enabled → OTP step
        setUserEmail(email);
        setStep('2fa');
      } else {
        // ❌ 2FA disabled → direct dashboard
        setSuccess(t('loginSuccess'));
        setTimeout(() => {
          router.push(`/${isBn ? '' : locale + '/'}dashboard`);
        }, 700);
      }
    }, 900);
  };

  // 🎯 STEP 2: OTP Verify
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: t('otpRequired') });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (otp === DEMO_OTP) {
        setSuccess(t('loginSuccess'));
        setTimeout(() => {
          router.push(`/${isBn ? '' : locale + '/'}dashboard`);
        }, 700);
      } else {
        setIsLoading(false);
        setErrors({ otp: t('invalidOtp') });
      }
    }, 800);
  };

  const handleBack = () => {
    setStep('credentials');
    setOtp('');
    setErrors({});
    setSuccess('');
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
        <div className="text-center mb-3 sm:mb-5">
          <Link href={`/${isBn ? '' : locale}`} className="inline-block group">
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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-center mb-4 sm:mb-6"
          >
            {step === 'credentials' ? (
              <>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-1 leading-tight">
                  {t('title')}
                </h1>
                <p className="text-[11px] sm:text-sm text-[#6B7280] text-bangla-safe leading-tight">
                  {t('subtitle')}
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1F7A3F]/10 border-2 border-[#1F7A3F]/20 flex items-center justify-center mb-3">
                  <Shield size={26} className="text-[#1F7A3F]" />
                </div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-1 leading-tight">
                  {t('twofaTitle')}
                </h1>
                <p className="text-[11px] sm:text-sm text-[#6B7280] text-bangla-safe leading-tight max-w-xs mx-auto">
                  {t('twofaSub')}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Demo Hint — Credentials */}
        {step === 'credentials' && (
          <div className="mb-3 flex items-start gap-2 p-2 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/40">
            <AlertCircle
              size={14}
              className="text-[#B45309] flex-shrink-0 mt-0.5"
            />
            <p className="text-[10px] sm:text-xs text-[#92400E] text-bangla-safe leading-tight">
              {t('demoHint')}
            </p>
          </div>
        )}

        {/* Demo Hint — 2FA */}
        {step === '2fa' && (
          <div className="mb-3 flex items-start gap-2 p-2 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/40">
            <KeyRound
              size={14}
              className="text-[#B45309] flex-shrink-0 mt-0.5"
            />
            <p className="text-[10px] sm:text-xs text-[#92400E] text-bangla-safe font-bold leading-tight">
              {t('demoOtpHint')}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-start gap-2 p-2 rounded-lg bg-[#DCFCE7] border border-[#22C55E]/30"
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

        {/* Forms */}
        <AnimatePresence mode="wait">
          {step === 'credentials' ? (
            // 🎯 STEP 1: Credentials
            <motion.form
              key="credentials-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleCredentialsSubmit}
              className="space-y-2.5 sm:space-y-3"
            >
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
                    value={loginData.identifier}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        identifier: e.target.value,
                      })
                    }
                    placeholder={t('identifierPlaceholder')}
                    className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-base text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
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
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        remember: e.target.checked,
                      })
                    }
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-[#D1D5DB] text-[#1F7A3F] focus:ring-[#1F7A3F]/20 cursor-pointer"
                  />
                  <span className="text-[11px] sm:text-sm text-[#4B5563] group-hover:text-[#1F7A3F] transition-colors text-bangla-safe">
                    {t('remember')}
                  </span>
                </label>
                <Link
                  href={`/${isBn ? '' : locale + '/'}forgot-password`}
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
                    <Loader2
                      size={16}
                      className="animate-spin hidden sm:block"
                    />
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
                href={`/${isBn ? '' : locale + '/'}register`}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-[#1F7A3F] text-[13px] sm:text-base bg-[#F0FDF4] border-2 border-[#1F7A3F]/20 hover:bg-[#1F7A3F] hover:text-white hover:border-[#1F7A3F] transition-all duration-300 active:scale-[0.98]"
              >
                <span className="text-bangla-safe">{t('signUp')}</span>
                <ArrowRight size={14} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </Link>
            </motion.form>
          ) : (
            // 🎯 STEP 2: 2FA OTP
            <motion.form
              key="2fa-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleOtpSubmit}
              className="space-y-3 sm:space-y-4"
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-sm text-[#6B7280] hover:text-[#1F7A3F] transition-colors text-bangla-safe"
              >
                <ArrowLeft size={14} />
                {t('backBtn')}
              </button>

              {/* OTP Input */}
              <div>
                <label className="block text-[11px] sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('otpLabel')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder={t('otpPlaceholder')}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    className={`w-full pl-10 sm:pl-11 pr-3 py-3 sm:py-3.5 rounded-lg border transition-all duration-200 bg-white text-center text-xl sm:text-2xl font-bold tracking-[0.5em] text-[#1F2937] placeholder-[#9CA3AF] placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 ${
                      errors.otp
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.otp && (
                  <p className="mt-1 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* Setup Link */}
              <Link
                href={`/${isBn ? '' : locale + '/'}dashboard/security`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] sm:text-sm font-semibold text-[#1F7A3F] bg-[#1F7A3F]/5 border border-[#1F7A3F]/20 hover:bg-[#1F7A3F]/10 transition-colors text-bangla-safe"
              >
                <Shield size={14} />
                {t('setupLink')}
              </Link>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold text-white text-[13px] sm:text-base bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-bangla-safe">
                      {t('verifying')}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span className="text-bangla-safe">
                      {t('verifyBtn')}
                    </span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
