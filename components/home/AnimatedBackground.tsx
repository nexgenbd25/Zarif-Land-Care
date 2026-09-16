'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-0 pointer-events-none">
      {/* ============================================
          LAYER 1: Subtle Grid Pattern
          ============================================ */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ============================================
          LAYER 2: Very Subtle Gradient Orbs
          (খুব হালকা আভা, UI নষ্ট করবে না)
          ============================================ */}

      {/* Gold Orb - Top Right (Very Subtle) */}
      <motion.div
        animate={{
          x: [0, 40, 0, -20, 0],
          y: [0, -20, 15, 0, 0],
          scale: [1, 1.1, 1, 1, 1],
          opacity: [0.04, 0.06, 0.05, 0.04, 0.04],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] 
                   bg-gold rounded-full blur-[180px]"
      />

      {/* Orange Orb - Bottom Left (Very Subtle) */}
      <motion.div
        animate={{
          x: [0, -40, 20, 0, 0],
          y: [0, 25, -15, 0, 0],
          scale: [1, 1.15, 0.95, 1, 1],
          opacity: [0.03, 0.05, 0.04, 0.03, 0.03],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] 
                   bg-brand-orange rounded-full blur-[180px]"
      />

      {/* ============================================
          LAYER 3: Very Subtle Floating Particles
          ============================================ */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
          }}
          animate={{
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
          className="absolute w-0.5 h-0.5 bg-gold/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* ============================================
          LAYER 4: Top & Bottom Gradient Fade
          (কনটেন্টের সাথে smooth transition)
          ============================================ */}
      <div className="absolute top-0 left-0 right-0 h-40 
                      bg-gradient-to-b from-navy via-navy/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 
                      bg-gradient-to-t from-navy via-navy/50 to-transparent" />
    </div>
  );
}