'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Wrench, FileText, Phone, Info } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const LOGO_URL = 'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const isBn = locale === 'bn';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuItems = [
    {
      name: t('home'),
      href: `/${isBn ? '' : locale}`,
      icon: Home,
    },
    {
      name: t('services'),
      href: `/${isBn ? '' : locale + '/'}services`,
      icon: Wrench,
    },
    {
      name: t('blog'),
      href: `/${isBn ? '' : locale + '/'}blog`,
      icon: FileText,
    },
    {
      name: t('contact'),
      href: `/${isBn ? '' : locale + '/'}contact`,
      icon: Phone,
    },
    {
      name: t('about'),
      href: `/${isBn ? '' : locale + '/'}about`,
      icon: Info,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/' || href === '/en') {
      return pathname === '/' || pathname === '/en';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300
                  border-b border-neutral-light
                  ${isScrolled ? 'shadow-md' : ''}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          <Link
            href={`/${isBn ? '' : locale}`}
            className="flex items-center gap-2 group z-50 shrink-0"
          >
            <Image
              src={LOGO_URL}
              alt="Zarif Landcare Center"
              width={220}
              height={60}
              priority
              unoptimized
              className="h-10 sm:h-11 lg:h-12 w-auto object-contain 
                         transition-transform duration-300 
                         group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div
                className="text-[#1F7A3F] font-bold text-xs lg:text-sm 
                           leading-tight text-bangla-safe"
              >
                {isBn ? 'জারিফ ল্যান্ড কেয়ার' : 'Zarif Landcare'}
              </div>
              <div
                className="text-black text-[10px] lg:text-xs 
                           leading-tight font-medium text-bangla-safe"
              >
                {isBn ? 'এন্ড ডিজিটাল সেবা' : '& Digital Services'}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 
                              px-4 py-2 rounded-md text-sm font-semibold
                              transition-all duration-200
                              ${
                                active
                                  ? 'text-[#1F7A3F]'
                                  : 'text-black hover:text-[#1F7A3F]'
                              }`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  <span>{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 
                                 bg-[#1F7A3F] rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 lg:gap-4 z-50">
            <LanguageSwitcher />

            <a
              href="tel:+8801788766735"
              className="hidden lg:flex items-center gap-2 
                         text-[#1F7A3F] font-bold text-sm
                         hover:text-[#155E30] transition-colors"
            >
              <Phone size={16} strokeWidth={2.2} />
              <span className="whitespace-nowrap">+8801788-766735</span>
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-black 
                         hover:text-[#1F7A3F] hover:bg-[#1F7A3F]/5 
                         transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 top-16 sm:top-18 
                         bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden absolute top-full left-0 right-0 
                         bg-white border-t border-b border-neutral-light
                         shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <nav className="container-custom py-6 flex flex-col gap-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 
                                    px-4 py-3 rounded-md text-base font-medium
                                    transition-all duration-200
                                    ${
                                      active
                                        ? 'bg-[#1F7A3F]/10 text-[#1F7A3F] border-l-4 border-[#1F7A3F]'
                                        : 'text-black hover:text-[#1F7A3F] hover:bg-[#1F7A3F]/5'
                                    }`}
                      >
                        <Icon size={20} strokeWidth={2.2} />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05 + 0.1 }}
                  className="mt-4 pt-4 border-t border-neutral-light"
                >
                  <a
                    href="tel:+8801788766735"
                    className="flex items-center justify-center gap-2 
                               w-full px-6 py-3 rounded-md
                               text-[#1F7A3F] font-bold text-base
                               border-2 border-[#1F7A3F]
                               hover:bg-[#1F7A3F] hover:text-white
                               transition-all duration-200"
                  >
                    <Phone size={20} strokeWidth={2.2} />
                    +8801788-766735
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
