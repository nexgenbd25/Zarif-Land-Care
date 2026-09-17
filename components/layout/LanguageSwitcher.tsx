'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Loader2, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const switchLanguage = (newLocale: 'bn' | 'en') => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    let newPath: string;
    const pathWithoutLocale = pathname.replace(/^\/(bn|en)/, '') || '/';

    if (newLocale === 'bn') {
      newPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
    } else {
      newPath = pathWithoutLocale === '/' ? '/en' : `/en${pathWithoutLocale}`;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    }

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
                   bg-white border border-[#E5E7EB]
                   text-[#1F2937] font-medium
                   hover:border-[#1F7A3F] hover:text-[#1F7A3F] hover:bg-[#F8FAF9]
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-[#1F7A3F]/20
                   disabled:opacity-50 disabled:cursor-wait
                   shadow-sm"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin text-[#1F7A3F]" />
        ) : (
          <Globe size={18} className="text-[#1F7A3F]" />
        )}
        <span className="hidden sm:inline text-sm">
          {currentLanguage?.label}
        </span>
        <ChevronDown
          size={14}
          className={`hidden sm:block transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 z-[100]
                       bg-white border border-[#E5E7EB]
                       rounded-lg shadow-2xl overflow-hidden
                       ring-1 ring-black/5"
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
                                ? 'bg-[#1F7A3F]/10 text-[#1F7A3F] font-semibold'
                                : 'text-[#1F2937] hover:bg-[#F8FAF9] hover:text-[#1F7A3F]'
                            }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {locale === lang.code && (
                  <Check size={16} className="text-[#1F7A3F]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
