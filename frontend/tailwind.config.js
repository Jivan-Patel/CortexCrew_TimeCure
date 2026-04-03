/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary':   '#0f766e',   // Professional Teal
        'secondary': '#1e3a8a',   // Deep Navy
        'light-bg':  '#f1f5f9',   // Cool slate base
        'subtle':    '#f8fafc',   // Near-white panel
        'border':    '#e2e8f0',   // Slate-200
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
