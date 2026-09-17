'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  FileCheck,
  Scale,
  UserCheck,
  FileKey,
  Users,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';

interface Service {
  id: number;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  icon: LucideIcon;
}

const SERVICES: Service[] = [
  {
    id: 1,
    title_bn: 'জমির দলিল তৈরি',
    title_en: 'Land Deed Preparation',
    description_bn: 'সম্পূর্ণ আইনি প্রক্রিয়া অনুসরণ করে নির্ভুল দলিল প্রস্তুত করা হয়।',
    description_en: 'Accurate deed preparation following complete legal process.',
    icon: FileText,
  },
  {
    id: 2,
    title_bn: 'দলিল নিবন্ধন',
    title_en: 'Deed Registration',
    description_bn: 'আপনার তৈরি করা দলিল নিরাপদে নিবন্ধনের জন্য প্রয়োজনীয় সহায়তা।',
    description_en: 'Necessary assistance for safe registration of your deed.',
    icon: FileCheck,
  },
  {
    id: 3,
    title_bn: 'আইনি পরামর্শ',
    title_en: 'Legal Consultation',
    description_bn: 'ভূমি ও সম্পত্তি সংক্রান্ত যেকোনো আইনি বিষয়ে অভিজ্ঞ পরামর্শ।',
    description_en: 'Expert legal advice on any land and property matter.',
    icon: Scale,
  },
  {
    id: 4,
    title_bn: 'নামজারি ও খারিজ',
    title_en: 'Namjari & Kharij',
    description_bn: 'জমির মালিকানা পরিবর্তন ও রেকর্ড সংশোধন প্রক্রিয়ায় সহায়তা।',
    description_en: 'Assistance in land ownership change and record correction.',
    icon: UserCheck,
  },
  {
    id: 5,
    title_bn: 'পাওয়ার অফ অ্যাটর্নি',
    title_en: 'Power of Attorney',
    description_bn: 'পাওয়ার অফ অ্যাটর্নি প্রস্তুত ও নিবন্ধনে পূর্ণ আইনি সহায়তা।',
    description_en: 'Complete legal assistance in preparing power of attorney.',
    icon: FileKey,
  },
  {
    id: 6,
    title_bn: 'সম্পত্তির ফরায়েজ',
    title_en: 'Property Distribution',
    description_bn: 'মুসলিম ও হিন্দু আইনের অধীনে সঠিকভাবে সম্পত্তি বন্টন।',
    description_en: 'Proper property distribution under Muslim and Hindu law.',
    icon: Users,
  },
];

export default function ServicesSection() {
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
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative overflow-hidden section-padding bg-navy">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 
                   w-[600px] h-[600px] bg-gold/5 rounded-full 
                   blur-[140px] -z-0"
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="heading-2 mb-6 text-bangla-safe">
            {t('services.title')}
          </h2>

          <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                     gap-5 lg:gap-6"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const title = locale === 'bn' ? service.title_bn : service.title_en;
            const description =
              locale === 'bn' ? service.description_bn : service.description_en;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="group relative"
              >
                <Link href={getUrl('/services')} className="block h-full">
                  <div
                    className="relative h-full p-6 lg:p-7 rounded-xl
                               bg-navy-dark border border-navy-border
                               transition-all duration-500 ease-out
                               hover:border-gold hover:bg-navy-dark/95
                               hover:-translate-y-2 hover:shadow-2xl
                               overflow-hidden text-center"
                  >
                    <div
                      className="absolute inset-0 opacity-0 
                                 group-hover:opacity-100 
                                 transition-opacity duration-500
                                 bg-gradient-to-br from-gold/5 to-transparent
                                 pointer-events-none"
                    />

                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 
                                 bg-gradient-to-r from-transparent via-gold to-transparent
                                 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-500"
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className="mb-5 flex items-center justify-center
                                   transition-all duration-500
                                   group-hover:scale-110 group-hover:rotate-3"
                      >
                        <Icon
                          size={48}
                          strokeWidth={1.5}
                          className="text-gold"
                        />
                      </div>

                      <h3
                        className="text-lg lg:text-xl font-bold text-white mb-3 
                                   transition-colors duration-300
                                   group-hover:text-gold text-bangla-safe 
                                   leading-[1.6] pt-[0.15em]"
                      >
                        {title}
                      </h3>

                      <p
                        className="text-sm text-muted leading-[1.9] mb-5 
                                   text-bangla-safe line-clamp-3"
                      >
                        {description}
                      </p>

                      <div
                        className="flex items-center gap-2 text-gold 
                                   text-sm font-medium
                                   transition-all duration-300
                                   group-hover:gap-3"
                      >
                        <span className="text-bangla-safe">আরও জানুন</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 
                                     group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 lg:mt-16"
        >
          <Link
            href={getUrl('/services')}
            className="inline-flex items-center gap-2 
                       px-6 py-3 rounded-lg
                       border-2 border-gold text-gold
                       hover:bg-gold hover:text-navy
                       transition-all duration-300
                       font-semibold text-sm
                       group"
          >
            <span className="text-bangla-safe">সব সেবা দেখুন</span>
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}