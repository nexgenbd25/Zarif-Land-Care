'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, MessageCircle, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';
import CountUpNumber from '@/components/ui/CountUp';
import AnimatedBackground from './AnimatedBackground';

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();

  // ============================================
  // URL Helper
  // ============================================
  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  // ============================================
  // Framer Motion Variants
  // ============================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  // WhatsApp
  const whatsappNumber = '+8801788766735';
  const whatsappMessage = encodeURIComponent('আসসালামু আলাইকুম, আমি দলিল সেবা নিতে চাই।');

  return (
    <section className="relative overflow-hidden bg-gradient-navy section-padding">
      {/* ============================================
          ANIMATED BACKGROUND
          ============================================ */}
      <AnimatedBackground />

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 xl:gap-16">
          {/* ============================================
              LEFT COLUMN: Text
              ============================================ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 
                              px-4 py-2 rounded-full
                              bg-gold/10 border border-gold/30
                              text-gold text-xs sm:text-sm font-medium
                              backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-bangla-safe">⭐ ২০০৫ সাল থেকে বিশ্বস্ত প্রতিষ্ঠান</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="heading-1 mb-6 text-bangla-safe"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-muted text-base sm:text-lg mb-8 leading-[1.9] 
                         max-w-2xl mx-auto lg:mx-0 text-bangla-safe"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* ============================================
                CTA Buttons (3টি)
                ============================================ */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 
                         justify-center lg:justify-start mb-6"
            >
              {/* Primary CTA - Call */}
              <Link
                href={getUrl('/contact')}
                className="btn-primary group"
              >
                <Phone size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-bangla-safe">{t('hero.cta1')}</span>
              </Link>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2
                           px-6 py-3.5 rounded-lg font-semibold
                           bg-gradient-to-r from-green-600 to-green-700
                           text-white shadow-lg shadow-green-600/20
                           transition-all duration-300
                           hover:shadow-xl hover:scale-105
                           active:scale-95
                           w-full sm:w-auto
                           leading-[1.7] pt-[0.9rem] pb-[0.7rem]"
              >
                <MessageCircle size={18} />
                <span className="text-bangla-safe">WhatsApp</span>
              </a>
            </motion.div>

            {/* Secondary CTA - Services */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link
                href={getUrl('/services')}
                className="inline-flex items-center gap-2 
                           text-gold hover:text-gold-light 
                           transition-colors text-sm font-medium 
                           group underline-offset-4 hover:underline"
              >
                <span className="text-bangla-safe">{t('hero.cta2')}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

            {/* ============================================
                Trust Indicators - Desktop (Animated Count)
                ============================================ */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex items-center gap-8 mt-10 pt-8 
                         border-t border-navy-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 
                                border border-gold/30 flex items-center justify-center">
                  <FileText size={22} className="text-gold" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gold">
                    <CountUpNumber end={1000} suffix="+" duration={2.5} />
                  </div>
                  <div className="text-xs text-muted text-bangla-safe">
                    দলিল সম্পন্ন
                  </div>
                </div>
              </div>

              <div className="w-px h-12 bg-navy-border" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 
                                border border-gold/30 flex items-center justify-center">
                  <Users size={22} className="text-gold" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gold">
                    <CountUpNumber end={500} suffix="+" duration={2.5} delay={0.3} />
                  </div>
                  <div className="text-xs text-muted text-bangla-safe">
                    সন্তুষ্ট ক্লায়েন্ট
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ============================================
              RIGHT COLUMN: Carousel
              ============================================ */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <HeroCarousel />
          </motion.div>
        </div>

        {/* ============================================
            Trust Indicators - Mobile
            ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:hidden flex items-center justify-center gap-4 sm:gap-8 mt-12 pt-8 
                     border-t border-navy-border"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gold/10 
                            border border-gold/30 flex items-center justify-center">
              <FileText size={24} className="text-gold" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">
                <CountUpNumber end={1000} suffix="+" duration={2.5} />
              </div>
              <div className="text-xs text-muted text-bangla-safe">
                দলিল সম্পন্ন
              </div>
            </div>
          </div>

          <div className="w-px h-16 bg-navy-border" />

          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gold/10 
                            border border-gold/30 flex items-center justify-center">
              <Users size={24} className="text-gold" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">
                <CountUpNumber end={500} suffix="+" duration={2.5} delay={0.3} />
              </div>
              <div className="text-xs text-muted text-bangla-safe">
                সন্তুষ্ট ক্লায়েন্ট
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}