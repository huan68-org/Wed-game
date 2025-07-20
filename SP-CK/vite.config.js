import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
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