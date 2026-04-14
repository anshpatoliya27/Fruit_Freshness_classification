/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        fruit: {
          bg: '#F8FAF5',        // Soft leaf white
          panel: '#FFFFFF',     // Clean panel
          primary: '#22C55E',   // Fresh green
          primaryLight: '#DCFCE7', // Pale green
          yellow: '#FDE047',    // Lemon yellow
          yellowLight: '#FEF9C3', 
          red: '#EF4444',       // Rotten red
          redLight: '#FEF2F2',
          text: '#064E3B',      // Extremely dark green (acts as black)
          textMuted: '#475569', // Slate
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}