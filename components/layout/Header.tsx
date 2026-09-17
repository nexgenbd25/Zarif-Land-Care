'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, Phone } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const LOGO_URL = 'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
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
      href: `/${locale === 'bn' ? '' : locale}`,
    },
    {
      name: t('services'),
      href: `/${locale === 'bn' ? '' : locale + '/'}services`,
    },
    {
      name: t('blog'),
      href: `/${locale === 'bn' ? '' : locale + '/'}blog`,
    },
    {
      name: t('contact'),
      href: `/${locale === 'bn' ? '' : locale + '/'}contact`,
    },
    {
      name: t('about'),
      href: `/${locale === 'bn' ? '' : locale + '/'}about`,
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
      className={`sticky top-0 z-50 transition-all duration-300
                  bg-white border-b border-neutral-light
                  ${isScrolled ? 'shadow-md' : ''}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          <Link
            href={`/${locale === 'bn' ? '' : locale}`}
            className="flex items-center gap-3 group z-50"
          >
            <Image
              src={LOGO_URL}
              alt="Zarif Landcare Center"
              width={200}
              height={60}
              priority
              unoptimized
              className="h-10 sm:h-11 lg:h-12 w-auto object-contain 
                         transition-transform duration-300 
                         group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div className="text-brand font-bold text-sm lg:text-base leading-tight">
                জারিফ ল্যান্ড কেয়ার
              </div>
              <div className="text-neutral-muted text-[10px] lg:text-xs leading-tight">
                Landcare Center
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold
                              transition-all duration-200
                              ${
                                active
                                  ? 'text-brand'
                                  : 'text-neutral-dark hover:text-brand'
                              }`}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 lg:gap-3 z-50">
            <LanguageSwitcher />

            <a
              href="tel:+8801788766735"
              className="hidden lg:inline-flex items-center gap-2 
                         px-4 py-2.5 rounded-lg
                         bg-brand text-white font-semibold text-sm
                         shadow-md shadow-brand/20
                         transition-all duration-200
                         hover:bg-brand-dark hover:shadow-lg hover:scale-105"
            >
              <Phone size={16} />
              <span className="hidden xl:inline">
                {locale === 'bn' ? 'কল করুন' : 'Call Now'}
              </span>
              <span className="xl:hidden">
                {locale === 'bn' ? 'কল' : 'Call'}
              </span>
            </a>

            <Link
              href={`/${locale === 'bn' ? '' : locale + '/'}login`}
              className="hidden lg:inline-flex items-center gap-2 
                         px-4 py-2.5 rounded-lg
                         border-2 border-brand text-brand font-semibold text-sm
                         bg-white
                         transition-all duration-200
                         hover:bg-brand hover:text-white"
            >
              <LogIn size={16} />
              {t('login')}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-dark 
                         hover:text-brand hover:bg-brand/5 
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
              className="lg:hidden fixed inset-0 top-16 sm:top-18 bg-black/40 backdrop-blur-sm z-40"
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
                        className={`flex items-center px-4 py-3 rounded-lg 
                                    text-base font-medium
                                    transition-all duration-200
                                    ${
                                      active
                                        ? 'bg-brand/10 text-brand border-l-4 border-brand'
                                        : 'text-neutral-dark hover:text-brand hover:bg-brand/5'
                                    }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05 + 0.1 }}
                  className="mt-4 pt-4 border-t border-neutral-light flex flex-col gap-3"
                >
                  <a
                    href="tel:+8801788766735"
                    className="flex items-center justify-center gap-2 
                               w-full px-6 py-3 rounded-lg
                               bg-brand text-white font-semibold
                               shadow-lg shadow-brand/20
                               transition-all duration-200
                               hover:bg-brand-dark hover:scale-105"
                  >
                    <Phone size={18} />
                    {locale === 'bn' ? 'কল করুন: 01788766735' : 'Call: 01788766735'}
                  </a>

                  <Link
                    href={`/${locale === 'bn' ? '' : locale + '/'}login`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 
                               w-full px-6 py-3 rounded-lg
                               border-2 border-brand text-brand
                               font-semibold
                               transition-all duration-200
                               hover:bg-brand hover:text-white"
                  >
                    <LogIn size={18} />
                    {t('login')}
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
