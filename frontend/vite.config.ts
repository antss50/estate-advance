import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Sửa lỗi "global is not defined" của sockjs-client
    global: 'globalThis',
  },
})
