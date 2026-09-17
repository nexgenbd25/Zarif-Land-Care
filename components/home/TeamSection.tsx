'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, MapPin, User, BadgeCheck } from 'lucide-react';

interface TeamMember {
  id: number;
  name_bn: string;
  name_en: string;
  designation_bn: string;
  designation_en: string;
  father_bn: string;
  father_en: string;
  address_bn: string;
  address_en: string;
  phone: string;
  image_url: string;
}

const TEAM: TeamMember[] = [
  {
    id: 1,
    name_bn: 'মোঃ জাহিদুল ইসলাম',
    name_en: 'Md. Zahidul Islam',
    designation_bn: 'সরকারী লাইসেন্স প্রাপ্ত দলিল লেখক',
    designation_en: 'Government Licensed Deed Writer',
    father_bn: 'মোঃ জহিরুল ইসলাম',
    father_en: 'Md. Zahirul Islam',
    address_bn: 'গ্রামঃ বড়াইল, ডাকঘরঃ স্বর্ণগ্রাম, থানাঃ টংগীবাড়ী, জেলাঃ মুন্সিগঞ্জ।',
    address_en: 'Village: Borail, Post: Swarnagram, Thana: Tongibari, District: Munshiganj.',
    phone: '+880 1788-766735',
    image_url: 'https://i.postimg.cc/wx0q1tz9/20260917-044318.jpg',
  },
  {
    id: 2,
    name_bn: 'মোঃ সেলিম',
    name_en: 'Md. Selim',
    designation_bn: 'দলিল লেখক সহকারী ও আমিন (সার্ভেয়ার)',
    designation_en: 'Deed Writer Assistant & Amin (Surveyor)',
    father_bn: 'মোঃ ইউনুছ আলী বেপারী (আমিন)',
    father_en: 'Md. Yunus Ali Bepari (Amin)',
    address_bn: 'বানারী, হাসাইল, টংগীবাড়ী, মুন্সিগঞ্জ।',
    address_en: 'Banari, Hasail, Tongibari, Munshiganj.',
    phone: '+880 1627-660841',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    id: 3,
    name_bn: 'মোঃ সাব্বির শেখ',
    name_en: 'Md. Sabbir Sheikh',
    designation_bn: 'দলিল লেখক সহকারী',
    designation_en: 'Deed Writer Assistant',
    father_bn: 'মোঃ দেলোয়ার হোসেন শেখ',
    father_en: 'Md. Delwar Hossain Sheikh',
    address_bn: 'হাসাইল, টংগীবাড়ী, মুন্সিগঞ্জ।',
    address_en: 'Hasail, Tongibari, Munshiganj.',
    phone: '+880 1829-784457',
    image_url:
