'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LogIn, 
  Home, 
  Wrench, 
  FileText, 
  Phone, 
  Info 
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ============================================
  // Scroll Detect (Sticky effect)
  // ============================================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================
  // Menu বন্ধ করো pathname পরিবর্তন হলে
  // ============================================
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // ============================================
  // Menu খোলা থাকলে body scroll বন্ধ
  // ============================================
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

  // ============================================
  // Menu Items (আইকন সহ)
  // ============================================
  const menuItems = [
    {
      name: t('home'),
      href: `/${locale === 'bn' ? '' : locale}`,
      icon: Home,
    },
    {
      name: t('services'),
      href: `/${locale === 'bn' ? '' : locale + '/'}services`,
      icon: Wrench,
    },
    {
      name: t('blog'),
      href: `/${locale === 'bn' ? '' : locale + '/'}blog`,
      icon: FileText,
    },
    {
      name: t('contact'),
      href: `/${locale === 'bn' ? '' : locale + '/'}contact`,
      icon: Phone,
    },
    {
      name: t('about'),
      href: `/${locale === 'bn' ? '' : locale + '/'}about`,
      icon: Info,
    },
  ];

  // ============================================
  // Active Link চেক
  // ============================================
  const isActive = (href: string) => {
    if (href === '/' || href === '/en') {
      return pathname === '/' || pathname === '/en';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
                  ${
                    isScrolled
                      ? 'bg-navy/95 backdrop-blur-md shadow-lg border-b border-navy-border'
                      : 'bg-navy border-b border-navy-border'
                  }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* ============================================
              LOGO (Left)
              ============================================ */}
          <Link
            href={`/${locale === 'bn' ? '' : locale}`}
            className="flex items-center gap-2 group z-50"
          >
            <span className="text-xl lg:text-2xl font-bold text-gold 
                            group-hover:text-gold-light transition-colors">
              ZARIF
            </span>
            <span className="hidden sm:inline text-xs lg:text-sm 
                            text-muted font-medium tracking-wider">
              LANDCARE CENTER
            </span>
          </Link>

          {/* ============================================
              DESKTOP MENU (Center) - আইকন সহ
              ============================================ */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 
                              px-4 py-2 rounded-lg text-sm font-medium
                              transition-all duration-200
                              ${
                                active
                                  ? 'text-gold'
                                  : 'text-gray-300 hover:text-gold hover:bg-navy-dark'
                              }`}
                >
                  <Icon size={16} strokeWidth={2} />
                  <span>{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ============================================
              RIGHT SIDE
              ============================================ */}
          <div className="flex items-center gap-2 lg:gap-3 z-50">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Login Button (Desktop) */}
            <Link
              href={`/${locale === 'bn' ? '' : locale + '/'}login`}
              className="hidden lg:inline-flex items-center gap-2 
                         px-5 py-2.5 rounded-lg
                         bg-gradient-to-r from-gold to-gold-light
                         text-navy font-semibold text-sm
                         shadow-lg shadow-gold/20
                         transition-all duration-200
                         hover:shadow-xl hover:shadow-gold/30 hover:scale-105"
            >
              <LogIn size={16} />
              {t('login')}
            </Link>

            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 
                         hover:text-gold hover:bg-navy-dark 
                         transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          MOBILE MENU (আইকন সহ)
          ============================================ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden absolute top-full left-0 right-0 
                         bg-navy-dark border-t border-b border-navy-border
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
                                    px-4 py-3 rounded-lg text-base font-medium
                                    transition-all duration-200
                                    ${
                                      active
                                        ? 'bg-gold/10 text-gold border-l-4 border-gold'
                                        : 'text-gray-300 hover:text-gold hover:bg-navy'
                                    }`}
                      >
                        <Icon size={20} strokeWidth={2} />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Login Button (Mobile) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05 + 0.1 }}
                  className="mt-4 pt-4 border-t border-navy-border"
                >
                  <Link
                    href={`/${locale === 'bn' ? '' : locale + '/'}login`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 
                               w-full px-6 py-3 rounded-lg
                               bg-gradient-to-r from-gold to-gold-light
                               text-navy font-semibold
                               shadow-lg shadow-gold/20
                               transition-all duration-200
                               hover:shadow-xl hover:scale-105"
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