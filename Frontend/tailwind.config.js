/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fruit: {
          green: '#6BCB77',
          red: '#FF4D4D',
          yellow: '#FFD84D',
          bg: '#F9FAFB'
        }
      }
    },
  },
  plugins: [],
}