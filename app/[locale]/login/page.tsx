'use client';

import { useState, useRef, useEffect } from 'react';
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
  Smartphone,
  Clock,
  Info,
  Sparkles,
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

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userEmail, setUserEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 🎯 OTP Input Refs
  const focusOtp = (index: number) => {
    if (index >= 0 && index < 6) {
      otpRefs.current[index]?.focus();
    }
  };

  // 🎯 Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // 🎯 Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === '2fa') {
      setTimeout(() => focusOtp(0), 350);
      setResendTimer(30);
    }
  }, [step]);

  const content = {
    // Step 1
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

    // Step 2 — 2FA
    twofaBadge_bn: 'নিরাপত্তা যাচাইকরণ',
    twofaBadge_en: 'SECURITY VERIFICATION',
    twofaTitle_bn: '২-ধাপ যাচাইকরণ',
    twofaTitle_en: 'Two-Factor Authentication',
    twofaSub_bn:
      'আপনার অ্যাকাউন্টে প্রবেশ করতে Google Authenticator অ্যাপ থেকে ৬ ডিজিটের কোডটি লিখুন।',
    twofaSub_en:
      'Enter the 6-digit code from your Google Authenticator app to access your account.',

    otpLabel_bn: 'কোডটি লিখুন',
    otpLabel_en: 'Enter Verification Code',

    verifying_bn: 'যাচাই করা হচ্ছে...',
    verifying_en: 'Verifying...',
    verifyBtn_bn: 'যাচাই করুন',
    verifyBtn_en: 'Verify & Continue',
    backBtn_bn: 'ফিরে যান',
    backBtn_en: 'Back',

    // Info box
    infoTitle_bn: 'কোড কোথায় পাবেন?',
    infoTitle_en: 'Where to find the code?',
    infoText_bn:
      'Google Authenticator অ্যাপ খুলুন এবং Zarif Land Care অ্যাকাউন্টে দেখানো ৬ ডিজিটের কোডটি লিখুন। কোড প্রতি ৩০ সেকেন্ডে পরিবর্তন হয়।',
    infoText_en:
      'Open Google Authenticator app and enter the 6-digit code shown for your Zarif Land Care account. The code refreshes every 30 seconds.',

    // Resend
    resendText_bn: 'কোড পাননি?',
    resendText_en: "Didn't receive a code?",
    resendBtn_bn: 'পুনরায় পাঠান',
    resendBtn_en: 'Resend Code',
    resendWait_bn: 'পুনরায় পাঠান',
    resendWait_en: 'Resend in',

    // Demo
    demoOtpHint_bn: 'ডেমো কোড: 123456',
    demoOtpHint_en: 'Demo code: 123456',

    // Errors
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
    otpRequired_en: 'Enter all 6 digits',
    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',
    or_bn: 'অথবা',
    or_en: 'OR',
    demoHint_bn: 'ডেমো: যেকোনো ইউজারনেম + ৬ অক্ষরের পাসওয়ার্ড',
    demoHint_en: 'Demo: Any username + 6 char password',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const otpValue = otp.join('');

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

    setTimeout(() => {
      const result = demoLogin(loginData.identifier, loginData.password);

      if (!result.success) {
        setIsLoading(false);
        setErrors({ password: t('loginFailed') });
        return;
      }

      const email = result.user?.email || loginData.identifier;

      const enabled =
        typeof window !== 'undefined'
          ? localStorage.getItem(`2fa_enabled_${email}`) === 'true'
          : false;

      setIsLoading(false);

      if (enabled) {
        setUserEmail(email);
        setStep('2fa');
      } else {
        setSuccess(t('loginSuccess'));
        setTimeout(() => {
          router.push(`/${isBn ? '' : locale + '/'}dashboard`);
        }, 700);
      }
    }, 900);
  };

  // 🎯 STEP 2: OTP Submit
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (otpValue.length !== 6) {
      setErrors({ otp: t('otpRequired') });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (otpValue === DEMO_OTP) {
        setSuccess(t('loginSuccess'));
        setTimeout(() => {
          router.push(`/${isBn ? '' : locale + '/'}dashboard`);
        }, 700);
      } else {
        setIsLoading(false);
        setErrors({ otp: t('invalidOtp') });
        setOtp(['', '', '', '', '', '']);
        focusOtp(0);
      }
    }, 900);
  };

  // 🎯 OTP Input handler
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    if (!digit && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (errors.otp) setErrors({ ...errors, otp: undefined });

    if (digit && index < 5) {
      focusOtp(index + 1);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        focusOtp(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusOtp(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      focusOtp(index + 1);
    } else if (e.key === 'Enter') {
      handleOtpSubmit(e as any);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('paste')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (pasted.length > 0) {
      const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtp(newOtp);
      focusOtp(Math.min(pasted.length, 5));
    }
  };

  const handleBack = () => {
    setStep('credentials');
    setOtp(['', '', '', '', '', '']);
    setErrors({});
    setSuccess('');
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    focusOtp(0);
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-3 sm:py-6 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] overflow-hidden">
      {/* Background decorations */}
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

        {/* Forms */}
        <AnimatePresence mode="wait">
          {step === 'credentials' ? (
            // ═══════════════════════════════════════
            // 🎯 STEP 1: CREDENTIALS
            // ═══════════════════════════════════════
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Title */}
              <div className="text-center mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-1 leading-tight">
                  {t('title')}
                </h1>
                <p className="text-[11px] sm:text-sm text-[#6B7280] text-bangla-safe leading-tight">
                  {t('subtitle')}
                </p>
              </div>

              {/* Demo Hint */}
              <div className="mb-3 flex items-start gap-2 p-2 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/40">
                <AlertCircle
                  size={14}
                  className="text-[#B45309] flex-shrink-0 mt-0.5"
                />
                <p className="text-[10px] sm:text-xs text-[#92400E] text-bangla-safe leading-tight">
                  {t('demoHint')}
                </p>
              </div>

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

              <form
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
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
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
                </button>
              </Link>
              </form>
            </motion.div>
          ) : (
            // ═══════════════════════════════════════
            // 🎯 STEP 2: 2FA PREMIUM SCREEN
            // ═══════════════════════════════════════
            <motion.div
              key="2fa"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Premium Card with gradient border */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1F7A3F] via-[#22C55E] to-[#1F7A3F] rounded-3xl p-[1.5px]">
                  <div className="w-full h-full bg-white rounded-[22px]" />
                </div>

                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#1F7A3F]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Content */}
                <div className="relative p-5 sm:p-7 lg:p-8">
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6B7280] hover:text-[#1F7A3F] transition-colors text-bangla-safe mb-4 group"
                  >
                    <ArrowLeft
                      size={14}
                      className="transition-transform group-hover:-translate-x-0.5"
                    />
                    <span className="font-semibold">{t('backBtn')}</span>
                  </button>

                  {/* Shield Icon */}
                  <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1F7A3F] to-[#155E30] shadow-lg shadow-[#1F7A3F]/30 rotate-45" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield
                        size={28}
                        className="text-white relative z-10"
                        strokeWidth={2}
                      />
                    </div>
                    {/* Sparkle */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center shadow-md"
                    >
                      <Sparkles size={11} className="text-white" />
                    </motion.div>
                  </div>

                  {/* Badge */}
                  <div className="text-center mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F7A3F]/10 border border-[#1F7A3F]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A3F] animate-pulse" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#1F7A3F]">
                        {t('twofaBadge')}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-5">
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-1 leading-tight">
                      {t('twofaTitle')}
                    </h2>
                    <p className="text-[11px] sm:text-sm text-[#6B7280] text-bangla-safe leading-relaxed max-w-xs mx-auto">
                      {t('twofaSub')}
                    </p>
                  </div>

                  {/* Demo hint */}
                  <div className="mb-5 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/40">
                    <KeyRound
                      size={13}
                      className="text-[#B45309] flex-shrink-0"
                    />
                    <p className="text-[10px] sm:text-xs text-[#92400E] text-bangla-safe font-bold">
                      {t('demoOtpHint')}
                    </p>
                  </div>

                  {/* Success */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex items-start gap-2 p-2.5 rounded-lg bg-[#DCFCE7] border border-[#22C55E]/30"
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

                  <form onSubmit={handleOtpSubmit} className="space-y-5">
                    {/* OTP Label */}
                    <div className="text-center">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#6B7280] text-bangla-safe">
                        {t('otpLabel')}
                      </label>
                    </div>

                    {/* OTP 6-digit Boxes */}
                    <div className="flex justify-center gap-2 sm:gap-2.5">
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.1 + index * 0.05,
                            duration: 0.3,
                          }}
                          className="flex-shrink-0"
                        >
                          <input
                            ref={(el) => {
                              otpRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={handleOtpPaste}
                            onFocus={(e) => e.target.select()}
                            className={`w-11 h-13 sm:w-14 sm:h-16 
                                       rounded-xl border-2 text-center 
                                       text-xl sm:text-2xl font-bold 
                                       transition-all duration-200 
                                       focus:outline-none focus:ring-2
                                       ${
                                         digit
                                           ? 'border-[#1F7A3F] bg-[#F0FDF4] text-[#1F7A3F] shadow-md shadow-[#1F7A3F]/10'
                                           : 'border-[#E5E7EB] bg-[#F8FAF9] text-[#1F2937]'
                                       }
                                       ${
                                         errors.otp
                                           ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                           : 'focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                                       }`}
                            style={{ height: '3.25rem' }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Error */}
                    {errors.otp && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-[11px] sm:text-xs text-red-600 flex items-center justify-center gap-1 text-bangla-safe"
                      >
                        <AlertCircle size={12} />
                        {errors.otp}
                      </motion.p>
                    )}

                    {/* Resend */}
                    <div className="text-center">
                      <p className="text-[11px] sm:text-xs text-[#6B7280] text-bangla-safe mb-1.5">
                        {t('resendText')}
                      </p>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-sm font-bold 
                                   text-[#1F7A3F] hover:text-[#155E30] 
                                   transition-colors disabled:text-[#9CA3AF] 
                                   disabled:cursor-not-allowed text-bangla-safe"
                      >
                        {resendTimer > 0 ? (
                          <>
                            <Clock size={12} />
                            {t('resendWait')} {resendTimer}s
                          </>
                        ) : (
                          <>
                            <ArrowRight size={12} />
                            {t('resendBtn')}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Verify Button */}
                    <button
                      type="submit"
                      disabled={isLoading || otpValue.length !== 6}
                      className="w-full flex items-center justify-center gap-2 
                                 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl 
                                 font-bold text-white text-sm sm:text-base 
                                 bg-gradient-to-r from-[#1F7A3F] to-[#155E30] 
                                 hover:from-[#155E30] hover:to-[#0F3D1F]
                                 shadow-lg shadow-[#1F7A3F]/30 
                                 hover:shadow-xl hover:shadow-[#1F7A3F]/40
                                 transition-all duration-300 
                                 disabled:opacity-50 disabled:cursor-not-allowed 
                                 active:scale-[0.98]"
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
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Info Box */}
                  <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-br from-[#F0FDF4] to-[#F8FAF9] border border-[#1F7A3F]/15">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                        <Smartphone size={16} className="text-[#1F7A3F]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] sm:text-xs font-bold text-[#1F7A3F] text-bangla-safe mb-1 flex items-center gap-1.5">
                          <Info size={