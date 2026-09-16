import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ============================================
      // ZARIF BRAND COLORS
      // ============================================
      colors: {
        // Primary Navy (মূল ব্যাকগ্রাউন্ড)
        navy: {
          DEFAULT: '#0B132B',
          dark: '#0F172A',
          light: '#1E293B',
          border: '#1E293B',
        },
        // Accent Gold (লোগো, হাইলাইট)
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F59E0B',
          dark: '#B8941F',
        },
        // Action Orange (CTA বাটন)
        brand: {
          orange: '#EA580C',
          red: '#DC2626',
        },
        // Status Colors
        status: {
          success: '#22C55E',
          warning: '#EAB308',
          error: '#EF4444',
          info: '#3B82F6',
        },
        // Muted Text
        muted: {
          DEFAULT: '#94A3B8',
          dark: '#64748B',
        },
      },

      // ============================================
      // FONTS
      // ============================================
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-hind)', 'sans-serif'],
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // ============================================
      // KEYFRAMES
      // ============================================
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      // ============================================
      // SPACING (নতুন কিছু কাস্টম স্পেস)
      // ============================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ============================================
      // MAX WIDTH
      // ============================================
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        '4xl': '2rem',
      },

      // ============================================
      // BOX SHADOW
      // ============================================
      boxShadow: {
        'glow-gold': '0 0 30px rgba(212, 175, 55, 0.3)',
        'glow-orange': '0 0 30px rgba(234, 88, 12, 0.3)',
        'inner-gold': 'inset 0 0 20px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;