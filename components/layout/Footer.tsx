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
  Heart,
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
    followUs_bn: 'আমাদের ফলো করুন',
    followUs_en: 'Follow Us',
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
    madeWith_bn: 'ভালোবাসা দিয়ে তৈরি',
    madeWith_en: 'Made with',
    by_bn: 'দ্বারা',
    by_en: 'by',
  };

  const description = isBn ? content.description_bn : content.description_en;
  const usefulLinksLabel = isBn ? content.usefulLinks_bn : content.usefulLinks_en;
  const policyPagesLabel = isBn ? content.policyPages_bn : content.policyPages_en;
  const contactUsLabel = isBn ? content.contactUs_bn : content.contactUs_en;
  const followUsLabel = isBn ? content.followUs_bn : content.followUs_en;
  const homeLabel = isBn ? content.home_bn : content.home_en;
  const serviceLabel = isBn ? content.service_bn : content.service_en;
  const privacyLabel = isBn ? content.privacy_bn : content.privacy_en;
  const termsLabel = isBn ? content.terms_bn : content.terms_en;
  const stakingLabel = isBn ? content.staking_bn : content.staking_en;
  const copyrightText = isBn ? content.copyright_bn : content.copyright_en;
  const madeWithText = isBn ? content.madeWith_bn : content.madeWith_en;

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
      icon: MapPin,
      text_bn:
        'হাসাইল বাজার, সামছুল হক মাঝি মার্কেট, টঙ্গীবাড়ি মুন্সিগঞ্জ।',
      text_en:
        'Hasail Bazar, Samchul Haque Majhi Market, Tongibari Munshiganj.',
      phone: '+8801788766735',
    },
    {
      icon: MapPin,
      text_bn:
        'কামারখাড়া বাজার, হাইস্কুলের পুকুরের পশ্চিম পাশে, কামারখাড়া, টংগিবাড়ী, মুন্সিগঞ্জ।',
      text_en:
        'Kamarkhara Bazar, West side of High School pond, Kamarkhara, Tongibari, Munshiganj.',
      phone: '+8801531568468',
    },
    {
      icon: MapPin,
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
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] 
                   bg-blue-500/5 rounded-full blur-[140px] -z-0"
      />

      <div className="container-custom relative z-10 pt-14 pb-8 lg:pt-20 lg:pb-10">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link
              href={getUrl('/')}
              className="inline-block mb-6 group"
            >
              <Image
                src={LOGO_URL}
                alt="Zarif Landcare Center"
                width={240}
                height={72}
                className="h-14 lg:h-16 w-auto object-contain 
                           transition-transform duration-300 
                           group-hover:scale-105"
                unoptimized
              />
            </Link>

            <p
              className="text-gray-300 text-sm leading-[1.9] 
                         text-bangla-safe mb-6"
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
                    className={`w-10 h-10 rounded-full 
                               bg-navy border border-gold/30
                               flex items-center justify-center
                               text-gold transition-all duration-300
                               hover:text-white hover:border-transparent
                               hover:scale-110 ${social.color}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3
              className="text-white font-bold text-lg mb-5 
                         text-bangla-safe relative inline-block"
            >
              {usefulLinksLabel}
              <span
                className="absolute -bottom-2 left-0 w-12 h-0.5 
                           bg-gradient-gold rounded-full"
              />
            </h3>

            <ul className="space-y-3 mt-6">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 
                               text-gray-300 hover:text-gold 
                               transition-all duration-300 
                               text-sm"
                  >
                    <ArrowRight
                      size={14}
                      className="text-gold transition-transform 
                                 group-hover:translate-x-1"
                    />
                    <span className="text-bangla-safe">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3
              className="text-white font-bold text-lg mb-5 
                         text-bangla-safe relative inline-block"
            >
              {policyPagesLabel}
              <span
                className="absolute -bottom-2 left-0 w-12 h-0.5 
                           bg-gradient-gold rounded-full"
              />
            </h3>

            <ul className="space-y-3 mt-6">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 
                               text-gray-300 hover:text-gold 
                               transition-all duration-300 
                               text-sm"
                  >
                    <ArrowRight
                      size={14}
                      className="text-gold transition-transform 
                                 group-hover:translate-x-1"
                    />
                    <span className="text-bangla-safe">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
            <h3
              className="text-white font-bold text-lg mb-5 
                         text-bangla-safe relative inline-block"
            >
              {contactUsLabel}
              <span
                className="absolute -bottom-2 left-0 w-12 h-0.5 
                           bg-gradient-gold rounded-full"
              />
            </h3>

            <ul className="space-y-4 mt-6">
              {contacts.map((contact, index) => {
                const Icon = contact.icon;
                const text = isBn ? contact.text_bn : contact.text_en;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full bg-gold/10 
                                 border border-gold/20
                                 flex items-center justify-center 
                                 flex-shrink-0 mt-1"
                    >
                      <Icon size={13} className="text-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-gray-300 text-xs lg:text-sm 
                                   leading-[1.8] text-bangla-safe 
                                   break-words"
                      >
                        {text}
                      </p>
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-flex items-center gap-1.5 
                                     text-gold hover:text-gold-light 
                                     transition-colors text-xs lg:text-sm 
                                     font-medium mt-1"
                        >
                          <Phone size={11} />
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}

              <li className="flex items-center gap-3 pt-2 border-t border-gold/10">
                <div
                  className="w-7 h-7 rounded-full 
                             bg-gradient-to-br from-gold to-gold-light
                             flex items-center justify-center flex-shrink-0"
                >
                  <Mail size={13} className="text-navy" />
                </div>
                <a
                  href="mailto:zariflandcare@gmail.com"
                  className="text-gold hover:text-gold-light 
                             transition-colors text-xs lg:text-sm 
                             font-medium break-all"
                >
                  zariflandcare@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full 
                             bg-gradient-to-br from-gold to-gold-light
                             flex items-center justify-center flex-shrink-0"
                >
                  <Phone size={13} className="text-navy" />
                </div>
                <a
                  href="tel:+8801788766735"
                  className="text-gold hover:text-gold-light 
                             transition-colors text-xs lg:text-sm 
                             font-medium"
                >
                  +8801788766735
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-12 lg:mt-16 pt-8 border-t border-gold/10">
          <div
            className="flex flex-col md:flex-row items-center 
                       justify-between gap-4"
          >
            <p
              className="text-gray-400 text-xs lg:text-sm text-center md:text-left
                         text-bangla-safe"
            >
              © {new Date().getFullYear()} Zarif Land Care Center. {copyrightText}
            </p>

            <p
              className="text-gray-400 text-xs lg:text-sm flex items-center gap-1.5
                         text-bangla-safe"
            >
              {madeWithText}{' '}
              <Heart
                size={14}
                className="text-gold fill-gold animate-pulse"
              />{' '}
              Zarif Land Care Center
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}