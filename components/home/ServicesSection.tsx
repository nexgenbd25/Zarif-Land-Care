'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  FileText,
  FileCheck,
  Scale,
  UserCheck,
  FileKey,
  Users,
  ShieldCheck,
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
    description_bn: 'আপনার তৈরি করা দলিল নিরাপদে নিবন্ধনের জন্য প্রয়োজনীয় সহায়তা প্রদান করা হয়।',
    description_en: 'Necessary assistance is provided for safe registration of your deed.',
    icon: FileCheck,
  },
  {
    id: 3,
    title_bn: 'আইনি পরামর্শ',
    title_en: 'Legal Consultation',
    description_bn: 'ভূমি এবং সম্পত্তি সংক্রান্ত যেকোনো আইনি বিষয়ে অভিজ্ঞ আইনজীবীর পরামর্শ।',
    description_en: 'Expert lawyer consultation on any land and property matter.',
    icon: Scale,
  },
  {
    id: 4,
    title_bn: 'নামজারি ও খারিজ',
    title_en: 'Namjari & Kharij',
    description_bn: 'জমির মালিকানা পরিবর্তন এবং রেকর্ড সংশোধন প্রক্রিয়ায় সহায়তা করা হয়।',
    description_en: 'Assistance in land ownership change and record correction process.',
    icon: UserCheck,
  },
  {
    id: 5,
    title_bn: 'পাওয়ার অফ অ্যাটর্নি',
    title_en: 'Power of Attorney',
    description_bn: 'পাওয়ার অফ অ্যাটর্নি প্রস্তুত এবং রেজিস্ট্রি করার ক্ষেত্রে আইনি সহায়তা প্রদান করা হয়।',
    description_en: 'Legal assistance is provided in preparing and registering power of attorney.',
    icon: FileKey,
  },
  {
    id: 6,
    title_bn: 'সম্পত্তির ফরায়েজ',
    title_en: 'Property Distribution',
    description_bn: 'মুসলিম ও হিন্দু আইনের অধীনে সঠিক ও ডিজিটাল ভাবে উত্তরাধিকারদের মধ্যে সম্পদের বন্টন বা ফরায়েজ করে থাকি।',
    description_en: 'We distribute or transfer property among heirs correctly and digitally under Muslim and Hindu law.',
    icon: Users,
  },
  {
    id: 7,
    title_bn: 'অন্যান্য আইনি সহায়তা',
    title_en: 'Other Legal Assistance',
    description_bn: 'ভূমি সংক্রান্ত অন্যান্য যেকোনো আইনি জটিলতা সমাধানে আমরা প্রস্তুত।',
    description_en: 'We are ready to solve any other legal complications related to land.',
    icon: ShieldCheck,
  },
];

export default function ServicesSection() {
  const t = useTranslations();
  const locale = useLocale();

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
    <section className="relative overflow-hidden section-padding bg-navy
                        border-b border-navy-border">
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
          className="flex flex-wrap justify-center gap-5 lg:gap-6"
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
                className="group relative
                           w-full sm:w-[calc(50%-0.625rem)] 
                           lg:w-[calc(33.333%-1rem)]"
              >
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
                      className="text-sm text-muted leading-[1.9] 
                                 text-bangla-safe"
                    >
                      {description}
                    </p>
                  </div>
                </div>
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
          <a
            href={locale === 'bn' ? '/services' : `/${locale}/services`}
            className="inline-flex items-center gap-2 
                       px-6 py-3 rounded-lg
                       border-2 border-gold text-gold
                       hover:bg-gold hover:text-navy
                       transition-all duration-300
                       font-semibold text-sm"
          >
            <span className="text-bangla-safe">সব সেবা দেখুন</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}