'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const locale = useLocale();

  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  const isBn = locale === 'bn';

  const content = {
    badge: isBn ? 'আমাদের সম্পর্কে' : 'About Us',
    title: isBn
      ? 'একটি নির্ভরযোগ্য প্রতিষ্ঠান'
      : 'A Trusted Institution',
    ownerLabel: isBn ? 'প্রতিষ্ঠাতা ও প্রধান দলিল লেখক' : 'Founder & Chief Deed Writer',
    ownerName: isBn ? 'মোঃ জাহিদুল ইসলাম' : 'Md. Zahidul Islam',
    paragraph1: isBn
      ? 'অভিজ্ঞ দলিল লেখক দল হিসেবে ভূমি ও সম্পত্তি লেনদেনের দলিল তৈরির নির্ভরযোগ্য ও পেশাদার সেবা প্রদান করে থাকি। আপনার জমি বা সম্পত্তির ক্রয়-বিক্রয়ের প্রতিটি ধাপে সহজ, নির্ভুল ও নিরাপদ করতে আমরা সর্বোচ্চ গুরুত্ব দিয়ে কাজ করি।'
      : 'As an experienced deed writers team, we provide reliable and professional services for land and property transaction documentation. We give our highest priority to making every step of your land or property transactions simple, accurate, and safe.',
    paragraph2: isBn
      ? 'দীর্ঘ বছরের অভিজ্ঞতায় আমরা শিখেছি—একটি সঠিক ও সুশৃঙ্খল দলিল শুধু আইনি সুরক্ষা দেয় না, বরং ভবিষ্যতের জটিলতা থেকেও রক্ষা করে। আমাদের সেবার মধ্যে রয়েছে দলিল প্রস্তুতি, খসড়া তৈরি, পরামর্শ, ও সম্পূর্ণ রেজিস্ট্রেশন সহায়তা।'
      : 'Through years of experience, we have learned that a correct and well-organized deed not only provides legal protection but also prevents future complications. Our services include deed preparation, drafting, consultation, and complete registration support.',
    features: isBn
      ? [
          'সততা ও দীর্ঘ বছরের অভিজ্ঞতা',
          'নির্ভুল দলিল প্রস্তুতি',
          'সম্পূর্ণ আইনি সহায়তা',
          'দ্রুত ও নিরাপদ সেবা',
        ]
      : [
          'Honesty and years of experience',
          'Accurate deed preparation',
          'Complete legal assistance',
          'Fast and secure service',
        ],
    cta: isBn ? 'আরও জানুন' : 'Learn More',
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative overflow-hidden section-padding bg-navy-dark">
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] 
                   bg-gold/5 rounded-full blur-[160px] -z-0"
      />

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full lg:w-5/12 flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-md">
              <div
                className="absolute -inset-4 bg-gradient-to-br 
                           from-gold/20 to-transparent rounded-3xl blur-2xl"
              />

              <div
                className="relative w-full aspect-[4/5] rounded-2xl 
                           overflow-hidden border-4 border-gold/20 shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                  alt={content.ownerName}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t 
                             from-navy/80 via-transparent to-transparent"
                />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-gold text-xs font-medium mb-1">
                    {content.ownerLabel}
                  </div>
                  <div
                    className="text-white text-lg font-bold 
                               text-bangla-safe leading-[1.6]"
                  >
                    {content.ownerName}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 
                           bg-gradient-to-br from-gold to-gold-light
                           text-navy rounded-2xl px-5 py-4 shadow-2xl
                           hidden sm:block"
              >
                <div className="text-3xl font-bold leading-none">১০+</div>
                <div className="text-xs font-semibold mt-1">
                  {isBn ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full lg:w-7/12 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span
                className="inline-flex items-center gap-2 
                           px-4 py-2 rounded-full
                           bg-gold/10 border border-gold/30
                           text-gold text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {content.badge}
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="heading-2 mb-6 text-bangla-safe"
            >
              {content.title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-muted text-base leading-[1.9] mb-5 
                         text-bangla-safe"
            >
              {content.paragraph1}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-muted text-base leading-[1.9] mb-8 
                         text-bangla-safe"
            >
              {content.paragraph2}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
            >
              {content.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-left"
                >
                  <CheckCircle2
                    size={20}
                    className="text-gold flex-shrink-0 mt-0.5"
                  />
                  <span
                    className="text-gray-300 text-sm leading-[1.8] 
                               text-bangla-safe"
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href={getUrl('/about')}
                className="btn-secondary group inline-flex"
              >
                <span className="text-bangla-safe">{content.cta}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}