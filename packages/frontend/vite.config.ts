import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can choose a port for the frontend
    proxy: {
      // Proxy API requests to your backend
      '/api': {
        target: 'http://localhost:8080', // Your backend server address
        changeOrigin: true,
        // secure: false, // If your backend is not HTTPS
      }
    }
  }
})
