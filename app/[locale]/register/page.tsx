'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Building2,
  Hash,
  Home,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;
  mobile: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  country?: string;
  mobile?: string;
  address?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  password?: string;
  confirmPassword?: string;
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
  { code: '+965', name_bn: 'কুয়েত', name_en: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', name_bn: 'বাহরাইন', name_en: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', name_bn: 'ওমান', name_en: 'Oman', flag: '🇴🇲' },
  { code: '+39', name_bn: 'ইতালি', name_en: 'Italy', flag: '🇮🇹' },
  { code: '+82', name_bn: 'দক্ষিণ কোরিয়া', name_en: 'South Korea', flag: '🇰🇷' },
  { code: '+81', name_bn: 'জাপান', name_en: 'Japan', flag: '🇯🇵' },
];

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '+880',
    mobile: '',
    address: '',
    state: '',
    city: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
  });

  const content = {
    title_bn: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    title_en: 'Create Account',
    subtitle_bn: 'নিচের তথ্য দিয়ে রেজিস্টার করুন',
    subtitle_en: 'Register with the information below',

    sectionPersonal_bn: 'ব্যক্তিগত তথ্য',
    sectionPersonal_en: 'Personal Information',
    sectionLocation_bn: 'ঠিকানা',
    sectionLocation_en: 'Location',
    sectionSecurity_bn: 'নিরাপত্তা',
    sectionSecurity_en: 'Security',

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
    usernamePh_bn: 'ইউজারনেম লিখুন',
    usernamePh_en: 'Enter username',

    emailLabel_bn: 'ইমেইল',
    emailLabel_en: 'E-mail Address',
    emailPh_bn: 'ইমেইল লিখুন',
    emailPh_en: 'Enter email',

    countryLabel_bn: 'দেশ',
    countryLabel_en: 'Country',

    mobileLabel_bn: 'মোবাইল নম্বর',
    mobileLabel_en: 'Mobile Number',
    mobilePh_bn: 'নম্বর লিখুন',
    mobilePh_en: 'Enter number',

    addressLabel_bn: 'ঠিকানা',
    addressLabel_en: 'Address',
    addressPh_bn: 'ঠিকানা লিখুন (ঐচ্ছিক)',
    addressPh_en: 'Enter address (optional)',

    stateLabel_bn: 'রাজ্য/বিভাগ',
    stateLabel_en: 'State',
    statePh_bn: 'রাজ্য/বিভাগ (ঐচ্ছিক)',
    statePh_en: 'State (optional)',

    cityLabel_bn: 'শহর',
    cityLabel_en: 'City',
    cityPh_bn: 'শহর (ঐচ্ছিক)',
    cityPh_en: 'City (optional)',

    zipCodeLabel_bn: 'পোস্ট কোড',
    zipCodeLabel_en: 'Zip Code',
    zipCodePh_bn: 'পোস্ট কোড (ঐচ্ছিক)',
    zipCodePh_en: 'Zip code (optional)',

    passwordLabel_bn: 'পাসওয়ার্ড',
    passwordLabel_en: 'Password',
    passwordPh_bn: 'পাসওয়ার্ড লিখুন',
    passwordPh_en: 'Enter password',

    confirmPasswordLabel_bn: 'পাসওয়ার্ড নিশ্চিত করুন',
    confirmPasswordLabel_en: 'Confirm Password',
    confirmPasswordPh_bn: 'পাসওয়ার্ড আবার লিখুন',
    confirmPasswordPh_en: 'Re-enter password',

    registerBtn_bn: 'রেজিস্টার করুন',
    registerBtn_en: 'Create Account',
    haveAccount_bn: 'অ্যাকাউন্ট আছে?',
    haveAccount_en: 'Already have an account?',
    signIn_bn: 'লগইন করুন',
    signIn_en: 'Sign In',

    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    firstNameShort_bn: 'প্রথম নাম কমপক্ষে ২ অক্ষর',
    firstNameShort_en: 'First name must be at least 2 characters',
    lastNameShort_bn: 'পদবি কমপক্ষে ২ অক্ষর',
    lastNameShort_en: 'Last name must be at least 2 characters',
    usernameShort_bn: 'ইউজারনেম কমপক্ষে ৩ অক্ষর',
    usernameShort_en: 'Username must be at least 3 characters',
    invalidEmail_bn: 'সঠিক ইমেইল দিন',
    invalidEmail_en: 'Enter a valid email',
    invalidMobile_bn: 'সঠিক মোবাইল নম্বর দিন',
    invalidMobile_en: 'Enter a valid mobile number',
    addressLong_bn: 'ঠিকানা সর্বোচ্চ ২০০ অক্ষর',
    addressLong_en: 'Address must be under 200 characters',
    invalidZip_bn: 'সঠিক পোস্ট কোড দিন',
    invalidZip_en: 'Enter a valid zip code',
    passwordShort_bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর',
    passwordShort_en: 'Password must be at least 6 characters',
    passwordMismatch_bn: 'পাসওয়ার্ড মিলছে না',
    passwordMismatch_en: 'Passwords do not match',

    registerSuccess_bn: 'অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।',
    registerSuccess_en: 'Account created! Now login.',

    emailInUse_bn: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে',
    emailInUse_en: 'An account already exists with this email',

    usernameInUse_bn: 'এই ইউজারনেম আগেই নেওয়া হয়েছে',
    usernameInUse_en: 'This username is already taken',

    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

    if (!formData.username.trim()) {
      newErrors.username = t('required');
    } else if (formData.username.trim().length < 3) {
      newErrors.username = t('usernameShort');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }

    if (!formData.country) {
      newErrors.country = t('required');
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = t('required');
    } else if (!/^\d{6,15}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = t('invalidMobile');
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

    if (!formData.password) {
      newErrors.password = t('required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordShort');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const cleanUsername = formData.username.trim().toLowerCase();
      const cleanEmail = formData.email.trim().toLowerCase();

      // Check username unique
      const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();

      if (existingUsername) {
        setErrors({ username: t('usernameInUse') });
        setIsLoading(false);
        return;
      }

      // Check email unique
      const { data: existingEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingEmail) {
        setErrors({ email: t('emailInUse') });
        setIsLoading(false);
        return;
      }

      // Supabase Auth signup
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            username: cleanUsername,
            country_code: formData.country,
            mobile: formData.mobile.trim(),
            address: formData.address.trim(),
            state: formData.state.trim(),
            city: formData.city.trim(),
            zip_code: formData.zipCode.trim(),
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);

        if (error.message.toLowerCase().includes('already registered')) {
          setErrors({ email: t('emailInUse') });
        } else {
          setToast({
            type: 'error',
            message: error.message || 'Registration failed',
          });
        }

        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setToast({
          type: 'error',
          message: isBn ? 'রেজিস্ট্রেশন ব্যর্থ' : 'Registration failed',
        });
        setIsLoading(false);
        return;
      }

      // Success — show toast then redirect
      setToast({
        type: 'success',
        message: t('registerSuccess'),
      });
      setIsLoading(false);

      // Sign out immediately
      await supabase.auth.signOut();

      // Redirect after 1.5s
      setTimeout(() => {
        window.location.href = `${prefix}/login?registered=true`;
      }, 1500);
    } catch (err: any) {
      console.error('Register exception:', err);
      setToast({
        type: 'error',
        message: err?.message || 'Registration failed',
      });
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-start sm:items-center justify-center px-4 py-4 sm:py-6 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] overflow-hidden">
      <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-[#1F7A3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#22C55E]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
          >
            <div
              className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border-2 backdrop-blur-sm ${
                toast.type === 'success'
                  ? 'bg-[#DCFCE7]/95 border-[#22C55E]/40'
                  : 'bg-red-50/95 border-red-300'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toast.type === 'success' ? 'bg-[#22C55E]' : 'bg-red-500'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 size={18} className="text-white" />
                ) : (
                  <AlertCircle size={18} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p
                  className={`text-sm font-semibold text-bangla-safe ${
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
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M9 3L3 9M3 3L9 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl z-10"
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

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Section 1: Personal Info */}
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1F7A3F] text-bangla-heading pt-0.5 pb-2 mb-3 flex items-center gap-2 border-b border-[#1F7A3F]/20">
              <User size={14} className="text-[#1F7A3F]" />
              {t('sectionPersonal')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* First Name */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('firstNameLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <User size={14} className="sm:hidden" />
                    <User size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder={t('firstNamePh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.firstName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('lastNameLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <User size={14} className="sm:hidden" />
                    <User size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder={t('lastNamePh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.lastName
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="w-full min-w-0 sm:col-span-2">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('usernameLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <User size={14} className="sm:hidden" />
                    <User size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder={t('usernamePh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.username
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full min-w-0 sm:col-span-2">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('emailLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Mail size={14} className="sm:hidden" />
                    <Mail size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder={t('emailPh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="w-full min-w-0 sm:col-span-2">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('mobileLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex">
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-l-lg border border-r-0 border-[#E5E7EB] bg-[#F8FAF9] text-[#1F2937] font-semibold text-[11px] sm:text-sm min-w-[70px] sm:min-w-[90px]">
                    <Phone size={12} className="text-[#1F7A3F] sm:hidden" />
                    <Phone size={14} className="text-[#1F7A3F] hidden sm:block" />
                    <span>{formData.country}</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleChange(
                        'mobile',
                        e.target.value.replace(/[^\d\s-]/g, '')
                      )
                    }
                    placeholder={t('mobilePh')}
                    disabled={isLoading}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-r-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.mobile
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.mobile}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1F7A3F] text-bangla-heading pt-0.5 pb-2 mb-3 flex items-center gap-2 border-b border-[#1F7A3F]/20">
              <MapPin size={14} className="text-[#1F7A3F]" />
              {t('sectionLocation')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Country */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('countryLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none z-10">
                    <Globe size={14} className="sm:hidden" />
                    <Globe size={16} className="hidden sm:block" />
                  </div>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] text-bangla-safe focus:outline-none focus:ring-2 appearance-none cursor-pointer disabled:opacity-60 ${
                      errors.country
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {isBn ? c.name_bn : c.name_en} ({c.code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
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
                {errors.country && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.country}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('stateLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Building2 size={14} className="sm:hidden" />
                    <Building2 size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder={t('statePh')}
                    disabled={isLoading}
                    className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* City */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('cityLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Home size={14} className="sm:hidden" />
                    <Home size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder={t('cityPh')}
                    disabled={isLoading}
                    className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('zipCodeLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Hash size={14} className="sm:hidden" />
                    <Hash size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleChange(
                        'zipCode',
                        e.target.value.replace(/[^\d]/g, '')
                      )
                    }
                    placeholder={t('zipCodePh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.zipCode
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.zipCode && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.zipCode}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="w-full min-w-0 sm:col-span-2">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('addressLabel')}
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-[#9CA3AF] pointer-events-none">
                    <MapPin size={14} className="sm:hidden" />
                    <MapPin size={16} className="hidden sm:block" />
                  </div>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder={t('addressPh')}
                    rows={3}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 resize-none disabled:opacity-60 ${
                      errors.address
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  {errors.address ? (
                    <p className="text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                      <AlertCircle size={10} />
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
          </div>

          {/* Section 3: Security */}
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#1F7A3F] text-bangla-heading pt-0.5 pb-2 mb-3 flex items-center gap-2 border-b border-[#1F7A3F]/20">
              <Lock size={14} className="text-[#1F7A3F]" />
              {t('sectionSecurity')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('passwordLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Lock size={14} className="sm:hidden" />
                    <Lock size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder={t('passwordPh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
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

              {/* Confirm Password */}
              <div className="w-full min-w-0">
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1F2937] mb-1 text-bangla-safe">
                  {t('confirmPasswordLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Lock size={14} className="sm:hidden" />
                    <Lock size={16} className="hidden sm:block" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange('confirmPassword', e.target.value)
                    }
                    placeholder={t('confirmPasswordPh')}
                    disabled={isLoading}
                    className={`w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 bg-white text-[13px] sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.confirmPassword
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
                    aria-label="Toggle password"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={14} className="sm:hidden" />
                    ) : (
                      <Eye size={14} className="sm:hidden" />
                    )}
                    {showConfirmPassword ? (
                      <EyeOff size={16} className="hidden sm:block" />
                    ) : (
                      <Eye size={16} className="hidden sm:block" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-0.5 text-[10px] sm:text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={10} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-white text-[13px] sm:text-base bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin sm:hidden" />
                <Loader2 size={16} className="animate-spin hidden sm:block" />
                <span className="text-bangla-safe">{t('loading')}</span>
              </>
            ) : (
              <>
                <span className="text-bangla-safe">{t('registerBtn')}</span>
                <ArrowRight size={14} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-[11px] sm:text-sm text-[#6B7280] pt-1 text-bangla-safe leading-tight">
            {t('haveAccount')}{' '}
            <Link
              href={`${prefix}/login`}
              className="text-[#1F7A3F] hover:text-[#155E30] font-bold transition-colors"
            >
              {t('signIn')}
            </Link>
          </p>
        </form>

        <p className="text-center text-[10px] sm:text-xs text-[#9CA3AF] mt-4 text-bangla-safe">
          © {new Date().getFullYear()} Zarif Land Care Center
        </p>
      </motion.div>
    </section>
  );
}