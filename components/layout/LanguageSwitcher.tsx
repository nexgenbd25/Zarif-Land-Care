'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Loader2 } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
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
  // ভাষা পরিবর্তন (Improved Logic)
  // ============================================
  const switchLanguage = (newLocale: 'bn' | 'en') => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // ============================================
    // নতুন URL তৈরি করুন
    // ============================================
    let newPath: string;

    // বর্তমান pathname থেকে locale অংশ সরান
    // যেমন: /en/services → /services
    //       /en → /
    const pathWithoutLocale = pathname.replace(/^\/(bn|en)/, '') || '/';

    // নতুন locale অনুযায়ী URL তৈরি করুন
    if (newLocale === 'bn') {
      // বাংলা: কোনো prefix নেই
      newPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
    } else {
      // ইংরেজি: /en prefix
      newPath = pathWithoutLocale === '/' ? '/en' : `/en${pathWithoutLocale}`;
    }

    // localStorage এ সেভ করুন
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    }

    // Navigate with transition
    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
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
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   text-gray-300 hover:text-gold hover:bg-navy-dark
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-gold/20
                   disabled:opacity-50 disabled:cursor-wait"
        aria-label="Change language"
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Globe size={18} />
        )}
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