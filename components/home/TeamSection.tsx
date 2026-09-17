'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Phone, MapPin, User } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);

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

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
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
    <section className="relative overflow-hidden section-padding bg-navy
                        border-b border-navy-border">
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] 
                   bg-gold/5 rounded-full blur-[140px] -z-0"
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="heading-2 mb-4 text-bangla-safe">{heading}</h2>

          <p
            className="text-muted text-sm sm:text-base max-w-2xl mx-auto 
                       leading-[1.9] text-bangla-safe mb-6"
          >
            {subheading}
          </p>

          <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          <div
            ref={containerRef}
            className="overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="flex"
              animate={{
                x: `-${currentIndex * (100 / cardsPerView)}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 30,
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
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 
                               px-2 sm:px-3"
                  >
                    <div
                      className="relative h-full
                                 bg-navy-dark border border-navy-border 
                                 rounded-2xl p-5 lg:p-6 text-center
                                 transition-all duration-500
                                 hover:border-gold hover:shadow-2xl"
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5 
                                   bg-gradient-to-r from-transparent via-gold to-transparent 
                                   rounded-t-2xl"
                      />

                      <div className="relative w-24 h-24 lg:w-28 lg:h-28 mx-auto mb-4">
                        <div
                          className="relative w-full h-full rounded-full 
                                     overflow-hidden border-4 border-gold/30 
                                     shadow-xl"
                        >
                          <Image
                            src={member.image_url}
                            alt={name}
                            fill
                            sizes="150px"
                            className="object-cover object-center"
                            unoptimized
                          />
                        </div>
                      </div>

                      <h3
                        className="text-base lg:text-lg font-bold text-white 
                                   mb-1.5 text-bangla-safe leading-[1.6]"
                      >
                        {name}
                      </h3>

                      <p
                        className="text-gold text-xs lg:text-sm font-semibold 
                                   mb-4 text-bangla-safe leading-[1.8]"
                      >
                        {designation}
                      </p>

                      <div className="space-y-2 text-left">
                        <div className="flex items-start gap-2">
                          <User
                            size={14}
                            className="text-gold flex-shrink-0 mt-1"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-muted block leading-tight">
                              {fatherLabel}
                            </span>
                            <span
                              className="text-xs lg:text-sm text-gray-200 
                                         text-bangla-safe leading-[1.7] 
                                         break-words"
                            >
                              {father}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin
                            size={14}
                            className="text-gold flex-shrink-0 mt-1"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-muted block leading-tight">
                              {addressLabel}
                            </span>
                            <span
                              className="text-xs lg:text-sm text-gray-200 
                                         text-bangla-safe leading-[1.7] 
                                         break-words"
                            >
                              {address}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone
                            size={14}
                            className="text-gold flex-shrink-0"
                          />
                          <a
                            href={`tel:${member.phone.replace(/\s/g, '')}`}
                            className="text-xs lg:text-sm text-gold 
                                       hover:text-gold-light 
                                       transition-colors font-medium"
                          >
                            {member.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 
                       -translate-x-2 sm:-translate-x-4 lg:-translate-x-5 z-20
                       w-10 h-10 lg:w-12 lg:h-12 rounded-full 
                       bg-navy-dark border border-gold/30
                       flex items-center justify-center
                       text-gold hover:bg-gold hover:text-navy
                       transition-all duration-200 shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 
                       translate-x-2 sm:translate-x-4 lg:translate-x-5 z-20
                       w-10 h-10 lg:w-12 lg:h-12 rounded-full 
                       bg-navy-dark border border-gold/30
                       flex items-center justify-center
                       text-gold hover:bg-gold hover:text-navy
                       transition-all duration-200 shadow-lg"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full
                            ${
                              index === currentIndex
                                ? 'w-8 h-2 bg-gold'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                            }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}