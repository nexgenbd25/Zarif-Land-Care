'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Plus,
  Minus,
  FileText,
  Clock,
  Wallet,
  FolderOpen,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';

interface FAQ {
  id: number;
  question_bn: string;
  question_en: string;
  answer_bn: string;
  answer_en: string;
  icon: LucideIcon;
}

const FAQS: FAQ[] = [
  {
    id: 1,
    question_bn: 'দলিল লেখকের কাছ থেকে আমি কী ধরনের সেবা পেতে পারি?',
    question_en: 'What types of services can I get from a deed writer?',
    answer_bn:
      'আপনি জমি বা সম্পত্তি কেনাবেচার দলিল, গিফট ডিড, হেবা ডিড, পাওয়ার অফ অ্যাটর্নি, নামজারি সংক্রান্ত ডকুমেন্ট এবং রেজিস্ট্রেশন সহায়তা সহ সম্পূর্ণ সেবা পেতে পারেন।',
    answer_en:
      'You can get complete services including land or property sale deeds, gift deeds, heba deeds, power of attorney, mutation-related documents, and registration assistance.',
    icon: FileText,
  },
  {
    id: 2,
    question_bn: 'একটি দলিল তৈরিতে সাধারণত কত সময় লাগে?',
    question_en: 'How long does it usually take to prepare a deed?',
    answer_bn:
      'সাধারণত সকল তথ্য ও কাগজপত্র ঠিক থাকলে একটি দলিল প্রস্তুত করতে ১–৩ কর্মদিবস সময় লাগে।',
    answer_en:
      'Usually, if all information and documents are correct, it takes 1–3 working days to prepare a deed.',
    icon: Clock,
  },
  {
    id: 3,
    question_bn: 'দলিল লেখকের পারিশ্রমিক কত?',
    question_en: 'What is the fee of a deed writer?',
    answer_bn:
      'এটি দলিলের ধরন ও জটিলতার উপর নির্ভর করে। তবে আমরা সরকারি নির্ধারিত ফি অনুসরণ করে স্বচ্ছ ও সাশ্রয়ী রেট দিয়ে থাকি।',
    answer_en:
      'It depends on the type and complexity of the deed. However, we follow government-fixed fees and provide transparent and affordable rates.',
    icon: Wallet,
  },
  {
    id: 4,
    question_bn: 'দলিল রেজিস্ট্রেশনের জন্য আমার কী কী কাগজপত্র লাগবে?',
    question_en: 'What documents do I need for deed registration?',
    answer_bn:
      'জমির খতিয়ান, দলিল, দাগ নম্বর, মালিকানা প্রমাণপত্র, জাতীয় পরিচয়পত্র, পাসপোর্ট সাইজ ছবি, এবং ট্যাক্স রসিদের কপি লাগবে।',
    answer_en:
      'You will need land khatian, deed, dag number, ownership proof, national ID, passport-size photo, and a copy of the tax receipt.',
    icon: FolderOpen,
  },
];

export default function FAQSection() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [openId, setOpenId] = useState<number | null>(1);

  const content = {
    heading: isBn ? 'প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Frequently Asked Questions (FAQ)',
    subheading: isBn
      ? 'Explore Common Queries in Our FAQ Section'
      : 'Explore Common Queries in Our FAQ Section',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

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

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
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
          <h2 className="heading-2 mb-4 text-bangla-safe">
            {content.heading}
          </h2>

          <p
            className="text-muted text-sm sm:text-base max-w-2xl mx-auto 
                       leading-[1.9] text-bangla-safe mb-6"
          >
            {content.subheading}
          </p>

          <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto space-y-4"
        >
          {FAQS.map((faq) => {
            const Icon = faq.icon;
            const question = isBn ? faq.question_bn : faq.question_en;
            const answer = isBn ? faq.answer_bn : faq.answer_en;
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                className="group"
              >
                <div
                  className={`relative rounded-xl overflow-hidden
                              bg-navy-dark border 
                              transition-all duration-300
                              ${
                                isOpen
                                  ? 'border-gold shadow-lg shadow-gold/10'
                                  : 'border-navy-border hover:border-gold/50'
                              }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center gap-4 
                               px-5 lg:px-6 py-5 text-left
                               transition-colors duration-200"
                  >
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-full 
                                  flex items-center justify-center
                                  transition-all duration-300
                                  ${
                                    isOpen
                                      ? 'bg-gradient-to-br from-gold to-gold-light'
                                      : 'bg-gold/10 border border-gold/30'
                                  }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={
                          isOpen ? 'text-navy' : 'text-gold'
                        }
                      />
                    </div>

                    <h3
                      className={`flex-1 font-semibold text-left 
                                  text-base lg:text-lg leading-[1.6] 
                                  text-bangla-safe transition-colors duration-300
                                  ${
                                    isOpen
                                      ? 'text-gold'
                                      : 'text-white group-hover:text-gold'
                                  }`}
                    >
                      {question}
                    </h3>

                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full 
                                  flex items-center justify-center
                                  transition-all duration-300
                                  ${
                                    isOpen
                                      ? 'bg-gold text-navy rotate-180'
                                      : 'bg-navy-border text-gray-300'
                                  }`}
                    >
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                          <div
                            className="flex items-start gap-3 
                                       pt-4 border-t border-navy-border"
                          >
                            <ArrowRight
                              size={20}
                              className="text-gold flex-shrink-0 mt-1"
                            />
                            <p
                              className="text-muted text-sm lg:text-base 
                                         leading-[1.9] text-bangla-safe"
                            >
                              {answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}