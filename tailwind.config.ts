import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
        secondary: '#EC4899',
        accent: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        bg: {
          dark: '#0A0118',
          darker: '#050010',
          card: '#1A0B2E',
          cardHover: '#2D1B4E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 2px 8px rgba(124, 58, 237, 0.1)',
        'glow-md': '0 4px 20px rgba(124, 58, 237, 0.15)',
        'glow-lg': '0 8px 40px rgba(124, 58, 237, 0.25)',
        'glow-xl': '0 0 60px rgba(124, 58, 237, 0.4)',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-card': 'floatCard 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(100px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-50px, 100px) scale(0.9)' },
        },
        floatCard: {
          '0%, 100%': { transform: 'translateY(0px) rotateY(0deg)' },
          '50%': { transform: 'translateY(-20px) rotateY(5deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
