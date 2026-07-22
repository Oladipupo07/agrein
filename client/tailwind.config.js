/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c5dfd3',
          300: '#9bcaab',
          400: '#68ad7f',
          500: '#469160',
          600: '#34754a',
          700: '#2a5d3c',
          800: '#234b32',
          900: '#1b3b27',
          950: '#0c1a11', // Forest deep black-green
        },
        mint: {
          50: '#f3fbf6',
          100: '#e3f7eb',
          200: '#cbf1db',
          300: '#a3e4c0',
          400: '#72cf9d',
          500: '#48b47e',
          600: '#379465',
          700: '#2f7653',
          800: '#295e43',
          900: '#234e39',
          950: '#0f2a1e',
        },
        agriBg: {
          light: '#f7faf8',
          dark: '#080f0c',
        },
        agriCard: {
          light: 'rgba(255, 255, 255, 0.75)',
          dark: 'rgba(12, 26, 17, 0.75)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(16, 185, 129, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 15px rgba(72, 180, 126, 0.4)',
      }
    },
  },
  plugins: [],
}
