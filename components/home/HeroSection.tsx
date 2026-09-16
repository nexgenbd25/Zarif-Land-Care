'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';
import CountUpNumber from '@/components/ui/CountUp';
import AnimatedBackground from './AnimatedBackground';

export default function HeroSection() {
  const t = useTranslations();
  const locale = useLocale();

  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  // ============================================
  // Faster, Simpler Animations
  // ============================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-navy section-padding">
      {/* Animated Background */}
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

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 
                         justify-center lg:justify-start"
            >
              <Link
                href={getUrl('/contact')}
                className="btn-primary group"
              >
                <Phone size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-bangla-safe">{t('hero.cta1')}</span>
              </Link>

              <Link
                href={getUrl('/services')}
                className="btn-secondary group"
              >
                <span className="text-bangla-safe">{t('hero.cta2')}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

            {/* Trust Indicators - Desktop */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex items-center gap-8 mt-12 pt-8 
                         border-t border-navy-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 
                                border border-gold/30 flex items-center justify-center">
                  <FileText size={22} className="text-gold" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gold">
                    <CountUpNumber end={1000} suffix="+" duration={2} />
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
                    <CountUpNumber end={500} suffix="+" duration={2} delay={0.2} />
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

        {/* Trust Indicators - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
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
                <CountUpNumber end={1000} suffix="+" duration={2} />
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
                <CountUpNumber end={500} suffix="+" duration={2} delay={0.2} />
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