import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
// Live deployment URLs:
//   backend (auth)    → https://cortexcrew-timecure-2.onrender.com
//   TimeCure-backend  → https://cortexcrew-timecure-1.onrender.com
//   ml                → https://cortexcrew-timecure.onrender.com
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'https://cortexcrew-timecure-2.onrender.com',
        changeOrigin: true,
      },
      '/api/queue': {
        target: 'https://cortexcrew-timecure-1.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/queue/, '')
      }
    }
  }
})
