'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================
  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // ভাষা পরিবর্তন
  // ============================================
  const switchLanguage = (newLocale: 'bn' | 'en') => {
    setIsOpen(false);

    // URL থেকে বর্তমান locale মুছে ফেলুন
    let newPath = pathname;

    // যদি /en দিয়ে শুরু হয়, সেটি মুছে ফেলুন
    if (newPath.startsWith('/en')) {
      newPath = newPath.replace('/en', '') || '/';
    }

    // নতুন locale অনুযায়ী URL তৈরি করুন
    if (newLocale === 'en') {
      newPath = `/en${newPath === '/' ? '' : newPath}`;
    }

    // localStorage এ সেভ করুন
    localStorage.setItem('preferred-locale', newLocale);

    // Navigate
    router.push(newPath);
    router.refresh();
  };

  const languages = [
    { code: 'bn' as const, label: 'বাংলা', flag: '🇧🇩' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   text-gray-300 hover:text-gold hover:bg-navy-dark
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-gold/20"
        aria-label="Change language"
      >
        <Globe size={18} />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage?.label}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 z-50
                       bg-navy-dark border border-navy-border
                       rounded-lg shadow-xl overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center justify-between gap-3
                            px-4 py-3 text-left text-sm
                            transition-colors duration-150
                            ${
                              locale === lang.code
                                ? 'bg-gold/10 text-gold font-semibold'
                                : 'text-gray-300 hover:bg-navy hover:text-white'
                            }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {locale === lang.code && (
                  <Check size={16} className="text-gold" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}