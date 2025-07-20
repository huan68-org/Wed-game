import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Dòng này sẽ bảo Vite rằng: "Khi nào thấy code import 'events', 
      // hãy lấy file từ package 'events' đã được cài đặt trong node_modules"
      events: 'events',
    },
  },
})