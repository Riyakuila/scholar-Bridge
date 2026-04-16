/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1b6fb',
          400: '#6d89f7',
          500: '#4358f1',
          600: '#2c39e5', // Primary Brand Color
          700: '#242cc7',
          800: '#2227a1',
          900: '#212680',
        },
      },
    },
  },
  plugins: [],
}