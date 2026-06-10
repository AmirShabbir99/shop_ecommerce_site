/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:   { DEFAULT: '#0A0A0A', light: '#1a1a1a' },
        accent:  { DEFAULT: '#E8C547', hover: '#d4b13e' },
        accent2: { DEFAULT: '#FF6B35', hover: '#e05a2a' },
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-down':'slideDown 0.4s ease forwards',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideDown: { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
