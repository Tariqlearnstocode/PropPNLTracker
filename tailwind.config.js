const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
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
          bg: '#0a0a0f',
          card: '#111118',
          'card-hover': '#16161f',
          border: '#1e1e2a',
          'border-light': '#2a2a3a',
          muted: '#6b6b80',
          text: '#e4e4ed',
        },
        profit: {
          DEFAULT: '#00e676',
          dim: '#00e67620',
          muted: '#00e67640',
          glow: '#00e67610',
        },
        loss: {
          DEFAULT: '#ff5252',
          dim: '#ff525220',
          muted: '#ff525240',
        },
        accent: {
          blue: '#448aff',
          purple: '#7c4dff',
          amber: '#ffd740',
        },
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
