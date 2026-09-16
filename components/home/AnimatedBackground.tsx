'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
      {/* ============================================
          LAYER 1: Grid Pattern
          ============================================ */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ============================================
          LAYER 2: Animated Gradient Orbs
          ============================================ */}

      {/* Gold Orb - Top Right */}
      <motion.div
        animate={{
          x: [0, 50, 0, -30, 0],
          y: [0, -30, 20, 0, 0],
          scale: [1, 1.2, 1.1, 0.9, 1],
          opacity: [0.15, 0.25, 0.2, 0.15, 0.15],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] 
                   bg-gold rounded-full blur-[120px]"
      />

      {/* Orange Orb - Bottom Left */}
      <motion.div
        animate={{
          x: [0, -50, 30, 0, 0],
          y: [0, 30, -20, 0, 0],
          scale: [1, 1.3, 0.9, 1.1, 1],
          opacity: [0.1, 0.2, 0.15, 0.1, 0.1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] 
                   bg-brand-orange rounded-full blur-[120px]"
      />

      {/* Blue Orb - Center */}
      <motion.div
        animate={{
          x: [0, 30, -40, 20, 0],
          y: [0, -40, 30, -20, 0],
          scale: [1, 0.9, 1.2, 1, 1],
          opacity: [0.08, 0.15, 0.12, 0.08, 0.08],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[600px] h-[600px] bg-blue-500 rounded-full blur-[140px]"
      />

      {/* ============================================
          LAYER 3: Floating Particles (Stars)
          ============================================ */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            opacity: 0,
          }}
          animate={{
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
          className="absolute w-1 h-1 bg-gold rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* ============================================
          LAYER 4: Top & Bottom Gradient Fade
          ============================================ */}
      <div className="absolute top-0 left-0 right-0 h-32 
                      bg-gradient-to-b from-navy to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 
                      bg-gradient-to-t from-navy to-transparent" />
    </div>
  );
}