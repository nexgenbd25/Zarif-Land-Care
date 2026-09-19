'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  listFactors,
  challengeAndVerify,
} from '@/lib/supabase/mfa';

const LOGO_URL =
  'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

function LoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 🎯 MFA State
  const [mfaStep, setMfaStep] = useState<'idle' | 'challenge'>('idle');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [pendingRole, setPendingRole] = useState<string | null>(null);

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
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    passwordShort_bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর',
    passwordShort_en: 'Password must be at least 6 characters',
    loginSuccess_bn: 'সফলভাবে লগইন হয়েছে!',
    loginSuccess_en: 'Logged in successfully!',
    loginFailed_bn: 'ভুল ইউজারনেম/ইমেইল অথবা পাসওয়ার্ড',
    loginFailed_en: 'Invalid username/email or password',
    emailNotConfirmed_bn: 'ইমেইল কনফার্ম করা হয়নি। ইনবক্স চেক করুন।',
    emailNotConfirmed_en: 'Email not confirmed. Check your inbox.',
    registerSuccess_bn: 'অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।',
    registerSuccess_en: 'Account created! Now login.',
    loading_bn: 'অপেক্ষা করুন...',
    loading_en: 'Please wait...',
    or_bn: 'অথবা',
    or_en: 'OR',
    mfaTitle_bn: '২-ধাপ যাচাইকরণ',
    mfaTitle_en: 'Two-Factor Authentication',
    mfaSub_bn:
      'Google Authenticator অ্যাপ থেকে ৬ ডিজিটের কোড লিখুন',
    mfaSub_en: 'Enter 6-digit code from Google Authenticator',
    mfaCodeLabel_bn: 'কোড লিখুন',
    mfaCodeLabel_en: 'Enter Code',
    mfaVerify_bn: 'যাচাই করুন',
    mfaVerify_en: 'Verify',
    mfaVerifying_bn: 'যাচাই হচ্ছে...',
    mfaVerifying_en: 'Verifying...',
    mfaBack_bn: 'ফিরে যান',
    mfaBack_en: 'Back',
    mfaInvalid_bn: 'ভুল কোড। আবার চেষ্টা করুন।',
    mfaInvalid_en: 'Invalid code. Try again.',
    m
