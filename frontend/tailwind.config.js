/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0f766e',     // Professional Teal (Trust, Medical)
        'secondary': '#1e3a8a',   // Deep Corporate Navy (Expertise)
        'light-bg': '#f3f4f6',    // Clean gray/white base
        'border': '#e5e7eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
