/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FFB347',
          500: '#FFA500',
          600: '#E8930A',
          700: '#CC7A00',
        },
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'marquee-left': 'marquee-left 40s linear infinite',
        'marquee-right': 'marquee-right 40s linear infinite',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-33.33%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
