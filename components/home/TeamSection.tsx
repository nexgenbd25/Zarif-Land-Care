'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, MapPin, User, BadgeCheck } from 'lucide-react';

interface TeamMember {
  id: number;
  name_bn: string;
  name_en: string;
  designation_bn: string;
  designation_en: string;
  father_bn: string;
  father_en: string;
  address_bn: string;
  address_en: string;
  phone: string;
  image_url: string;
}

const TEAM: TeamMember[] = [
  {
    id: 1,
    name_bn: 'মোঃ জাহিদুল ইসলাম',
    name_en: 'Md. Zahidul Islam',
    designation_bn: 'সরকারী লাইসেন্স প্রাপ্ত দলিল লেখক',
    designation_en: 'Government Licensed Deed Writer',
    father_bn: 'মোঃ জহিরুল ইসলাম',
    father_en: 'Md. Zahirul Islam',
    address_bn: 'গ্রামঃ বড়াইল, ডাকঘরঃ স্বর্ণগ্রাম, থানাঃ টংগীবাড়ী, জেলাঃ মুন্সিগঞ্জ।',
    address_en: 'Village: Borail, Post: Swarnagram, Thana: Tongibari, District: Munshiganj.',
    phone: '+880 1788-766735',
    image_url: 'https://i.postimg.cc/wx0q1tz9/20260917-044318.jpg',
  },
  {
    id: 2,
    name_bn: 'মোঃ সেলিম',
    name_en: 'Md. Selim',
    designation_bn: 'দলিল লেখক সহকারী ও আমিন (সার্ভেয়ার)',
    designation_en: 'Deed Writer Assistant & Amin (Surveyor)',
    father_bn: 'মোঃ ইউনুছ আলী বেপারী (আমিন)',
    father_en: 'Md. Yunus Ali Bepari (Amin)',
    address_bn: 'বানারী, হাসাইল, টংগীবাড়ী, মুন্সিগঞ্জ।',
    address_en: 'Banari, Hasail, Tongibari, Munshiganj.',
    phone: '+880 1627-660841',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    id: 3,
    name_bn: 'মোঃ সাব্বির শেখ',
    name_en: 'Md. Sabbir Sheikh',
    designation_bn: 'দলিল লেখক সহকারী',
    designation_en: 'Deed Writer Assistant',
    father_bn: 'মোঃ দেলোয়ার হোসেন শেখ',
    father_en: 'Md. Delwar Hossain Sheikh',
    address_bn: 'হাসাইল, টংগীবাড়ী, মুন্সিগঞ্জ।',
    address_en: 'Hasail, Tongibari, Munshiganj.',
    phone: '+880 1829-784457',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    id: 4,
    name_bn: 'নাজমুল হাসান দেওয়ান',
    name_en: 'Nazmul Hasan Dewan',
    designation_bn: 'দলিল লেখক সহকারী',
    designation_en: 'Deed Writer Assistant',
    father_bn: 'আবু বাক্কার দেওয়ান',
    father_en: 'Abu Bakkar Dewan',
    address_bn: 'শিমুলিয়া, রহিমগঞ্জ বাজার, টংগীবাড়ী, মুন্সিগঞ্জ।',
    address_en: 'Shimulia, Rahimganj Bazar, Tongibari, Munshiganj.',
    phone: '+880 1302-555723',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

export default function TeamSection() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const content = {
    heading_bn: 'আমাদের টিম',
    heading_en: 'Our Team',
    subheading_bn: 'আমাদের অভিজ্ঞ ও পেশাদার টিম সদস্য',
    subheading_en: 'Our experienced and professional team members',
    fatherLabel_bn: 'পিতা',
    fatherLabel_en: 'Father',
    addressLabel_bn: 'ঠিকানা',
    addressLabel_en: 'Address',
  };

  const heading = isBn ? content.heading_bn : content.heading_en;
  const subheading = isBn ? content.subheading_bn : content.subheading_en;
  const fatherLabel = isBn ? content.fatherLabel_bn : content.fatherLabel_en;
  const addressLabel = isBn ? content.addressLabel_bn : content.addressLabel_en;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerView(3);
      } else if (width >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, TEAM.length - cardsPerView);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [cardsPerView, currentIndex, maxIndex]);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, goToNext]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const totalDots = maxIndex + 1;

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-b from-white via-[#F8FAF9] to-white">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1F7A3F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="heading-2 mb-4 text-[#1F2937] text-bangla-heading pt-2 pb-2">
            {heading}
          </h2>

          <p className="text-[#6B7280] text-sm sm:text-base max-w-2xl mx-auto text-bangla-safe mb-6">
            {subheading}
          </p>

          <div className="w-20 h-1 bg-[#1F7A3F] mx-auto rounded-full" />
        </motion.div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="flex items-stretch"
            animate={{
              x: `-${currentIndex * (100 / cardsPerView)}%`,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
            }}
          >
            {TEAM.map((member) => {
              const name = isBn ? member.name_bn : member.name_en;
              const designation = isBn
                ? member.designation_bn
                : member.designation_en;
              const father = isBn ? member.father_bn : member.father_en;
              const address = isBn ? member.address_bn : member.address_en;

              return (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2.5 sm:px-3"
                >
                  <div
                    className="group relative h-full bg-white
                               rounded-2xl
                               border border-[#E5E7EB]
                               overflow-hidden
                               transition-all duration-500
                               hover:border-[#1F7A3F]/40
                               hover:shadow-[0_20px_50px_-15px_rgba(31,122,63,0.25)]
                               hover:-translate-y-1"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F7A3F] via-[#22C55E] to-[#1F7A3F]" />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#1F7A3F]/[0.02] via-transparent to-[#22C55E]/[0.03] pointer-events-none" />

                    <div className="relative pt-6 pb-4 px-5 lg:px-6">
                      <div className="relative w-24 h-24 lg:w-28 lg:h-28 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1F7A3F]/20 to-[#22C55E]/10 blur-md scale-105 pointer-events-none" />

                        <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-white ring-2 ring-[#1F7A3F]/25 group-hover:ring-[#1F7A3F] transition-all duration-500 shadow-lg">
                          <Image
                            src={member.image_url}
                            alt={name}
                            fill
                            sizes="120px"
                            className="object-cover object-center w-full h-full"
                            unoptimized
                          />
                        </div>

                        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#1F7A3F] to-[#155E30] border-[3px] border-white flex items-center justify-center shadow-md z-10">
                          <BadgeCheck size={14} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="relative px-5 lg:px-6 pb-6">
                      <div className="text-center mb-4">
                        <h3 className="text-base lg:text-lg font-bold text-[#1F2937] mb-1 text-bangla-heading pt-1 pb-1 group-hover:text-[#1F7A3F] transition-colors duration-300">
                          {name}
                        </h3>

                        <p className="text-[#1F7A3F] text-xs lg:text-sm font-semibold text-bangla-safe pt-1 pb-2">
                          {designation}
                        </p>

                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#1F7A3F] to-[#22C55E] mx-auto rounded-full mt-1" />
                      </div>

                      <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#1F7A3F]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User size={14} className="text-[#1F7A3F]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block pt-0.5 pb-0.5">
                              {fatherLabel}
                            </span>
                            <span className="text-xs lg:text-sm text-[#1F2937] text-bangla-safe break-words">
                              {father}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#1F7A3F]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin size={14} className="text-[#1F7A3F]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block pt-0.5 pb-0.5">
                              {addressLabel}
                            </span>
                            <span className="text-xs lg:text-sm text-[#1F2937] text-bangla-safe break-words">
                              {address}
                            </span>
                          </div>
                        </div>

                        <a
                          href={`tel:${member.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-2.5 pt-3 mt-1 border-t border-[#E5E7EB] group/phone"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#1F7A3F] flex items-center justify-center flex-shrink-0 group-hover/phone:bg-[#155E30] transition-colors">
                            <Phone size={13} className="text-white" />
                          </div>
                          <span className="text-xs lg:text-sm text-[#1F7A3F] group-hover/phone:text-[#155E30] transition-colors font-semibold tracking-wide">
                            {member.phone}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-[#1F7A3F]'
                  : 'w-2 h-2 bg-[#E5E7EB] hover:bg-[#6B7280]'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
