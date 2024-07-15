import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.hdr'],
  resolve: {
    alias: {
      'three': 'three',
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
})