'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { FileText, Monitor, Printer, Smartphone } from 'lucide-react';

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
    cta1_bn: 'যোগাযোগ করুন',
    cta1_en: 'Contact Us',
    cta2_bn: 'কল করুন',
    cta2_en: 'Call Now',
  };

  const headline = isBn ? content.headline_bn : content.headline_en;
  const cta1 = isBn ? content.cta1_bn : content.cta1_en;
  const cta2 = isBn ? content.cta2_bn : content.cta2_en;

  return (
    <section className="relative">
      <div className="relative w-full">
        <div className="relative">
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
            <div className="absolute inset-0 bg-black/45" />
          </div>

          <div className="container-custom relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-32 sm:pb-40 lg:pb-48">
            <div className="max-w-4xl mx-auto text-center">
              <h1
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 
                           font-bold text-white mb-6 sm:mb-8 
                           leading-[1.5] pt-[0.2em] pb-[0.05em]
                           text-bangla-safe drop-shadow-lg"
              >
                {headline}
              </h1>

              <div className="flex flex-row gap-3 justify-center items-center">
                <Link
                  href={getUrl('/contact')}
                  className="inline-flex items-center justify-center
                             px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-bold
                             bg-brand text-white
                             transition-all duration-300
                             hover:bg-brand-dark
                             active:scale-95
                             text-sm sm:text-base"
                >
                  <span className="text-bangla-safe">{cta1}</span>
                </Link>

                <Link
                  href={getUrl('/services')}
                  className="inline-flex items-center justify-center
                             px-5 sm:px-6 py-2.5 sm:py-3 rounded-md font-bold
                             bg-white text-brand
                             transition-all duration-300
                             hover:bg-gray-100
                             active:scale-95
                             text-sm sm:text-base"
                >
                  <span className="text-bangla-safe">{cta2}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 translate-y-16 sm:translate-y-20 lg:translate-y-24">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                const title = isBn ? feature.title_bn : feature.title_en;

                return (
                  <div
                    key={feature.id}
                    className="group bg-white rounded-xl 
                               p-4 sm:p-5 lg:p-6 text-center
                               shadow-[0_4px_25px_rgba(0,0,0,0.1)]
                               border-b-4 border-transparent
                               transition-all duration-300
                               hover:-translate-y-1 
                               hover:shadow-[0_8px_30px_rgba(31,122,63,0.2)]
                               hover:border-brand"
                  >
                    <div
                      className="mx-auto mb-3 flex items-center justify-center
                                 transition-transform duration-300
                                 group-hover:scale-110"
                    >
                      <Icon
                        size={44}
                        strokeWidth={1.5}
                        className="text-brand lg:hidden"
                      />
                      <Icon
                        size={56}
                        strokeWidth={1.5}
                        className="text-brand hidden lg:block"
                      />
                    </div>

                    <h3
                      className="text-xs sm:text-sm lg:text-base font-bold 
                                 text-black leading-[1.5] 
                                 text-bangla-safe whitespace-pre-line 
                                 transition-colors duration-300
                                 group-hover:text-[#1F7A3F]"
                    >
                      {title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white h-24 sm:h-28 lg:h-32" />
      </div>
    </section>
  );
}
