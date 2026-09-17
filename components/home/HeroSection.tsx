'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Users } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-gradient-navy
                        pt-4 pb-8 sm:pt-8 sm:pb-12 lg:py-20
                        border-b border-navy-border">
      <AnimatedBackground />

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-8 lg:gap-12 xl:gap-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 
                         font-bold text-white mb-3 sm:mb-5 lg:mb-6
                         leading-[1.4] pt-[0.15em] pb-[0.05em]
                         text-bangla-safe"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-muted text-sm sm:text-base lg:text-lg 
                         mb-5 sm:mb-7 lg:mb-8 leading-[1.85] 
                         max-w-2xl mx-auto lg:mx-0 text-bangla-safe"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 
                         justify-center lg:justify-start"
            >
              <Link
                href={getUrl('/contact')}
                className="inline-flex items-center justify-center gap-2
                           px-6 py-3 sm:py-3.5 rounded-lg font-semibold
                           bg-gradient-to-r from-brand-orange to-brand-red
                           text-white shadow-lg
                           transition-all duration-300
                           hover:shadow-xl hover:scale-105
                           active:scale-95
                           w-full sm:w-auto
                           leading-[1.7] pt-[0.8rem] pb-[0.6rem]
                           text-sm sm:text-base group"
              >
                <span className="text-bangla-safe">{t('hero.cta1')}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href={getUrl('/services')}
                className="inline-flex items-center justify-center gap-2
                           px-6 py-3 sm:py-3.5 rounded-lg font-semibold
                           border-2 border-gold text-gold
                           bg-transparent
                           transition-all duration-300
                           hover:bg-gold hover:text-navy
                           active:scale-95
                           w-full sm:w-auto
                           leading-[1.7] pt-[0.8rem] pb-[0.6rem]
                           text-sm sm:text-base group"
              >
                <span className="text-bangla-safe">{t('hero.cta2')}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

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

          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <HeroCarousel />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="lg:hidden flex items-center justify-center gap-4 mt-6 pt-5 
                     border-t border-navy-border"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-gold/10 
                            border border-gold/30 flex items-center justify-center">
              <FileText size={20} className="text-gold" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-gold leading-tight">
                <CountUpNumber end={1000} suffix="+" duration={2} />
              </div>
              <div className="text-[11px] text-muted text-bangla-safe leading-tight">
                দলিল সম্পন্ন
              </div>
            </div>
          </div>

          <div className="w-px h-10 bg-navy-border" />

          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-gold/10 
                            border border-gold/30 flex items-center justify-center">
              <Users size={20} className="text-gold" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-gold leading-tight">
                <CountUpNumber end={500} suffix="+" duration={2} delay={0.2} />
              </div>
              <div className="text-[11px] text-muted text-bangla-safe leading-tight">
                সন্তুষ্ট ক্লায়েন্ট
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}