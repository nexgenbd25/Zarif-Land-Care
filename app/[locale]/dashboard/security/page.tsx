'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
  Copy,
  Check,
  QrCode,
  Lock,
  Download,
  Info,
  Smartphone,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../DashboardLayout';

// 🎯 DEMO Secret Key (fixed for demo)
const DEMO_SECRET = 'WLXKUBLJHJ77ELXV';
const DEMO_OTP = '123456'; // Demo verify code

export default function SecurityPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState<'idle' | 'setup'>('idle');
  const [token, setToken] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
    setAuthChecked(true);

    const enabled = localStorage.getItem(`2fa_enabled_${currentUser.email}`);
    if (enabled === 'true') {
      setIsEnabled(true);
    }
  }, [router, isBn, locale]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(DEMO_SECRET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🎯 Enable → setup step e jao
  const handleStartSetup = () => {
    setStep('setup');
    setToken('');
    setError('');
  };

  // 🎯 Verify (demo)
  const handleVerify = () => {
    if (token !== DEMO_OTP) {
      setError(
        isBn
          ? `ডেমো কোড: ${DEMO_OTP} — এই কোডটি লিখুন`
          : `Demo code: ${DEMO_OTP} — Enter this code`
      );
      return;
    }

    if (!user) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem(`2fa_enabled_${user.email}`, 'true');
      localStorage.setItem(`2fa_secret_${user.email}`, DEMO_SECRET);
      setIsEnabled(true);
      setStep('idle');
      setToken('');
      setSuccess(
        isBn ? '২এফএ সফলভাবে চালু হয়েছে!' : '2FA enabled successfully!'
      );
      setTimeout(() => setSuccess(''), 3000);
      setIsLoading(false);
    }, 800);
  };

  // 🎯 Disable
  const handleDisable = () => {
    if (!user) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem(`2fa_enabled_${user.email}`);
      localStorage.removeItem(`2fa_secret_${user.email}`);
      setIsEnabled(false);
      setSuccess(isBn ? '২এফএ বন্ধ করা হয়েছে' : '2FA disabled');
      setTimeout(() => setSuccess(''), 3000);
      setIsLoading(false);
    }, 600);
  };

  const handleCancel = () => {
    setStep('idle');
    setToken('');
    setError('');
  };

  const content = {
    pageTitle_bn: '২এফএ সিকিউরিটি',
    pageTitle_en: '2FA Security',

    heroTitle_bn: 'টু-ফ্যাক্টর অথেন্টিকেশন',
    heroTitle_en: 'Two-Factor Authentication',

    heroSub_bn: 'আপনার অ্যাকাউন্টে অতিরিক্ত সুরক্ষা স্তর যোগ করুন।',
    heroSub_en: 'Add an extra layer of security to your account.',

    statusEnabled_bn: 'সক্রিয়',
    statusEnabled_en: 'Enabled',
    statusDisabled_bn: 'নিষ্ক্রিয়',
    statusDisabled_en: 'Disabled',

    enabledMsg_bn: 'আপনার অ্যাকাউন্টে ২এফএ সক্রিয় আছে।',
    enabledMsg_en: '2FA is active on your account.',

    disabledMsg_bn: 'আপনার অ্যাকাউন্টে ২এফএ নিষ্ক্রিয় আছে।',
    disabledMsg_en: '2FA is disabled on your account.',

    enableBtn_bn: '২এফএ চালু করুন',
    enableBtn_en: 'Enable 2FA',
    disableBtn_bn: '২এফএ বন্ধ করুন',
    disableBtn_en: 'Disable 2FA',

    addAccount_bn: 'অ্যাকাউন্ট যোগ করুন',
    addAccount_en: 'Add Your Account',

    addAccountSub_bn:
      'Google Authenticator অ্যাপে QR কোড বা সেটআপ কী ব্যবহার করে আপনার অ্যাকাউন্ট যোগ করুন।',
    addAccountSub_en:
      'Use the QR code or setup key on your Google Authenticator app to add your account.',

    secretKey_bn: 'সেটআপ কী',
    secretKey_en: 'Setup Key',

    enableTitle_bn: '২এফএ সিকিউরিটি চালু করুন',
    enableTitle_en: 'Enable 2FA Security',

    otpLabel_bn: 'Google Authenticator OTP',
    otpLabel_en: 'Google Authenticator OTP',
    otpPlaceholder_bn: '৬ ডিজিটের কোড',
    otpPlaceholder_en: '6-digit code',

    submit_bn: 'জমা দিন',
    submit_en: 'Submit',
    cancel_bn: 'বাতিল',
    cancel_en: 'Cancel',

    help_bn: 'সাহায্য',
    help_en: 'Help',

    helpText_bn:
      'Google Authenticator হলো মোবাইল ডিভাইসের জন্য একটি মাল্টিফ্যাক্টর অ্যাপ। এটি ২-ধাপ যাচাইকরণ প্রক্রিয়ায় ব্যবহৃত টাইম-বেসড কোড তৈরি করে। আপনার মোবাইল ডিভাইসে Google Authenticator অ্যাপ ইনস্টল করুন।',
    helpText_en:
      'Google Authenticator is a multifactor app for mobile devices. It generates timed codes used during the 2-step verification process. To use Google Authenticator, install the Google Authenticator application on your mobile device.',

    download_bn: 'ডাউনলোড',
    download_en: 'Download',

    demoHint_bn: 'ডেমো: যেকোনো কোড লিখুন → 123456 দিন',
    demoHint_en: 'Demo: Any code → Enter 123456',

    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Loading...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  if (!authChecked || !user) {
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

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Header */}
        <div className="mb-5 sm:mb-6 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1F7A3F]/10 border border-[#1F7A3F]/20 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-[#1F7A3F]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-0.5 leading-tight">
                {t('pageTitle')}
              </h1>
            </div>
          </div>
        </div>

        {/* Demo Hint */}
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/40">
          <Info size={14} className="text-[#B45309] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-[#92400E] text-bangla-safe leading-relaxed">
            {t('demoHint')}
          </p>
        </div>

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-2.5 p-3 sm:p-4 rounded-xl bg-[#DCFCE7] border border-[#22C55E]/30"
          >
            <CheckCircle2
              size={18}
              className="text-[#15803D] flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-[#166534] text-bangla-safe">
              {success}
            </p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-2.5 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200"
          >
            <AlertCircle
              size={18}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-red-700 text-bangla-safe">{error}</p>
          </motion.div>
        )}

        {/* IDLE STATE */}
        {step === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 sm:p-6 lg:p-8 w-full"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isEnabled ? 'bg-green-100' : 'bg-orange-100'
                  }`}
                >
                  {isEnabled ? (
                    <CheckCircle2 size={24} className="text-green-600" />
                  ) : (
                    <AlertCircle size={24} className="text-orange-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1F2937] text-bangla-heading">
                    {t('heroTitle')}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe">
                    {t('heroSub')}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isEnabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEnabled ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                />
                {isEnabled ? t('statusEnabled') : t('statusDisabled')}
              </span>
            </div>

            <div className="border-t border-[#F3F4F6] pt-5">
              <p className="text-sm text-[#4B5563] text-bangla-safe mb-5">
                {isEnabled ? t('enabledMsg') : t('disabledMsg')}
              </p>

              <button
                onClick={isEnabled ? handleDisable : handleStartSetup}
                disabled={isLoading}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] w-full sm:w-auto ${
                  isEnabled
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                    : 'bg-[#1F7A3F] hover:bg-[#155E30] shadow-[#1F7A3F]/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span>
                      {isEnabled ? t('disableBtn') : t('enableBtn')}
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* SETUP STATE */}
        {step === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full"
          >
            {/* LEFT: QR + Secret */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 sm:p-6 w-full">
              <h2 className="text-base sm:text-lg font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 border-b border-[#F3F4F6]">
                {t('addAccount')}
              </h2>

              <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe mb-4">
                {t('addAccountSub')}
              </p>

              {/* QR Code — Demo Placeholder */}
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 bg-white rounded-lg border-2 border-[#E5E7EB] flex items-center justify-center p-2">
                  {/* Demo QR Pattern */}
                  <div className="w-full h-full grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          [0, 1, 2, 5, 6, 7, 10, 12, 14, 16, 18, 20, 21, 22, 24].includes(
                            i
                          )
                            ? 'bg-[#1F7A3F]'
                            : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Secret Key */}
              <div className="mb-4">
                <p className="text-[11px] text-[#6B7280] font-semibold mb-1.5">
                  {t('secretKey')}
                </p>
                <div className="flex items-center gap-2 bg-[#F8FAF9] rounded-lg border border-[#E5E7EB] p-3">
                  <code className="text-sm font-mono text-[#1F2937] flex-1 break-all">
                    {DEMO_SECRET}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="w-8 h-8 rounded-lg bg-[#1F7A3F] hover:bg-[#155E30] text-white flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Help */}
              <div className="p-3 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Info size={14} className="text-[#1F7A3F]" />
                  <p className="text-xs font-bold text-[#1F7A3F]">
                    {t('help')}
                  </p>
                </div>
                <p className="text-[11px] text-[#6B7280] text-bangla-safe leading-relaxed mb-2">
                  {t('helpText')}
                </p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F7A3F] hover:underline"
                >
                  <Download size={12} />
                  {t('download')}
                </a>
              </div>
            </div>

            {/* RIGHT: OTP Verify */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 sm:p-6 w-full">
              <h2 className="text-base sm:text-lg font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 border-b border-[#F3F4F6] flex items-center gap-2">
                <Lock size={16} className="text-[#1F7A3F]" />
                {t('enableTitle')}
              </h2>

              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-2 text-bangla-safe">
                  {t('otpLabel')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) =>
                    setToken(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder={t('otpPlaceholder')}
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-center text-xl font-bold tracking-widest text-[#1F2937] placeholder-[#9CA3AF] placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleVerify}
                  disabled={isLoading || token.length !== 6}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('loading')}</span>
                    </>
                  ) : (
                    <span>{t('submit')}</span>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
