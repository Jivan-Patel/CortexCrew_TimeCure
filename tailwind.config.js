/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hospital-green': '#10b981',
        primary: '#10b981',
        secondary: '#0f766e',
        dark: '#0f172a',
        darker: '#020617',
        'glass-bg': 'rgba(15, 23, 42, 0.65)',
        'glass-bg-hover': 'rgba(15, 23, 42, 0.85)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'neon-blue': '#3b82f6',
        'neon-red': '#ef4444',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' },
          '50%': { opacity: '.7', boxShadow: '0 0 25px rgba(16, 185, 129, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
