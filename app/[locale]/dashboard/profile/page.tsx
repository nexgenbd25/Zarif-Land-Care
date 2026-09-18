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
  Shield,
  MapPin,
  Building2,
  Hash,
  Home,
  Lock,
  AtSign,
  Calendar,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, saveDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../DashboardLayout';

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

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
    setFormData({
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      username: currentUser.username || '',
      email: currentUser.email || '',
      country: currentUser.country || '+880',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      state: currentUser.state || '',
      city: currentUser.city || '',
      zipCode: currentUser.zipCode || '',
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
    sectionPersonal_bn: 'ব্যক্তিগত তথ্য',
    sectionPersonal_en: 'Personal Information',
    sectionLocation_bn: 'ঠিকানা',
    sectionLocation_en: 'Location',
    sectionAccount_bn: 'অ্যাকাউন্ট তথ্য',
    sectionAccount_en: 'Account Information',

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

    memberSince_bn: 'যোগদানের তারিখ',
    memberSince_en: 'Member Since',
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
    setSuccess('');
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      if (user) {
        const updatedUser: DemoUser = {
          ...user,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          // 🎯 Username change hobe na (read-only)
          username: user.username,
          // 🎯 Email lowercase
          email: formData.email.trim().toLowerCase(),
          country: formData.country,
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          city: formData.city,
          zipCode: formData.zipCode,
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

  // 🎯 Full Name
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const displayName = fullName || user.username;
  const avatarLetter = (user.firstName || user.username || 'U')
    .charAt(0)
    .toUpperCase();

  // 🎯 Username lowercase
  const displayUsername = (user.username || '')
    .toLowerCase()
    .replace(/\s+/g, '');

  // 🎯 Email lowercase
  const displayEmail = (user.email || '').toLowerCase();

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

        {/* Avatar Card — 3 line format */}
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
              {/* Line 1: Full Name */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1">
                {displayName}
              </h2>
              {/* Line 2: Username (lowercase) */}
              <p className="text-sm text-[#1F7A3F] font-semibold text-bangla-safe break-all mb-1">
                {displayUsername}
              </p>
              {/* Line 3: Email (lowercase) */}
              <p className="text-sm text-[#6B7280] text-bangla-safe break-all mb-2">
                {displayEmail}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                  <Shield size={10} />
                  {t('active')}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1F7A3F]/10 text-[#1F7A3F] text-[10px] font-bold">
                  <Calendar size={10} />
                  {memberDate}
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
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
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
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
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
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20"
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
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20"
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
                      handleChange(
                        'zipCode',
                        e.target.value.replace(/[^\d]/g, '')
                      )
                    }
                    placeholder={t('zipCodePh')}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
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

              {/* Address — Full width */}
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
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 resize-none ${
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

            {/* Section 3: Account Info — User ID nei */}
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <Shield size={16} className="text-[#1F7A3F]" />
              {t('sectionAccount')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
