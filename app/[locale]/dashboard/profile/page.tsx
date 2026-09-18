'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Calendar,
  Shield,
  X,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, saveDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../DashboardLayout';

interface FormData {
  username: string;
  email: string;
  country: string;
  phone: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
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
];

export default function ProfilePage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    country: '+880',
    phone: '',
  });

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
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      country: currentUser.country || '+880',
      phone: currentUser.phone || '',
    });
    setAuthChecked(true);
  }, [router, isBn, locale]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

  const content = {
    pageTitle_bn: 'আমার প্রোফাইল',
    pageTitle_en: 'My Profile',
    sectionInfo_bn: 'ব্যক্তিগত তথ্য',
    sectionInfo_en: 'Personal Information',
    sectionAccount_bn: 'অ্যাকাউন্ট তথ্য',
    sectionAccount_en: 'Account Information',
    username_bn: 'ইউজারনেম',
    username_en: 'Username',
    usernamePh_bn: 'ইউজারনেম',
    username_en_ph: 'Username',
    email_bn: 'ইমেইল',
    email_en: 'Email',
    emailPh_bn: 'ইমেইল',
    emailPh_en: 'Email',
    country_bn: 'দেশ',
    country_en: 'Country',
    phone_bn: 'মোবাইল নম্বর',
    phone_en: 'Mobile Number',
    phonePh_bn: 'মোবাইল নম্বর',
    phonePh_en: 'Mobile number',
    memberSince_bn: 'যোগদানের তারিখ',
    memberSince_en: 'Member Since',
    userId_bn: 'ইউজার আইডি',
    userId_en: 'User ID',
    accountStatus_bn: 'স্টেটাস',
    accountStatus_en: 'Status',
    active_bn: 'সক্রিয়',
    active_en: 'Active',
    save_bn: 'সংরক্ষণ করুন',
    save_en: 'Save Changes',
    saving_bn: 'সংরক্ষণ হচ্ছে...',
    saving_en: 'Saving...',
    cancel_bn: 'বাতিল',
    cancel_en: 'Cancel',
    edit_bn: 'সম্পাদনা',
    edit_en: 'Edit',
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    invalidEmail_bn: 'সঠিক ইমেইল দিন',
    invalidEmail_en: 'Enter valid email',
    invalidPhone_bn: 'সঠিক মোবাইল নম্বর দিন',
    invalidPhone_en: 'Enter valid phone',
    usernameShort_bn: 'ইউজারনেম কমপক্ষে ৩ অক্ষর',
    usernameShort_en: 'Min 3 characters',
    success_bn: 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!',
    success_en: 'Profile updated successfully!',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
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

    if (!formData.username.trim()) newErrors.username = t('required');
    else if (formData.username.trim().length < 3)
      newErrors.username = t('usernameShort');

    if (!formData.email.trim()) newErrors.email = t('required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t('invalidEmail');

    if (formData.phone && !/^\d{6,15}$/.test(formData.phone.replace(/\D/g, '')))
      newErrors.phone = t('invalidPhone');

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
      if (user) {
        const updatedUser: DemoUser = {
          ...user,
          username: formData.username,
          email: formData.email,
          country: formData.country,
          phone: formData.phone,
        };
        saveDemoUser(updatedUser);
        setUser(updatedUser);
      }
      setIsLoading(false);
      setSuccess(t('success'));
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
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

  const memberDate = new Date(user.loginTime).toLocaleDateString(
    isBn ? 'bn-BD' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1F7A3F]/10 border border-[#1F7A3F]/20 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-[#1F7A3F]" />
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
            exit={{ opacity: 0, y: -10 }}
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

        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden mb-4"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F7A3F] via-[#22C55E] to-[#1F7A3F]" />

          <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white text-3xl sm:text-4xl font-bold uppercase">
                {user.username.charAt(0)}
              </span>
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1">
                {user.username}
              </h2>
              <p className="text-sm text-[#6B7280] text-bangla-safe break-all mb-2">
                {user.email}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                  <Shield size={10} />
                  {t('active')}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1F7A3F]/10 text-[#1F7A3F] text-[10px] font-bold">
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm"
        >
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6">
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <User size={16} className="text-[#1F7A3F]" />
              {t('sectionInfo')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Username */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('username')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.username
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('email')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('country')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none z-10">
                    <Globe size={16} />
                  </div>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 appearance-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {isBn ? c.name_bn : c.name_en} ({c.code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
              </div>

              {/* Phone */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('phone')}
                </label>
                <div className="relative flex">
                  <div className="flex items-center gap-1 px-2.5 sm:px-3 py-2.5 rounded-l-lg border border-r-0 border-[#E5E7EB] bg-[#F8FAF9] text-[#1F2937] font-semibold text-xs sm:text-sm min-w-[72px] sm:min-w-[85px]">
                    <Phone size={14} className="text-[#1F7A3F]" />
                    <span>{formData.country}</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange(
                        'phone',
                        e.target.value.replace(/[^\d\s-]/g, '')
                      )
                    }
                    className={`w-full px-3 sm:px-4 py-2.5 rounded-r-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Account Info */}
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mt-6 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <Shield size={16} className="text-[#1F7A3F]" />
              {t('sectionAccount')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
                  {t('memberSince')}
                </p>
                <p className="text-sm font-semibold text-[#1F2937]">
                  {memberDate}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
                  {t('userId')}
                </p>
                <p className="text-sm font-semibold text-[#1F2937] break-all">
                  {user.id}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
                  {t('accountStatus')}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  {t('active')}
                </p>
              </div>
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