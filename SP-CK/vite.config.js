import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss()
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
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