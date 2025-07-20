// Cấu hình ĐẦY ĐỦ, CÓ phần xử lý 'events'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { // <--- KHỐI NÀY ĐÃ ĐƯỢC THÊM TRỞ LẠI
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        {
          name: 'node-globals-polyfill',
          setup(build) {
            build.onResolve({ filter: /events/ }, (args) => {
              return { path: require.resolve('events/') }
            })
          },
        },
      ],
    },
  },
})