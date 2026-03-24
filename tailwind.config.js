const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'var(--font-sans)', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Inter', 'var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        terminal: {
          bg: '#f8f9fb',
          card: '#ffffff',
          'card-hover': '#f3f4f6',
          header: '#ffffff',
          border: '#e5e7eb',
          'border-light': '#d1d5db',
          muted: '#6b7280',
          text: '#111827',
        },
        profit: {
          DEFAULT: '#00c853',
          dim: 'rgba(0, 200, 83, 0.08)',
          muted: 'rgba(0, 200, 83, 0.2)',
          glow: 'rgba(0, 200, 83, 0.06)',
          light: '#00e676',
        },
        loss: {
          DEFAULT: '#ef4444',
          dim: '#ef444415',
          muted: '#ef444430',
          light: '#f87171',
        },
        accent: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          amber: '#f59e0b',
        },
      },
      backgroundImage: {
        'gradient-nav': 'linear-gradient(to right, rgba(0,200,83,0.06), rgba(0,200,83,0.02), #ffffff)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(0,200,83,0.06) 0%, rgba(0,200,83,0.02) 30%, #f8f9fb 100%)',
        'gradient-hero-short': 'linear-gradient(to bottom, rgba(0,200,83,0.06) 0%, rgba(0,200,83,0.02) 100%)',
        'gradient-profit-bar': 'linear-gradient(90deg, #00c853, #00e676)',
        'gradient-loss-bar': 'linear-gradient(90deg, #ef4444, #f87171)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 230, 118, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 230, 118, 0.2)' }
        },
        'number-tick': {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'number-tick': 'number-tick 0.3s ease-out forwards',
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
