import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // ECommerce API'ye proxy: /api -> http://localhost:5185 (CORS gerektirmez)
    proxy: {
      '/api': {
        target: 'http://localhost:5185',
        changeOrigin: true,
      },
    },
  },
})
