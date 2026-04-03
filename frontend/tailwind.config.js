/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hospital-green': '#0d9488',
        primary: '#0d9488', // Teal/deep green tone
        secondary: '#0f766e',
        dark: '#111827',
        darker: '#000000', // black theme as requested
        light: '#f8fafc',
        'glass-bg': 'rgba(255, 255, 255, 0.85)',
        'glass-bg-dark': 'rgba(17, 24, 39, 0.75)',
        'glass-border': 'rgba(0, 0, 0, 0.05)',
        'glass-border-dark': 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
