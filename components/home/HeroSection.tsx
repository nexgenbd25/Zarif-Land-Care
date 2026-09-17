'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import {
  FileText,
  Monitor,
  Printer,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

const HERO_BG =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80';

const FEATURES = [
  {
    id: 1,
    title_bn: 'জমি রেজিস্ট্রি ও\nদলিল লেখন',
    title_en: 'Land Registry &\nDeed Writing',
    icon: FileText,
  },
  {
    id: 2,
    title_bn: 'কম্পিউটার কম্পোজ ও\nঅনলাইন আবেদন',
    title_en: 'Computer Compose &\nOnline Application',
    icon: Monitor,
  },
  {
    id: 3,
    title_bn: 'ল্যাব প্রিন্ট\nপাসপোর্ট ছবি',
    title_en: 'Lab Print\nPassport Photo',
    icon: Printer,
  },
  {
    id: 4,
    title_bn: 'মোবাইল ব্যাংকিং\n(বিকাশ, রকেট, নগদ)',
    title_en: 'Mobile Banking\n(bKash, Rocket, Nagad)',
    icon: Smartphone,
  },
];

export default function HeroSection() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const getUrl = (path: string) => {
    const prefix = isBn ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  const content = {
    headline_bn:
      'একই ছাদের নিচে জমির নির্ভুল দলিল লেখন ও আধুনিক ডিজিটাল সেবা',
    headline_en:
      'Accurate Land Deed Writing & Modern Digital Services Under One Roof',
    cta1_bn: 'যোগাযোগ',
    cta1_en: 'Contact',
    cta2_bn: 'সার্ভিস দেখুন',
    cta2_en: 'View Services',
  };

  const headline = isBn ? content.headline_bn : content.headline_en;
  const cta1 = isBn ? content.cta1_bn : content.cta1_en;
  const cta2 = isBn ? content.cta2_bn : content.cta2_en;

  return (
    <section className="relative w-full">
      {/* ===== TOP HERO BANNER ===== */}
      <div className="relative w-full">
        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HERO_BG}
            alt="Green Nature Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 blur-[2px]"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 
                        pt-20 sm:pt-24 lg:pt-28 
                        pb-44 sm:pb-52 lg:pb-56">
          <div className="max-w-4xl mx-auto text-center px-1">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem]
                         font-bold text-white mb-6 sm:mb-8 
                         leading-[1.5] pt-[0.2em] pb-[0.05em]
                         text-bangla-safe drop-shadow-lg"
            >
              {headline}
            </h1>

            {/* Buttons — mobile e full width, sm+ e auto */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 
                            justify-center items-stretch sm:items-center
                            max-w-xs sm:max-w-none mx-auto">
              <Link
                href={getUrl('/contact')}
                className="group inline-flex items-center justify-center gap-2
                           w-full sm:w-44 lg:w-48 py-3 sm:py-3 rounded-md font-bold
                           bg-brand text-white
                           transition-all duration-300
                           hover:bg-brand-dark
                           active:scale-95
                           text-sm sm:text-base"
              >
                <span className="text-bangla-safe">{cta1}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 
                             group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={getUrl('/services')}
                className="group inline-flex items-center justify-center gap-2
                           w-full sm:w-44 lg:w-48 py-3 sm:py-3 rounded-md font-bold
                           bg-white text-brand
                           transition-all duration-300
                           hover:bg-gray-100
                           active:scale-95
                           text-sm sm:text-base"
              >
                <span className="text-bangla-safe">{cta2}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 
                             group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURE CARDS (Overlap) ===== */}
      <div className="relative z-20 -mt-28 sm:-mt-36 lg:-mt-40">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const title = isBn ? feature.title_bn : feature.title_en;

              return (
                <div
                  key={feature.id}
                  className="group rounded-lg
                             flex flex-col items-center justify-center
                             p-4 sm:p-5 lg:p-6
                             min-h-[160px] sm:min-h-[200px] lg:min-h-[230px]
                             bg-white
                             shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                             transition-all duration-300
                             hover:-translate-y-1
                             hover:shadow-[0_12px_35px_rgba(31,122,63,0.25)]"
                >
                  <div
                    className="mb-3 sm:mb-4 flex items-center justify-center
                               transition-transform duration-300
                               group-hover:scale-110"
                  >
                    <Icon
                      size={36}
                      strokeWidth={1.8}
                      className="text-[#1F7A3F] sm:hidden drop-shadow-md"
                    />
                    <Icon
                      size={64}
                      strokeWidth={1.6}
                      className="text-[#1F7A3F] hidden sm:block drop-shadow-md"
                    />
                  </div>

                  <h3
                    className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg
                               font-bold text-black leading-[1.6] 
                               text-bangla-safe whitespace-pre-line
                               text-center"
                  >
                    {title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom spacing (cards overlap er jonno) */}
      <div className="h-16 sm:h-20 lg:h-24 bg-white" />
    </section>
  );
}
