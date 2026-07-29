import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://shopnest-e-commerce-website-av3w.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
