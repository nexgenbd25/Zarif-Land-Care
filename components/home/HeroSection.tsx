'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, FileText, Monitor, Printer, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HERO_BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80';

const FEATURES = [
  {
    id: 1,
    title_bn: 'জমি রেজিস্ট্রি ও দলিল লেখন',
    title_en: 'Land Registry & Deed Writing',
    icon: FileText,
  },
  {
    id: 2,
    title_bn: 'কম্পিউটার কম্পোজ ও অনলাইন আবেদন',
    title_en: 'Computer Compose & Online Application',
    icon: Monitor,
  },
  {
    id: 3,
    title_bn: 'ল্যাব প্রিন্ট, পাসপোর্ট ছবি',
    title_en: 'Lab Print, Passport Photo',
    icon: Printer,
  },
  {
    id: 4,
    title_bn: 'মোবাইল ব্যাংকিং (বিকাশ, রকেট, নগদ)',
    title_en: 'Mobile Banking (bKash, Rocket, Nagad)',
    icon: Smartphone,
  },
];

export default function HeroSection() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  const content = {
    headline_bn:
      'একই ছাদের নিচে জমির নির্ভুল দলিল লেখন ও আধুনিক ডিজিটাল সেবা',
    headline_en:
      'Accurate Land Deed Writing & Modern Digital Services Under One Roof',
    cta1_bn: 'যোগাযোগ করুন',
    cta1_en: 'Contact Us',
    cta2_bn: 'কল করুন',
    cta2_en: 'Call Now',
  };

  const headline = isBn ? content.headline_bn : content.headline_en;
  const cta1 = isBn ? content.cta1_bn : content.cta1_en;
  const cta2 = isBn ? content.cta2_bn : content.cta2_en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_BG}
            alt="Green Nature Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-brand-forest/70" />
        </div>

        <div className="container-custom relative z-10 py-16 sm:py-20 lg:py-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 
                         font-bold text-white mb-8 
                         leading-[1.5] pt-[0.2em] pb-[0.05em]
                         text-bangla-safe drop-shadow-lg"
            >
              {headline}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 
                         justify-center items-center"
            >
              <Link
                href={getUrl('/contact')}
                className="inline-flex items-center justify-center gap-2
                           px-8 py-4 rounded-lg font-bold
                           bg-brand text-white shadow-xl shadow-brand/30
                           transition-all duration-300
                           hover:bg-brand-dark hover:shadow-2xl hover:scale-105
                           active:scale-95
                           w-full sm:w-auto
                           text-base sm:text-lg"
              >
                <span className="text-bangla-safe">{cta1}</span>
                <ArrowRight size={20} />
              </Link>

              <a
                href="tel:+8801788766735"
                className="inline-flex items-center justify-center gap-2
                           px-8 py-4 rounded-lg font-bold
                           border-2 border-white text-white
                           bg-white/10 backdrop-blur-sm
                           transition-all duration-300
                           hover:bg-white hover:text-brand
                           active:scale-95
                           w-full sm:w-auto
                           text-base sm:text-lg"
              >
                <Phone size={20} />
                <span className="text-bangla-safe">{cta2}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative -mt-12 sm:-mt-16 lg:-mt-20 z-20 pb-12 lg:pb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const title = isBn ? feature.title_bn : feature.title_en;

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group"
                >
                  <div
                    className="relative h-full bg-white rounded-xl p-6 lg:p-7 
                               text-center border border-neutral-light
                               shadow-lg hover:shadow-2xl 
                               transition-all duration-500
                               hover:-translate-y-2 hover:border-brand"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1 
                                 bg-brand rounded-t-xl opacity-0 
                                 group-hover:opacity-100 transition-opacity"
                    />

                    <div
                      className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 
                                 rounded-full bg-brand/10 border-2 border-brand/20
                                 flex items-center justify-center
                                 transition-all duration-500
                                 group-hover:bg-brand group-hover:scale-110"
                    >
                      <Icon
                        size={32}
                        strokeWidth={2}
                        className="text-brand transition-colors duration-500
                                   group-hover:text-white lg:w-10 lg:h-10"
                      />
                    </div>

                    <h3
                      className="text-sm lg:text-base font-bold text-neutral-dark 
                                 leading-[1.6] text-bangla-safe 
                                 transition-colors duration-300
                                 group-hover:text-brand"
                    >
                      {title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
