'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, ClipboardList, FileCheck } from 'lucide-react';

interface Step {
  id: number;
  number: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  icon: typeof Phone;
}

const STEPS: Step[] = [
  {
    id: 1,
    number: '১',
    title_bn: 'যোগাযোগ করুন',
    title_en: 'Contact Us',
    description_bn: 'আমাদের সাথে ফোন বা ইমেইলের মাধ্যমে আপনার প্রয়োজন সম্পর্কে আলোচনা করুন।',
    description_en: 'Discuss your requirements with us via phone or email.',
    icon: Phone,
  },
  {
    id: 2,
    number: '২',
    title_bn: 'তথ্য প্রদান',
    title_en: 'Provide Information',
    description_bn: 'আপনার জমির দলিল এবং অন্যান্য প্রয়োজনীয় কাগজপত্র আমাদের কাছে জমা দিন।',
    description_en: 'Submit your land deed and other necessary documents to us.',
    icon: ClipboardList,
  },
  {
    id: 3,
    number: '৩',
    title_bn: 'দলিল প্রস্তুত ও নিবন্ধন',
    title_en: 'Deed Preparation & Registration',
    description_bn: 'আমরা আপনার দলিল প্রস্তুত করব এবং নিবন্ধনের জন্য সকল প্রকার সহায়তা প্রদান করব।',
    description_en: 'We will prepare your deed and provide all kinds of support for registration.',
    icon: FileCheck,
  },
];

export default function HowItWorksSection() {
  const locale = useLocale();

  const isBn = locale === 'bn';

  const content = {
    heading: isBn ? 'সেবা গ্রহণের ধাপসমূহ' : 'Steps to Get Our Service',
  };

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
          <h2 className="heading-2 mb-6 text-bangla-safe">
            {content.heading}
          </h2>

          <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <div className="hidden lg:block absolute top-20 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const title = isBn ? step.title_bn : step.title_en;
              const description = isBn ? step.description_bn : step.description_en;

              return (
                <motion.div
                  key={step.id}
                  variants={cardVariants}
                  className="group relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div
                        className="relative w-32 h-32 lg:w-36 lg:h-36 
                                   rounded-full bg-navy-dark 
                                   border-2 border-gold/30
                                   flex items-center justify-center
                                   transition-all duration-500
                                   group-hover:border-gold 
                                   group-hover:scale-105
                                   shadow-xl"
                      >
                        <Icon
                          size={52}
                          strokeWidth={1.5}
                          className="text-gold transition-all duration-500 
                                     group-hover:scale-110"
                        />
                      </div>

                      <div
                        className="absolute -top-1 -right-1 
                                   w-10 h-10 lg:w-11 lg:h-11 
                                   rounded-full 
                                   bg-gradient-to-br from-gold to-gold-light
                                   flex items-center justify-center
                                   text-navy font-bold text-base lg:text-lg
                                   shadow-lg
                                   border-4 border-navy"
                      >
                        {step.number}
                      </div>
                    </div>

                    <h3
                      className="text-lg lg:text-xl font-bold text-white mb-3 
                                 transition-colors duration-300
                                 group-hover:text-gold text-bangla-safe 
                                 leading-[1.6] pt-[0.15em]"
                    >
                      {title}
                    </h3>

                    <p
                      className="text-sm text-muted leading-[1.9] 
                                 text-bangla-safe max-w-xs mx-auto"
                    >
                      {description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}