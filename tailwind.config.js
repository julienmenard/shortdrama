/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pink': {
          500: '#ff2d55', // Brighter pink for the ShortDrama brand
          600: '#e0285d',
          700: '#c02554'
        }
      },
      animation: {
        'swipe-up': 'swipeUp 0.3s ease-in-out',
      },
      keyframes: {
        swipeUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};