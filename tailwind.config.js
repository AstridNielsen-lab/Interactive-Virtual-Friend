/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
          '25%': { transform: 'translate(-2px, -2px) rotate(-1deg)' },
          '50%': { transform: 'translate(2px, 2px) rotate(1deg)' },
          '75%': { transform: 'translate(-2px, 2px) rotate(-1deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'cartoon': '0 5px 15px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
          '25%': { transform: 'translate(-2px, -2px) rotate(-1deg)' },
          '50%': { transform: 'translate(2px, 2px) rotate(1deg)' },
          '75%': { transform: 'translate(-2px, 2px) rotate(-1deg)' },
        }
      },
      boxShadow: {
        'cartoon': '0 5px 15px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
