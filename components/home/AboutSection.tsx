'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  const locale = useLocale();

  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  const isBn = locale === 'bn';

  const content = {
    paragraph1: isBn
      ? 'অভিজ্ঞ দলিল লেখক দল হিসেবে ভূমি ও সম্পত্তি লেনদেনের দলিল তৈরির নির্ভরযোগ্য ও পেশাদার সেবা প্রদান করে থাকি। আপনার জমি বা সম্পত্তির ক্রয়-বিক্রয়ের প্রতিটি ধাপকে সহজ, নির্ভুল ও নিরাপদ করতে আমরা সর্বোচ্চ গুরুত্ব দিয়ে কাজ করি।'
      : 'As an experienced deed writers team, we provide reliable and professional services for land and property transaction documentation. We give our highest priority to making every step of your land or property transactions simple, accurate, and safe.',
    paragraph2: isBn
      ? 'দীর্ঘ বছরের অভিজ্ঞতায় আমরা শিখেছি—একটি সঠিক ও সুশৃঙ্খল দলিল শুধু আইনি সুরক্ষা দেয় না, বরং ভবিষ্যতের জটিলতা থেকেও রক্ষা করে। আমাদের সেবার মধ্যে রয়েছে দলিল প্রস্তুতি, খসড়া তৈরি, পরামর্শ, ও সম্পূর্ণ রেজিস্ট্রেশন সহায়তা।'
      : 'Through years of experience, we have learned that a correct and well-organized deed not only provides legal protection but also prevents future complications. Our services include deed preparation, drafting, consultation, and complete registration support.',
    paragraph3: isBn
      ? 'আমরা বিশ্বাস করি স্বচ্ছতা, সময়ানুবর্তিতা ও নির্ভুল দলিল তৈরিই আমাদের সাফল্যের চাবিকাঠি। তাই প্রতিটি ক্লায়েন্টের কাজকে আমরা গ্রহণ করি ব্যক্তিগত দায়িত্ব হিসেবে।'
      : 'We believe that transparency, punctuality, and accurate deed preparation are the keys to our success. That is why we accept every client\'s work as a personal responsibility.',
    cta: isBn ? 'আরও জানুন' : 'Learn More',
    ownerName: isBn ? 'মোঃ জাহিদুল ইসলাম' : 'Md. Zahidul Islam',
    ownerRole: isBn ? 'প্রতিষ্ঠাতা ও প্রধান দলিল লেখক' : 'Founder & Chief Deed Writer',
  };

  const profileImage = 'https://i.postimg.cc/wx0q1tz9/20260917-044318.jpg';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
    hidden: { opacity: 0, scale: 0.9 },
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
    <section className="relative overflow-hidden section-padding bg-navy
                        border-b border-navy-border">
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full lg:w-5/12 flex flex-col items-center justify-center"
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
              <div
                className="relative w-full h-full rounded-full 
                           overflow-hidden shadow-2xl"
              >
                <Image
                  src={profileImage}
                  alt={content.ownerName}
                  fill
                  sizes="(max-width: 768px) 250px, 300px"
                  className="object-cover object-center"
                  priority={false}
                  unoptimized
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <div
                className="text-white text-lg sm:text-xl font-bold 
                           text-bangla-safe leading-[1.6] mb-1"
              >
                {content.ownerName}
              </div>
              <div
                className="text-gold text-xs sm:text-sm font-medium 
                           text-bangla-safe leading-[1.8]"
              >
                {content.ownerRole}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full lg:w-7/12 text-center lg:text-left"
          >
            <motion.p
              variants={itemVariants}
              className="text-muted text-base leading-[1.9] mb-5 
                         text-bangla-safe"
            >
              {content.paragraph1}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-muted text-base leading-[1.9] mb-5 
                         text-bangla-safe"
            >
              {content.paragraph2}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-muted text-base leading-[1.9] mb-8 
                         text-bangla-safe"
            >
              {content.paragraph3}
            </motion.p>

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