'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  Shield,
  Key,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../DashboardLayout';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
    setAuthChecked(true);
  }, [router, isBn, locale]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

  const content = {
    pageTitle_bn: 'পাসওয়ার্ড পরিবর্তন',
    pageTitle_en: 'Change Password',
    sectionTitle_bn: 'নতুন পাসওয়ার্ড সেট করুন',
    sectionTitle_en: 'Set New Password',
    currentPassword_bn: 'বর্তমান পাসওয়ার্ড',
    currentPassword_en: 'Current Password',
    currentPasswordPh_bn: 'বর্তমান পাসওয়ার্ড লিখুন',
    currentPasswordPh_en: 'Enter current password',
    newPassword_bn: 'নতুন পাসওয়ার্ড',
    newPassword_en: 'New Password',
    newPasswordPh_bn: 'নতুন পাসওয়ার্ড লিখুন',
    newPasswordPh_en: 'Enter new password',
    confirmPassword_bn: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
    confirmPassword_en: 'Confirm New Password',
    confirmPasswordPh_bn: 'নতুন পাসওয়ার্ড আবার লিখুন',
    confirmPasswordPh_en: 'Re-enter new password',
    passwordHint_bn: 'কমপক্ষে ৬ অক্ষর, বড় হাতের ও ছোট হাতের অক্ষর সহ',
    passwordHint_en: 'Min 6 chars, mix of upper & lower case',
    save_bn: 'পাসওয়ার্ড পরিবর্তন করুন',
    save_en: 'Change Password',
    saving_bn: 'পরিবর্তন হচ্ছে...',
    saving_en: 'Changing...',
    cancel_bn: 'বাতিল',
    cancel_en: 'Cancel',
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    passwordShort_bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে',
    passwordShort_en: 'Password must be at least 6 characters',
    passwordMismatch_bn: 'পাসওয়ার্ড মিলছে না',
    passwordMismatch_en: 'Passwords do not match',
    passwordSame_bn: 'নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে',
    passwordSame_en: 'New password must be different from current',
    success_bn: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!',
    success_en: 'Password changed successfully!',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
    securityTip_bn:
      'আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।',
    securityTip_en:
      'Use a strong password to keep your account safe.',
    demoNote_bn: 'ডেমো মোড: যেকোনো পাসওয়ার্ড দিলেই কাজ করবে',
    demoNote_en: 'Demo mode: Any password will work',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t('required');
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t('required');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('passwordShort');
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = t('passwordSame');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('required');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;

    setIsLoading(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(t('success'));
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    }, 1200);
  };

  const getPasswordStrength = () => {
    const pw = formData.newPassword;
    if (!pw) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (pw.length >= 6) strength++;
    if (pw.length >= 10) strength++;
    if (/[A-Z]/.test(pw)) strength++;
    if (/[0-9]/.test(pw)) strength++;
    if (/[^A-Za-z0-9]/.test(pw)) strength++;

    if (strength <= 2)
      return {
        level: 1,
        label: isBn ? 'দুর্বল' : 'Weak',
        color: 'bg-red-500',
      };
    if (strength <= 3)
      return {
        level: 2,
        label: isBn ? 'মাঝারি' : 'Medium',
        color: 'bg-orange-500',
      };
    return {
      level: 3,
      label: isBn ? 'শক্তিশালী' : 'Strong',
      color: 'bg-green-500',
    };
  };

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

  const strength = getPasswordStrength();

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1F7A3F]/10 border border-[#1F7A3F]/20 flex items-center justify-center flex-shrink-0">
              <Lock size={20} className="text-[#1F7A3F]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-0.5 leading-tight">
                {t('pageTitle')}
              </h1>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-[#DCFCE7] border border-[#22C55E]/30"
          >
            <CheckCircle
              size={18}
              className="text-[#15803D] flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-[#166534] text-bangla-safe">
              {success}
            </p>
          </motion.div>
        )}

        {/* Demo Note */}
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-[#FEF3C7] border border-[#FCD34D]/40">
          <Shield
            size={16}
            className="text-[#B45309] flex-shrink-0 mt-0.5"
          />
          <p className="text-[11px] sm:text-xs text-[#92400E] text-bangla-safe leading-relaxed">
            {t('demoNote')}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm"
        >
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6">
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <Key size={16} className="text-[#1F7A3F]" />
              {t('sectionTitle')}
            </h2>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('currentPassword')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleChange('currentPassword', e.target.value)
                    }
                    placeholder={t('currentPasswordPh')}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.currentPassword
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('newPassword')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleChange('newPassword', e.target.value)
                    }
                    placeholder={t('newPasswordPh')}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.newPassword
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">
                        {isBn ? 'পাসওয়ার্ড শক্তি' : 'Password Strength'}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          strength.level === 1
                            ? 'text-red-500'
                            : strength.level === 2
                            ? 'text-orange-500'
                            : 'text-green-500'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            strength.level === 1
                              ? '33%'
                              : strength.level === 2
                              ? '66%'
                              : '100%',
                        }}
                        transition={{ duration: 0.3 }}
                        className={`h-full ${strength.color} rounded-full`}
                      />
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.newPassword}
                  </p>
                )}

                <p className="mt-1 text-[10px] text-[#6B7280] text-bangla-safe">
                  {t('passwordHint')}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('confirmPassword')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange('confirmPassword', e.target.value)
                    }
                    placeholder={t('confirmPasswordPh')}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Security Tip */}
            <div className="mt-5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB] flex items-start gap-2">
              <Shield
                size={14}
                className="text-[#1F7A3F] flex-shrink-0 mt-0.5"
              />
              <p className="text-[11px] sm:text-xs text-[#6B7280] text-bangla-safe leading-relaxed">
                {t('securityTip')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-5 mt-5 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all duration-200 text-bangla-safe"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-bangla-safe">{t('saving')}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span className="text-bangla-safe">{t('save')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}