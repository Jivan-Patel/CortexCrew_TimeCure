import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Auth Server (backend/server.js) - port 3000
      '/api/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Appointment booking via auth backend - port 3000
      '/api/book': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Smart Queue Server (TimeCure-backend/server.js) - port 4000
      '/api/queue': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/queue/, ''),
        secure: false,
      },
      // ML Server (ml/app.py) - port 5000
      '/api/ml': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ml/, ''),
        secure: false,
      },
    },
  },
});
