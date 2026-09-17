'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, MapPin, Mail, MessageCircle, Star, Award } from 'lucide-react';

interface TeamMember {
  id: number;
  name_bn: string;
  name_en: string;
  designation_bn: string;
  designation_en: string;
  description_bn: string;
  description_en: string;
  address_bn: string;
  address_en: string;
  phone: string;
  badge_bn: string;
  badge_en: string;
  badgeIcon: 'star' | 'award';
  image_url: string;
}

const TEAM: TeamMember[] = [
  {
    id: 1,
    name_bn: 'মোঃ জাহিদুল ইসলাম',
    name_en: 'Md. Zahidul Islam',
    designation_bn: 'সরকারী লাইসেন্স প্রাপ্ত দলিল লেখক',
    designation_en: 'Government Licensed Deed Writer',
    description_bn:
      'জমি সংক্রান্ত সকল ধরনের আইনি জটিলতা সমাধানে দীর্ঘ অভিজ্ঞতা সম্পন্ন। তিনি আমাদের টিমের অন্যতম ও কৃতিত্বপূর্ণ সদস্য।',
    description_en:
      'Highly experienced in resolving all types of land-related legal complexities. He is one of our most accomplished team members.',
    address_bn: 'বড়াইল, কাপাইয়া, চাঁদপুর, কুমিল্লা।',
    address_en: 'Borail, Kapaiya, Chandpur, Comilla.',
    phone: '+880 1788-766735',
    badge_bn: 'টিম লিড',
    badge_en: 'Team Lead',
    badgeIcon: 'star',
    image_url: 'https://i.postimg.cc/wx0q1tz9/20260917-044318.jpg',
  },
  {
    id: 2,
    name_bn: 'মোঃ সেলিম',
    name_en: 'Md. Selim',
    designation_bn: 'সিনিয়র লিগ্যাল কনসালটেন্ট',
    designation_en: 'Senior Legal Consultant',
    description_bn:
      'জমি সংক্রান্ত সকল ধরনের আইনি জটিলতা সমাধানে দীর্ঘ অভিজ্ঞতা সম্পন্ন। তিনি আমাদের টিমের অন্যতম ও কৃতিত্বপূর্ণ সদস্য।',
    description_en:
      'Extensive experience in solving all types of land-related legal issues. He is a distinguished member of our team.',
    address_bn: 'বড়াইল, কাপাইয়া, চাঁদপুর, কুমিল্লা।',
    address_en: 'Borail, Kapaiya, Chandpur, Comilla.',
    phone: '+880 1627-660841',
    badge_bn: 'এক্সপার্ট',
    badge_en: 'Expert',
    badgeIcon: 'star',
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    id: 3,
    name_bn: 'মোঃ সাব্বির শেখ',
    name_en: 'Md. Sabbir Sheikh',
    designation_bn: 'লিগ্যাল কনসালটেন্ট',
    designation_en: 'Legal Consultant',
    description_bn:
      'জমি সংক্রান্ত দলিল প্রস্তুতকরণ, রেজিস্ট্রি ও আইনি প্রক্রিয়ায় সাহায্যায় অভিজ্ঞ।',
    description_en:
      'Experienced in land deed preparation, registration and legal process assistance.',
    address_bn: 'মোঃ দেলোয়ার হোসেন শেখ বাড়ি।',
    address_en: 'Md. Delwar Hossain Sheikh Bari.',
    phone: '+880 1829-784457',
    badge_bn: 'এক্সপার্ট',
    badge_en: 'Expert',
    badgeIcon: 'star',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    id: 4,
    name_bn: 'নাজমুল হাসান দেওয়ান',
    name_en: 'Nazmul Hasan Dewan',
    designation_bn: 'লিগ্যাল কনসালটেন্ট',
    designation_en: 'Legal Consultant',
    description_bn:
      'জমি রেজিস্ট্রি, দলিল প্রণয়ন ও পরামর্শ সেবায় নির্ভরযোগ্য এবং অভিজ্ঞ।',
    description_en:
      'Reliable and experienced in land registration, deed drafting and consultancy services.',
    address_bn: 'আবু বাসার দেওয়ান বাড়ি।',
    address_en: 'Abu Basar Dewan Bari.',
    phone: '+880 1302-555723',
    badge_bn: 'সিনিয়র এক্সপার্ট',
    badge_en: 'Senior Expert',
    badgeIcon: 'award',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
];

const AUTO_SLIDE_INTERVAL = 5000;

export default function TeamSection() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const content = {
    topLabel_bn: 'আমাদের টিম',
    topLabel_en: 'OUR TEAM',
    heading_bn: 'আমাদের অভিজ্ঞ টিম',
    heading_en: 'Our Experienced Team',
    subheading_bn:
      'আমাদের টিমে আছেন অভিজ্ঞ ও দক্ষ পেশাদাররা, যারা আপনার জমি সংক্রান্ত সব ধরনের সেবা প্রদান করতে সদা প্রস্তুত।',
    subheading_en:
      'Our team consists of experienced and skilled professionals, always ready to provide all types of land-related services.',
  };

  const topLabel = isBn ? content.topLabel_bn : content.topLabel_en;
  const heading = isBn ? content.heading_bn : content.heading_en;
  const subheading = isBn ? content.subheading_bn : content.subheading_en;

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
    <section className="relative overflow-hidden section-padding bg-white">
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 opacity-30 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M20,60 Q40,20 80,30 Q100,35 90,60 Q80,80 50,75 Q30,70 20,60 Z"
            fill="#86EFAC"
            opacity="0.4"
          />
          <path
            d="M10,100 Q30,80 55,90 Q70,100 55,115 Q35,125 15,110 Z"
            fill="#4ADE80"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="absolute top-10 right-0 w-48 h-48 sm:w-64 sm:h-64 opacity-30 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M180,60 Q160,20 120,30 Q100,35 110,60 Q120,80 150,75 Q170,70 180,60 Z"
            fill="#86EFAC"
            opacity="0.4"
          />
          <path
            d="M190,100 Q170,80 145,90 Q130,100 145,115 Q165,125 185,110 Z"
            fill="#4ADE80"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 sm:w-20 h-0.5 bg-[#1F7A3F]/40" />
            <span className="text-[#1F7A3F] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
              {topLabel}
            </span>
            <span className="w-12 sm:w-20 h-0.5 bg-[#1F7A3F]/40" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] text-bangla-heading pt-2 pb-3 mb-4">
            {heading}
          </h2>

          <p className="text-[#4B5563] text-sm sm:text-base max-w-2xl mx-auto text-bangla-safe px-2">
            {subheading}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="w-16 h-0.5 bg-[#1F7A3F]/30" />
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-[#1F7A3F]"
              fill="currentColor"
            >
              <path d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z" />
            </svg>
            <span className="w-16 h-0.5 bg-[#1F7A3F]/30" />
          </div>
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
              const description = isBn
                ? member.description_bn
                : member.description_en;
              const address = isBn ? member.address_bn : member.address_en;
              const badge = isBn ? member.badge_bn : member.badge_en;
              const BadgeIcon = member.badgeIcon === 'award' ? Award : Star;

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
                               hover:border-[#1F7A3F]/30
                               hover:shadow-[0_25px_60px_-15px_rgba(31,122,63,0.25)]
                               hover:-translate-y-1"
                  >
                    <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-28 sm:h-28 opacity-90 pointer-events-none">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full"
                        fill="none"
                      >
                        <path
                          d="M100,40 Q70,50 60,80 Q55,95 70,100 Q85,100 95,90 Q100,80 100,40 Z"
                          fill="#1F7A3F"
                          opacity="0.85"
                        />
                        <path
                          d="M70,60 Q65,70 70,85"
                          stroke="#86EFAC"
                          strokeWidth="1"
                          fill="none"
                          opacity="0.6"
                        />
                        <path
                          d="M80,55 Q75,65 80,80"
                          stroke="#86EFAC"
                          strokeWidth="1"
                          fill="none"
                          opacity="0.6"
                        />
                        <path
                          d="M90,50 Q85,60 90,75"
                          stroke="#86EFAC"
                          strokeWidth="1"
                          fill="none"
                          opacity="0.6"
                        />
                      </svg>
                    </div>

                    <div className="relative pt-5 px-5 lg:px-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 aspect-square">
                          <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-white ring-2 ring-[#1F7A3F]/20 group-hover:ring-[#1F7A3F] transition-all duration-500 shadow-lg">
                            <Image
                              src={member.image_url}
                              alt={name}
                              fill
                              sizes="140px"
                              className="object-cover object-center rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 pt-1">
                          <div className="inline-flex items-center gap-1.5 
                                         px-3 py-1.5 rounded-full
                                         bg-[#1F7A3F] text-white
                                         shadow-md">
                            <BadgeIcon size={12} className="fill-white" />
                            <span className="text-[10px] sm:text-xs font-bold 
                                            whitespace-nowrap">
                              {badge}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <a
                              href={`tel:${member.phone.replace(/\s/g, '')}`}
                              aria-label="Call"
                              className="w-9 h-9 rounded-full 
                                         bg-[#E8F5E9] hover:bg-[#1F7A3F]
                                         flex items-center justify-center
                                         text-[#1F7A3F] hover:text-white
                                         transition-all duration-300
                                         hover:scale-110"
                            >
                              <Phone size={14} />
                            </a>
                            <a
                              href={`https://wa.me/${member.phone.replace(
                                /\D/g,
                                ''
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="WhatsApp"
                              className="w-9 h-9 rounded-full 
                                         bg-[#E8F5E9] hover:bg-[#25D366]
                                         flex items-center justify-center
                                         text-[#1F7A3F] hover:text-white
                                         transition-all duration-300
                                         hover:scale-110"
                            >
                              <MessageCircle size={14} />
                            </a>
                            <a
                              href="mailto:zariflandcare@gmail.com"
                              aria-label="Email"
                              className="w-9 h-9 rounded-full 
                                         bg-[#E8F5E9] hover:bg-[#1F7A3F]
                                         flex items-center justify-center
                                         text-[#1F7A3F] hover:text-white
                                         transition-all duration-300
                                         hover:scale-110"
                            >
                              <Mail size={14} />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937] 
                                      text-bangla-heading pt-1 pb-1
                                      group-hover:text-[#1F7A3F] 
                                      transition-colors duration-300">
                          {name}
                        </h3>
                        <p className="text-[#1F7A3F] text-sm sm:text-base font-semibold 
                                     text-bangla-safe pt-1 pb-2">
                          {designation}
                        </p>
                      </div>

                      <p className="text-[#4B5563] text-xs sm:text-sm 
                                   text-bangla-safe mt-2 mb-4">
                        {description}
                      </p>
                    </div>

                    <div className="relative px-5 lg:px-6 pb-5">
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#1F7A3F] 
                                         flex items-center justify-center 
                                         flex-shrink-0 mt-0.5">
                            <MapPin size={11} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-[#1F2937] 
                                            uppercase tracking-wider block mb-0.5">
                              ঠিকানা
                            </span>
                            <span className="text-[11px] sm:text-xs text-[#4B5563] 
                                            text-bangla-safe leading-[1.6] 
                                            break-words block">
                              {address}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#1F7A3F] 
                                         flex items-center justify-center 
                                         flex-shrink-0 mt-0.5">
                            <Phone size={11} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-[#1F2937] 
                                            uppercase tracking-wider block mb-0.5">
                              ফোন
                            </span>
                            <a
                              href={`tel:${member.phone.replace(/\s/g, '')}`}
                              className="text-[11px] sm:text-xs text-[#1F7A3F] 
                                         hover:text-[#155E30] font-semibold 
                                         transition-colors break-all block 
                                         leading-[1.6]"
                            >
                              {member.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 mt-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i === 0 ? 'bg-[#1F7A3F]' : 'bg-[#1F7A3F]/20'
                            }`}
                          />
                        ))}
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
