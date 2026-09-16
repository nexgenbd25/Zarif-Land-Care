'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================
// ডেমো ছবি (পরে Database থেকে আসবে)
// ============================================
const HERO_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80',
    alt_bn: 'জমির দলিল প্রস্তুতি',
    alt_en: 'Land deed preparation',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    alt_bn: 'সম্পত্তির কাগজপত্র',
    alt_en: 'Property documents',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80',
    alt_bn: 'আইনি পরামর্শ',
    alt_en: 'Legal consultation',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80',
    alt_bn: 'হ্যান্ডশেক - চুক্তি',
    alt_en: 'Handshake - Agreement',
  },
];

// ============================================
// Auto Slide Interval (milliseconds)
// ============================================
const AUTO_SLIDE_INTERVAL = 4000; // ৪ সেকেন্ড

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================
  // পরের ছবিতে যাওয়া
  // ============================================
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  // ============================================
  // আগের ছবিতে যাওয়া
  // ============================================
  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length
    );
  }, []);

  // ============================================
  // নির্দিষ্ট ছবিতে যাওয়া
  // ============================================
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // ============================================
  // Auto Slide Logic
  // ============================================
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, AUTO_SLIDE_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, goToNext]);

  // ============================================
  // Mouse Events (Desktop)
  // ============================================
  const handleMouseDown = () => {
    setIsPaused(true);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsPaused(false);
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsPaused(false);
      setIsDragging(false);
    }
  };

  // ============================================
  // Touch Events (Mobile)
  // ============================================
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) {
      setIsPaused(false);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = null;
    setIsPaused(false);
  };

  // ============================================
  // Global MouseUp
  // ============================================
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsPaused(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden
                 shadow-glow-gold select-none group"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ============================================
          IMAGE SLIDES
          ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_IMAGES[currentIndex].url}
            alt={HERO_IMAGES[currentIndex].alt_bn}
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover pointer-events-none"
            draggable={false}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t 
                          from-navy/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ============================================
          PREV BUTTON (Desktop Only)
          ============================================ */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrev();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 rounded-full items-center justify-center
                   bg-navy/70 backdrop-blur-sm
                   text-white hover:bg-gold hover:text-navy
                   border border-white/20 hover:border-gold
                   transition-all duration-200
                   opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>

      {/* ============================================
          NEXT BUTTON (Desktop Only)
          ============================================ */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 rounded-full items-center justify-center
                   bg-navy/70 backdrop-blur-sm
                   text-white hover:bg-gold hover:text-navy
                   border border-white/20 hover:border-gold
                   transition-all duration-200
                   opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* ============================================
          DOTS INDICATOR (Bottom)
          ============================================ */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20
                      flex items-center gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`transition-all duration-300 rounded-full
                        ${
                          index === currentIndex
                            ? 'w-8 h-2 bg-gold'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                        }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ============================================
          PROGRESS BAR (Auto Slide চলাকালে)
          ============================================ */}
      {!isPaused && (
        <motion.div
          key={currentIndex}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTO_SLIDE_INTERVAL / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-gold z-20"
        />
      )}
    </div>
  );
}