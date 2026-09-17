'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

interface BlogPost {
  id: number;
  title_bn: string;
  title_en: string;
  excerpt_bn: string;
  excerpt_en: string;
  image_url: string;
  date_bn: string;
  date_en: string;
  slug: string;
}

const BLOGS: BlogPost[] = [
  {
    id: 1,
    title_bn: 'TIN সার্টিফিকেট',
    title_en: 'TIN Certificate',
    excerpt_bn: 'জমি বা সম্পত্তি কেনাবেচার জন্য TIN সার্টিফিকেট প্রয়োজন। কীভাবে সহজে TIN সার্টিফিকেট পাবেন, তার সম্পূর্ণ তথ্য।',
    excerpt_en: 'TIN certificate is required for buying or selling land or property. Complete information on how to easily get a TIN certificate.',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    date_bn: '২৭ জুলাই, ২০২৫',
    date_en: '27 July, 2025',
    slug: 'tin-certificate',
  },
  {
    id: 2,
    title_bn: 'দলিল লেখকের কাছ থেকে সেবা নেওয়ার সঠিক নিয়ম',
    title_en: 'Proper Rules for Getting Service from Deed Writer',
    excerpt_bn: 'সঠিক দলিল লেখক নির্বাচন থেকে শুরু করে দলিল সম্পূর্ণ হওয়া পর্যন্ত প্রতিটি ধাপে কী কী বিষয় খেয়াল রাখা উচিত।',
    excerpt_en: 'From choosing the right deed writer to completing the deed, what to look for at every step.',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    date_bn: '১৫ জুন, ২০২৫',
    date_en: '15 June, 2025',
    slug: 'deed-writer-service-rules',
  },
  {
    id: 3,
    title_bn: 'নামজারি ও খারিজ প্রক্রিয়া',
    title_en: 'Namjari & Kharij Process',
    excerpt_bn: 'জমির নামজারি ও খারিজ প্রক্রিয়ার প্রতিটি ধাপ, প্রয়োজনীয় কাগজপত্র এবং সময় সম্পর্কে সম্পূর্ণ গাইড।',
    excerpt_en: 'Complete guide on every step of land mutation and kharij process, required documents, and time.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    date_bn: '১০ মে, ২০২৫',
    date_en: '10 May, 2025',
    slug: 'namjari-kharij-process',
  },
];

export default function BlogSection() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const getUrl = (path: string) => {
    const prefix = locale === 'bn' ? '' : `/${locale}`;
    return path === '/' ? prefix || '/' : `${prefix}${path}`;
  };

  const content = {
    heading_bn: 'সর্বশেষ ঘোষণা',
    heading_en: 'Latest Announcements',
    subheading_bn: 'আমাদের ব্লগ থেকে সাম্প্রতিক আপডেট, টিপস ও পরামর্শ দেখুন',
    subheading_en: 'Explore the Latest Trends, Tips, and Analysis in Our Blog',
    readMore_bn: 'আরও পড়ুন',
    readMore_en: 'Read More',
    viewAll_bn: 'সব দেখুন',
    viewAll_en: 'View All',
  };

  const heading = isBn ? content.heading_bn : content.heading_en;
  const subheading = isBn ? content.subheading_bn : content.subheading_en;
  const readMore = isBn ? content.readMore_bn : content.readMore_en;
  const viewAll = isBn ? content.viewAll_bn : content.viewAll_en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative overflow-hidden section-padding bg-navy
                        border-b border-navy-border">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 
                   w-[600px] h-[600px] bg-gold/5 rounded-full 
                   blur-[140px] -z-0"
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {BLOGS.map((blog) => {
            const title = isBn ? blog.title_bn : blog.title_en;
            const excerpt = isBn ? blog.excerpt_bn : blog.excerpt_en;
            const date = isBn ? blog.date_bn : blog.date_en;

            return (
              <motion.div
                key={blog.id}
                variants={cardVariants}
                className="group"
              >
                <Link href={getUrl(`/blog/${blog.slug}`)} className="block h-full">
                  <div
                    className="relative h-full flex flex-col
                               bg-navy-dark border border-navy-border 
                               rounded-2xl overflow-hidden
                               transition-all duration-500
                               hover:border-gold hover:-translate-y-2
                               hover:shadow-2xl hover:shadow-gold/10"
                  >
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <Image
                        src={blog.image_url}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center 
                                   transition-transform duration-700
                                   group-hover:scale-110"
                        unoptimized
                      />

                      <div
                        className="absolute inset-0 
                                   bg-gradient-to-t 
                                   from-navy-dark via-navy-dark/40 to-transparent"
                      />
                    </div>

                    <div className="relative flex-1 flex flex-col p-5 lg:p-6">
                      <div
                        className="flex items-center gap-2 mb-3 
                                   text-xs text-muted"
                      >
                        <Calendar size={14} className="text-gold" />
                        <span className="text-bangla-safe">{date}</span>
                      </div>

                      <h3
                        className="text-lg lg:text-xl font-bold text-white 
                                   mb-3 leading-[1.5] text-bangla-safe
                                   transition-colors duration-300
                                   group-hover:text-gold"
                      >
                        {title}
                      </h3>

                      <p
                        className="text-sm text-muted leading-[1.85] 
                                   text-bangla-safe mb-5 flex-1
                                   line-clamp-3"
                      >
                        {excerpt}
                      </p>

                      <div
                        className="flex items-center gap-2 
                                   text-gold text-sm font-semibold
                                   transition-all duration-300
                                   group-hover:gap-3 mt-auto"
                      >
                        <span className="text-bangla-safe">{readMore}</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300
                                     group-hover:translate-x-1"
                        />
                      </div>
                    </div>

                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 
                                 bg-gradient-to-r from-transparent via-gold to-transparent
                                 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-500"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 lg:mt-16"
        >
          <Link
            href={getUrl('/blog')}
            className="inline-flex items-center gap-2 
                       px-6 py-3 rounded-lg
                       border-2 border-gold text-gold
                       hover:bg-gold hover:text-navy
                       transition-all duration-300
                       font-semibold text-sm group"
          >
            <span className="text-bangla-safe">{viewAll}</span>
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}