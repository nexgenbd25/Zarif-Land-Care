'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
      {/* ============================================
          Grid Pattern (খুব হালকা)
          ============================================ */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* ============================================
          Only 2 Orbs (Performance-optimized)
          ============================================ */}

      {/* Gold Orb - Top Right */}
      <motion.div
        animate={{
          opacity: [0.04, 0.06, 0.04],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] 
                   bg-gold rounded-full blur-[180px]"
        style={{ willChange: 'opacity, transform' }}
      />

      {/* Orange Orb - Bottom Left */}
      <motion.div
        animate={{
          opacity: [0.03, 0.05, 0.03],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] 
                   bg-brand-orange rounded-full blur-[180px]"
        style={{ willChange: 'opacity, transform' }}
      />

      {/* ============================================
          Few Floating Particles (6টি only)
          ============================================ */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
          className="absolute w-0.5 h-0.5 bg-gold/40 rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + i * 10}%`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* ============================================
          Top & Bottom Fade
          ============================================ */}
      <div className="absolute top-0 left-0 right-0 h-40 
                      bg-gradient-to-b from-navy via-navy/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 
                      bg-gradient-to-t from-navy via-navy/50 to-transparent" />
    </div>
  );
}