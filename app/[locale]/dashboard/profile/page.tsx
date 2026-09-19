'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  MapPin,
  Building2,
  Hash,
  Home,
  Lock,
  AtSign,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
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
  const prefix = isBn ? '' : `/${locale}`;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '+880',
    phone: '',
    address: '',
    state: '',
    city: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 🎯 Load user profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          window.location.href = `${prefix}/login`;
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select(
            'first_name, last_name, username, email, country_code, mobile, address, state, city, zip_code'
          )
          .eq('id', authUser.id)
          .maybeSingle();

        if (profile) {
          setFormData({
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            username: profile.username || '',
            email: profile.email || authUser.email || '',
            country: profile.country_code || '+880',
            phone: profile.mobile || '',
            address: profile.address || '',
            state: profile.state || '',
            city: profile.city || '',
            zipCode: profile.zip_code || '',
          });
        } else {
          // Fallback to auth user
          setFormData((prev) => ({
            ...prev,
            email: authUser.email || '',
            username: authUser.email?.split('@')[0] || '',
          }));
        }
      } catch (err) {
        console.error('Load profile error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [prefix]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const content = {
    pageTitle_bn: 'আমার প্রোফাইল',
    pageTitle_en: 'My Profile',
    sectionPersonal_bn: 'ব্যক্তিগত তথ্য',
    sectionPersonal_en: 'Personal Information',
    sectionLocation_bn: 'ঠিকানা',
    sectionLocation_en: 'Location',

    firstNameLabel_bn: 'প্রথম নাম',
    firstNameLabel_en: 'First Name',
    firstNamePh_bn: 'প্রথম নাম লিখুন',
    firstNamePh_en: 'Enter first name',

    lastNameLabel_bn: 'পদবি',
    lastNameLabel_en: 'Last Name',
    lastNamePh_bn: 'পদবি লিখুন',
    lastNamePh_en: 'Enter last name',

    usernameLabel_bn: 'ইউজারনেম',
    usernameLabel_en: 'Username',
    usernameLocked_bn: 'ইউজারনেম পরিবর্তন করা যাবে না',
    usernameLocked_en: 'Username cannot be changed',

    emailLabel_bn: 'ইমেইল',
    emailLabel_en: 'E-mail Address',
    emailPh_bn: 'ইমেইল লিখুন',
    emailPh_en: 'Enter email',

    countryLabel_bn: 'দেশ',
    countryLabel_en: 'Country',

    phoneLabel_bn: 'মোবাইল নম্বর',
    phoneLabel_en: 'Mobile Number',
    phonePh_bn: 'মোবাইল নম্বর',
    phonePh_en: 'Mobile number',

    addressLabel_bn: 'ঠিকানা',
    addressLabel_en: 'Address',
    addressPh_bn: 'ঠিকানা লিখুন',
    addressPh_en: 'Enter address',

    stateLabel_bn: 'রাজ্য/বিভাগ',
    stateLabel_en: 'State',
    statePh_bn: 'রাজ্য/বিভাগ',
    statePh_en: 'State',

    cityLabel_bn: 'শহর',
    cityLabel_en: 'City',
    cityPh_bn: 'শহর',
    cityPh_en: 'City',

    zipCodeLabel_bn: 'পোস্ট কোড',
    zipCodeLabel_en: 'Zip Code',
    zipCodePh_bn: 'পোস্ট কোড',
    zipCodePh_en: 'Zip code',

    save_bn: 'সংরক্ষণ করুন',
    save_en: 'Save Changes',
    saving_bn: 'সংরক্ষণ হচ্ছে...',
    saving_en: 'Saving...',
    cancel_bn: 'বাতিল',
    cancel_en: 'Cancel',

    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    firstNameShort_bn: 'প্রথম নাম কমপক্ষে ২ অক্ষর',
    firstNameShort_en: 'First name must be at least 2 characters',
    lastNameShort_bn: 'পদবি কমপক্ষে ২ অক্ষর',
    lastNameShort_en: 'Last name must be at least 2 characters',
    invalidEmail_bn: 'সঠিক ইমেইল দিন',
    invalidEmail_en: 'Enter a valid email',
    invalidPhone_bn: 'সঠিক মোবাইল নম্বর দিন',
    invalidPhone_en: 'Enter valid phone',
    addressLong_bn: 'ঠিকানা সর্বোচ্চ ২০০ অক্ষর',
    addressLong_en: 'Address must be under 200 characters',
    invalidZip_bn: 'সঠিক পোস্ট কোড দিন',
    invalidZip_en: 'Enter valid zip code',

    success_bn: 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!',
    success_en: 'Profile updated successfully!',
    loadFailed_bn: 'প্রোফাইল লোড করা যায়নি',
    loadFailed_en: 'Failed to load profile',
    saveFailed_bn: 'প্রোফাইল সংরক্ষণ করা যায়নি',
    saveFailed_en: 'Failed to save profile',
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('required');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('firstNameShort');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('required');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('lastNameShort');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (!formData.country) {
      newErrors.country = t('required');
    }

    if (
      formData.phone &&
      !/^\d{6,15}$/.test(formData.phone.replace(/\D/g, ''))
    ) {
      newErrors.phone = t('invalidPhone');
    }

    if (formData.address.length > 200) {
      newErrors.address = t('addressLong');
    }

    if (
      formData.zipCode.trim() &&
      !/^\d{4,10}$/.test(formData.zipCode.replace(/\D/g, ''))
    ) {
      newErrors.zipCode = t('invalidZip');
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
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setToast({
          type: 'error',
          message: isBn ? 'সেশন মেয়াদোত্তীর্ণ' : 'Session expired',
        });
        setIsLoading(false);
        window.location.href = `${prefix}/login`;
        return;
      }

      // 🎯 Update users table
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          country_code: formData.country,
          mobile: formData.phone.trim(),
          address: formData.address.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          zip_code: formData.zipCode.trim(),
        })
        .eq('id', authUser.id);

      if (error) {
        console.error('Update profile error:', error);
        setToast({
          type: 'error',
          message: `${t('saveFailed')}: ${error.message}`,
        });
        setIsLoading(false);
        return;
      }

      // 🎯 Also update auth email if changed
      if (authUser.email !== formData.email.trim().toLowerCase()) {
        await supabase.auth.updateUser({
          email: formData.email.trim().toLowerCase(),
        });
      }

      setToast({ type: 'success', message: t('success') });
      setIsLoading(false);
    } catch (err: any) {
      console.error('Save profile exception:', err);
      setToast({
        type: 'error',
        message: err?.message || 'Something went wrong',
      });
      setIsLoading(false);
    }
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
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
  const displayName = fullName || formData.username;
  const avatarLetter = (formData.firstName || formData.username || 'U')
    .charAt(0)
    .toUpperCase();

  const displayUsername = (formData.username || '')
    .toLowerCase()
    .replace(/\s+/g, '');

  const displayEmail = (formData.email || '').toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* 🎯 Toast */}
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
              {avatarLetter}
            </span>
          </div>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1">
              {displayName}
            </h2>
            <p className="text-sm text-[#1F7A3F] font-semibold text-bangla-safe break-all mb-1">
              {displayUsername}
            </p>
            <p className="text-sm text-[#6B7280] text-bangla-safe break-all">
              {displayEmail}
            </p>
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
          {/* Section 1: Personal */}
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
            <User size={16} className="text-[#1F7A3F]" />
            {t('sectionPersonal')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {/* First Name */}
            <div className="w-full min-w-0">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('firstNameLabel')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder={t('firstNamePh')}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                    errors.firstName
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                  <AlertCircle size={12} />
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="w-full min-w-0">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('lastNameLabel')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder={t('lastNamePh')}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                    errors.lastName
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                  <AlertCircle size={12} />
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Username — READ-ONLY */}
            <div className="w-full min-w-0 md:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe flex items-center gap-1.5">
                {t('usernameLabel')}
                <Lock size={11} className="text-[#6B7280]" />
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <AtSign size={16} />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  readOnly
                  disabled
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAF9] text-sm text-[#6B7280] font-medium text-bangla-safe cursor-not-allowed focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[10px] text-[#6B7280] flex items-center gap-1 text-bangla-safe">
                <Lock size={10} />
                {t('usernameLocked')}
              </p>
            </div>

            {/* Email */}
            <div className="w-full min-w-0 md:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('emailLabel')}
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
                  placeholder={t('emailPh')}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
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
                {t('countryLabel')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none z-10">
                  <Globe size={16} />
                </div>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 appearance-none cursor-pointer disabled:opacity-60"
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
                {t('phoneLabel')}
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
                  placeholder={t('phonePh')}
                  disabled={isLoading}
                  className={`w-full px-3 sm:px-4 py-2.5 rounded-r-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
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

          {/* Section 2: Location */}
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
            <MapPin size={16} className="text-[#1F7A3F]" />
            {t('sectionLocation')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {/* State */}
            <div className="w-full min-w-0">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('stateLabel')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <Building2 size={16} />
                </div>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder={t('statePh')}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 disabled:opacity-60"
                />
              </div>
            </div>

            {/* City */}
            <div className="w-full min-w-0">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('cityLabel')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <Home size={16} />
                </div>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder={t('cityPh')}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Zip Code */}
            <div className="w-full min-w-0">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('zipCodeLabel')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    handleChange('zipCode', e.target.value.replace(/[^\d]/g, ''))
                  }
                  placeholder={t('zipCodePh')}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                    errors.zipCode
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                  }`}
                />
              </div>
              {errors.zipCode && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                  <AlertCircle size={12} />
                  {errors.zipCode}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="w-full min-w-0 md:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('addressLabel')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-[#9CA3AF] pointer-events-none">
                  <MapPin size={16} />
                </div>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder={t('addressPh')}
                  rows={3}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 resize-none disabled:opacity-60 ${
                    errors.address
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between mt-0.5">
                {errors.address ? (
                  <p className="text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.address}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-[10px] text-[#9CA3AF]">
                  {formData.address.length}/200
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-5 mt-5 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all duration-200 text-bangla-safe disabled:opacity-60"
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
  );
}
