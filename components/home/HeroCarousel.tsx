'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80',
    alt_bn: 'জমির দলিল প্রস্তুতি',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    alt_bn: 'সম্পত্তির কাগজপত্র',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80',
    alt_bn: 'আইনি পরামর্শ',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80',
    alt_bn: 'হ্যান্ডশেক - চুক্তি',
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length
    );
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

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
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden
                   shadow-lg select-none group"
        style={{ aspectRatio: '16 / 9' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex h-full"
          animate={{
            x: `-${currentIndex * 100}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 30,
          }}
        >
          {HERO_IMAGES.map((image) => (
            <div
              key={image.id}
              className="relative flex-shrink-0 w-full h-full"
            >
              <Image
                src={image.url}
                alt={image.alt_bn}
                fill
                priority={image.id === 1}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover pointer-events-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t 
                           from-navy/70 via-transparent to-transparent"
              />
            </div>
          ))}
        </motion.div>

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
                     transition-all duration-200
                     opacity-0 group-hover:opacity-100"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

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
                     transition-all duration-200
                     opacity-0 group-hover:opacity-100"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 z-20
                        flex items-center gap-1.5 lg:gap-2">
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
                              ? 'w-6 lg:w-8 h-1.5 lg:h-2 bg-gold'
                              : 'w-1.5 lg:w-2 h-1.5 lg:h-2 bg-white/50 hover:bg-white/80'
                          }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {!isPaused && (
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: AUTO_SLIDE_INTERVAL / 1000,
              ease: 'linear',
            }}
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-gold z-20"
          />
        )}
      </div>
    </div>
  );
}