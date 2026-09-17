'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Facebook,
  Youtube,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const LOGO_URL = 'https://i.postimg.cc/L4BcXGzb/file-0000000063fc8211bafecb49ffa1e4cf.png';

export default function Footer() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  const content = {
    description_bn:
      'দলিল লেখায় অভিজ্ঞতা ও বিশ্বস্ততার প্রতীক। জমি-জমার সমস্ত দলিল ও আইনগত সহায়তায় আপনার নির্ভরযোগ্য ঠিকানা – Zarif Land Care Center।',
    description_en:
      'Symbol of experience and trust in deed writing. Your reliable address for all land deed and legal assistance – Zarif Land Care Center.',
    usefulLinks_bn: 'গুরুত্বপূর্ণ লিংক',
    usefulLinks_en: 'Useful Links',
    policyPages_bn: 'পলিসি পেজ',
    policyPages_en: 'Policy Pages',
    contactUs_bn: 'যোগাযোগ',
    contactUs_en: 'Contact Us',
    home_bn: 'হোম',
    home_en: 'Home',
    service_bn: 'সেবাসমূহ',
    service_en: 'Service',
    privacy_bn: 'প্রাইভেসি পলিসি',
    privacy_en: 'Privacy Policy',
    terms_bn: 'শর্তাবলী',
    terms_en: 'Terms of Service',
    staking_bn: 'স্ট্যাকিং পলিসি',
    staking_en: 'Staking Policy',
    copyright_bn: 'সর্বস্বত্ব সংরক্ষিত।',
    copyright_en: 'All rights reserved.',
  };

  const description = isBn ? content.description_bn : content.description_en;
  const usefulLinksLabel = isBn ? content.usefulLinks_bn : content.usefulLinks_en;
  const policyPagesLabel = isBn ? content.policyPages_bn : content.policyPages_en;
  const contactUsLabel = isBn ? content.contactUs_bn : content.contactUs_en;
  const homeLabel = isBn ? content.home_bn : content.home_en;
  const serviceLabel = isBn ? content.service_bn : content.service_en;
  const privacyLabel = isBn ? content.privacy_bn : content.privacy_en;
  const termsLabel = isBn ? content.terms_bn : content.terms_en;
  const stakingLabel = isBn ? content.staking_bn : content.staking_en;
  const copyrightText = isBn ? content.copyright_bn : content.copyright_en;

  const usefulLinks = [
    { name: homeLabel, href: getUrl('/') },
    { name: serviceLabel, href: getUrl('/services') },
  ];

  const policyLinks = [
    { name: privacyLabel, href: getUrl('/privacy-policy') },
    { name: termsLabel, href: getUrl('/terms-of-service') },
    { name: stakingLabel, href: getUrl('/staking-policy') },
  ];

  const contacts = [
    {
      text_bn:
        'হাসাইল বাজার, সামছুল হক মাঝি মার্কেট, টঙ্গীবাড়ি মুন্সিগঞ্জ।',
      text_en:
        'Hasail Bazar, Samchul Haque Majhi Market, Tongibari Munshiganj.',
      phone: '+8801788766735',
    },
    {
      text_bn:
        'কামারখাড়া বাজার, হাইস্কুলের পুকুরের পশ্চিম পাশে, কামারখাড়া, টংগিবাড়ী, মুন্সিগঞ্জ।',
      text_en:
        'Kamarkhara Bazar, West side of High School pond, Kamarkhara, Tongibari, Munshiganj.',
      phone: '+8801531568468',
    },
    {
      text_bn:
        'ঠিনারাঃ- পাঁচগাও বাজার, মোল্লা মার্কেট, টংগিবাড়ী, মুন্সিগঞ্জ।',
      text_en:
        'Thinara: Panchgaon Bazar, Molla Market, Tongibari, Munshiganj.',
      phone: null,
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://facebook.com',
      label: 'Facebook',
      color: 'hover:bg-blue-600',
    },
    {
      icon: Youtube,
      href: 'https://youtube.com',
      label: 'YouTube',
      color: 'hover:bg-red-600',
    },
    {
      icon: MessageCircle,
      href: 'https://wa.me/8801788766735',
      label: 'WhatsApp',
      color: 'hover:bg-green-600',
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <footer className="relative overflow-hidden bg-navy-dark">
      <div
        className="absolute top-0 left-0 right-0 h-1 
                   bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <div
        className="absolute top-0 left-1/4 w-[400px] h-[400px] 
                   bg-gold/5 rounded-full blur-[140px] -z-0"
      />

      <div className="container-custom relative z-10 pt-12 pb-6 lg:pt-16 lg:pb-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 
                     gap-8 md:gap-10 lg:gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <Link href={getUrl('/')} className="inline-block mb-5 group">
              <Image
                src={LOGO_URL}
                alt="Zarif Landcare Center"
                width={240}
                height={72}
                className="h-16 lg:h-20 w-auto object-contain 
                           transition-transform duration-300 
                           group-hover:scale-105"
                unoptimized
              />
            </Link>

            <p
              className="text-gray-300 text-sm lg:text-base leading-[1.9] 
                         text-bangla-safe mb-6 max-w-md"
            >
              {description}
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-11 h-11 lg:w-12 lg:h-12 rounded-full 
                               bg-navy border border-gold/30
                               flex items-center justify-center
                               text-gold transition-all duration-300
                               hover:text-white hover:border-transparent
                               hover:scale-110 ${social.color}`}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <h3
              className="text-white font-bold text-base lg:text-lg mb-4 
                         text-bangla-safe relative inline-block"
            >
              {usefulLinksLabel}
              <span
                className="absolute -bottom-1.5 left-0 w-10 h-0.5 
                           bg-gradient-gold rounded-full"
              />
            </h3>

            <ul className="space-y-2.5 mt-5">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 
                               text-gray-300 hover:text-gold 
                               transition-all duration-300 
                               text-sm lg:text-base"
                  >
                    <ArrowRight
                      size={14}
                      className="text-gold transition-transform 
                                 group-hover:translate-x-1 
                                 flex-shrink-0"
                    />
                    <span className="text-bangla-safe">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <h3
              className="text-white font-bold text-base lg:text-lg mb-4 
                         text-bangla-safe relative inline-block"
            >
              {policyPagesLabel}
              <span
                className="absolute -bottom-1.5 left-0 w-10 h-0.5 
                           bg-gradient-gold rounded-full"
              />
            </h3>

            <ul className="space-y-2.5 mt-5">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 
                               text-gray-300 hover:text-gold 
                               transition-all duration-300 
                               text-sm lg:text-base"
                  >
                    <ArrowRight
                      size={14}
                      className="text-gold transition-transform 
                                 group-hover:translate-x-1 
                                 flex-shrink-0"
                    />
                    <span className="text-bangla-safe">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <h3
              className="text-white font-bold text-base lg:text-lg mb-4 
                         text-bangla-safe relative inline-block"
            >
              {contactUsLabel}
              <span
                className="absolute -bottom-1.5 left-0 w-10 h-0.5 
                           bg-gradient-gold rounded-full"
              />
            </h3>

            <ul className="space-y-3 mt-5">
              {contacts.map((contact, index) => {
                const text = isBn ? contact.text_bn : contact.text_en;
                return (
                  <li key={index} className="flex items-start gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full bg-gold/10 
                                 border border-gold/20
                                 flex items-center justify-center 
                                 flex-shrink-0 mt-0.5"
                    >
                      <MapPin size={14} className="text-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-gray-300 text-sm lg:text-base 
                                   leading-[1.7] text-bangla-safe 
                                   break-words"
                      >
                        {text}
                      </p>
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-flex items-center gap-1.5 
                                     text-gold hover:text-gold-light 
                                     transition-colors text-sm lg:text-base 
                                     font-medium mt-1"
                        >
                          <Phone size={13} />
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gold/10">
              <a
                href="mailto:zariflandcare@gmail.com"
                className="flex items-center gap-2.5 text-gray-300 
                           hover:text-gold transition-colors 
                           text-sm lg:text-base group"
              >
                <div
                  className="w-8 h-8 rounded-full 
                             bg-gradient-to-br from-gold to-gold-light
                             flex items-center justify-center 
                             flex-shrink-0
                             transition-transform duration-300
                             group-hover:scale-110"
                >
                  <Mail size={14} className="text-navy" />
                </div>
                <span className="break-all text-bangla-safe">
                  zariflandcare@gmail.com
                </span>
              </a>

              <a
                href="tel:+8801788766735"
                className="flex items-center gap-2.5 text-gray-300 
                           hover:text-gold transition-colors 
                           text-sm lg:text-base group"
              >
                <div
                  className="w-8 h-8 rounded-full 
                             bg-gradient-to-br from-gold to-gold-light
                             flex items-center justify-center 
                             flex-shrink-0
                             transition-transform duration-300
                             group-hover:scale-110"
                >
                  <Phone size={14} className="text-navy" />
                </div>
                <span className="text-bangla-safe">
                  +8801788766735
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-8 lg:mt-10 pt-5 border-t border-gold/10">
          <p
            className="text-gray-400 text-xs lg:text-sm text-center
                       text-bangla-safe"
          >
            © {new Date().getFullYear()} Zarif Land Care Center. {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}