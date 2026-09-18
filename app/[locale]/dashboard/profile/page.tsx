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
