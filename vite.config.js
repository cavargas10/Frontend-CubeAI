import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip', 
      threshold: 10240, 
      deleteOriginFile: false, 
    }),
  ],
  assetsInclude: ['**/*.hdr'],
  resolve: {
    alias: {
      'three': 'three',
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
});