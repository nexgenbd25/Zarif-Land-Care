'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
  Copy,
  Check,
  Lock,
  Download,
  Info,
  Smartphone,
  X,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  enrollTOTP,
  challengeAndVerify,
  listFactors,
  unenrollFactor,
} from '@/lib/supabase/mfa';

interface Factor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
}

export default function SecurityPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);

  const [step, setStep] = useState<'idle' | 'setup'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 🎯 Load 2FA status
  useEffect(() => {
    async function checkStatus() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const result = await listFactors();
        if (result.success) {
          const verifiedTotp = (result.totp || []).filter(
            (f: Factor) => f.status === 'verified'
          );

          if (verifiedTotp.length > 0) {
            setIsEnabled(true);
            setFactorId(verifiedTotp[0].id);
          }
        }
      } catch (err) {
        console.error('Check 2FA status error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
      'Google Authenticator অ্যাপে QR কোড স্ক্যান করুন অথবা সেটআপ কী ব্যবহার করে অ্যাকাউন্ট যোগ করুন।',
    addAccountSub_en:
      'Scan the QR code or use the setup key on your Google Authenticator app to add your account.',
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
    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Loading...',
    pageLoading_bn: 'লোড হচ্ছে...',
    pageLoading_en: 'Loading...',
    enableSuccess_bn: '২এফএ সফলভাবে চালু হয়েছে!',
    enableSuccess_en: '2FA enabled successfully!',
    disableSuccess_bn: '২এফএ বন্ধ করা হয়েছে',
    disableSuccess_en: '2FA disabled',
    setupFailed_bn: '২এফএ সেটআপ ব্যর্থ',
    setupFailed_en: '2FA setup failed',
    verifyFailed_bn: 'কোড ভুল। আবার চেষ্টা করুন।',
    verifyFailed_en: 'Invalid code. Try again.',
    disableFailed_bn: '২এফএ বন্ধ করা যায়নি',
    disableFailed_en: 'Failed to disable 2FA',
    verifyFirst_bn: 'আগে ২এফএ ভেরিফাই করুন',
    verifyFirst_en: 'Please verify 2FA first',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🎯 Start Setup
  const handleStartSetup = async () => {
    setIsLoading(true);
    setToast(null);
    try {
      const result = await enrollTOTP();

      if (!result.success) {
        setToast({
          type: 'error',
          message: `${t('setupFailed')}: ${result.error}`,
        });
        setIsLoading(false);
        return;
      }

      setQrCode(result.qrCode || '');
      setSecret(result.secret || '');
      setFactorId(result.factorId || null);
      setStep('setup');
      setToken('');
    } catch (err: any) {
      console.error('Setup error:', err);
      setToast({
        type: 'error',
        message: err?.message || t('setupFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Verify Code
  const handleVerify = async () => {
    if (token.length !== 6) {
      setToast({ type: 'error', message: t('verifyFirst') });
      return;
    }

    if (!factorId) {
      setToast({ type: 'error', message: t('verifyFirst') });
      return;
    }

    setIsLoading(true);
    setToast(null);

    try {
      const result = await challengeAndVerify(factorId, token);

      if (!result.success) {
        setToast({
          type: 'error',
          message: `${t('verifyFailed')}`,
        });
        setToken('');
        setIsLoading(false);
        return;
      }

      setIsEnabled(true);
      setStep('idle');
      setToken('');
      setQrCode('');
      setSecret('');
      setToast({ type: 'success', message: t('enableSuccess') });
    } catch (err: any) {
      console.error('Verify error:', err);
      setToast({
        type: 'error',
        message: err?.message || t('verifyFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Disable 2FA
  const handleDisable = async () => {
    if (!factorId) return;

    setIsLoading(true);
    setToast(null);

    try {
      const result = await unenrollFactor(factorId);

      if (!result.success) {
        setToast({
          type: 'error',
          message: `${t('disableFailed')}: ${result.error}`,
        });
        setIsLoading(false);
        return;
      }

      setIsEnabled(false);
      setFactorId(null);
      setToast({ type: 'success', message: t('disableSuccess') });
    } catch (err: any) {
      console.error('Disable error:', err);
      setToast({
        type: 'error',
        message: err?.message || t('disableFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // Unenroll the unverified factor
    if (factorId) {
      try {
        await unenrollFactor(factorId);
      } catch (err) {
        console.error('Cancel cleanup error:', err);
      }
    }
    setStep('idle');
    setToken('');
    setQrCode('');
    setSecret('');
    setFactorId(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-[#1F7A3F] mx-auto mb-4"
          />
          <p className="text-sm text-[#6B7280] text-bangla-safe">
            {t('pageLoading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Toast */}
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
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <ShieldCheck size={24} className="text-green-600" />
                ) : (
                  <ShieldOff size={24} className="text-orange-600" />
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

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-white rounded-lg border-2 border-[#E5E7EB] flex items-center justify-center p-2">
                {qrCode ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: qrCode }}
                  />
                ) : (
                  <Loader2
                    size={24}
                    className="animate-spin text-[#1F7A3F]"
                  />
                )}
              </div>
            </div>

            {/* Secret Key */}
            <div className="mb-4">
              <p className="text-[11px] text-[#6B7280] font-semibold mb-1.5">
                {t('secretKey')}
              </p>
              <div className="flex items-center gap-2 bg-[#F8FAF9] rounded-lg border border-[#E5E7EB] p-3">
                <code className="text-sm font-mono text-[#1F2937] flex-1 break-all">
                  {secret}
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
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-center text-xl font-bold tracking-widest text-[#1F2937] placeholder-[#9CA3AF] placeholder:tracking-normal placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 disabled:opacity-60"
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
                disabled={isLoading}
                className="px-6 py-3 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all disabled:opacity-60"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
