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
        navy: {
          DEFAULT: '#0B132B',
          dark: '#0F172A',
          light: '#1E293B',
          border: '#1E293B',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F59E0B',
          dark: '#B8941F',
        },
        brand: {
          orange: '#EA580C',
          red: '#DC2626',
        },
        status: {
          success: '#22C55E',
          warning: '#EAB308',
          error: '#EF4444',
          info: '#3B82F6',
        },
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
      // FONT SIZES (বাংলার জন্য line-height বাড়ানো)
      // ============================================
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.6' }],
        sm: ['0.875rem', { lineHeight: '1.65' }],
        base: ['1rem', { lineHeight: '1.75' }],
        lg: ['1.125rem', { lineHeight: '1.8' }],
        xl: ['1.25rem', { lineHeight: '1.8' }],
        '2xl': ['1.5rem', { lineHeight: '1.7' }],
        '3xl': ['1.875rem', { lineHeight: '1.6' }],
        '4xl': ['2.25rem', { lineHeight: '1.5' }],
        '5xl': ['3rem', { lineHeight: '1.4' }],
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
      // SPACING
      // ============================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      borderRadius: {
        '4xl': '2rem',
      },

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