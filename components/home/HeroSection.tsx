'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { FileText, Monitor, Printer, Smartphone } from 'lucide-react';

const HERO_BG =
  'https://i.postimg.cc/cHg8hVSB/file-0000000076f48211bea028ad9978bf68.png';

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
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container-custom relative z-10 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.5rem] 
                         font-bold text-white mb-8 
                         leading-[1.5] pt-[0.2em] pb-[0.05em]
                         text-bangla-safe drop-shadow-lg"
            >
              {headline}
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href={getUrl('/contact')}
                className="inline-flex items-center justify-center
                           px-7 py-3.5 rounded-md font-bold
                           bg-brand text-white
                           transition-all duration-300
                           hover:bg-brand-dark
                           active:scale-95
                           w-full sm:w-auto
                           text-base"
              >
                <span className="text-bangla-safe">{cta1}</span>
              </Link>

              <a
                href="tel:+8801788766735"
                className="inline-flex items-center justify-center
                           px-7 py-3.5 rounded-md font-bold
                           border-2 border-white text-white
                           bg-white/5 backdrop-blur-sm
                           transition-all duration-300
                           hover:bg-white hover:text-brand
                           active:scale-95
                           w-full sm:w-auto
                           text-base"
              >
                <span className="text-bangla-safe">{cta2}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="container-custom relative z-20 pb-12 lg:pb-16 -mt-12 sm:-mt-16 lg:-mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const title = isBn ? feature.title_bn : feature.title_en;

              return (
                <div
                  key={feature.id}
                  className="group rounded-xl p-5 lg:p-7 text-center
                             bg-white/10 backdrop-blur-md
                             border border-white/20
                             shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                             transition-all duration-300
                             hover:-translate-y-1 
                             hover:bg-white/15
                             hover:border-white/40
                             hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                >
                  <div
                    className="w-14 h-14 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 
                               rounded-full bg-brand flex items-center justify-center
                               shadow-lg
                               transition-transform duration-300
                               group-hover:scale-110"
                  >
                    <Icon
                      size={28}
                      strokeWidth={1.8}
                      className="text-white lg:hidden"
                    />
                    <Icon
                      size={38}
                      strokeWidth={1.8}
                      className="text-white hidden lg:block"
                    />
                  </div>

                  <h3
                    className="text-xs sm:text-sm lg:text-base font-bold 
                               text-white leading-[1.5] 
                               text-bangla-safe whitespace-pre-line
                               drop-shadow-md"
                  >
                    {title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
