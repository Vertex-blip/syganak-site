import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@firebase/firestore') || id.includes('firebase/firestore')) return 'firebase-firestore';
          if (id.includes('@firebase/auth') || id.includes('firebase/auth')) return 'firebase-auth';
          if (id.includes('@firebase/storage') || id.includes('firebase/storage')) return 'firebase-storage';
          if (id.includes('@firebase/analytics') || id.includes('firebase/analytics')) return 'firebase-analytics';
          if (id.includes('firebase')) return 'firebase-core';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('lucide-react')) return 'icons';
          if (
            id.includes('react') ||
            id.includes('scheduler') ||
            id.includes('use-sync-external-store') ||
            id.includes('@remix-run/router')
          ) {
            return 'react-vendor';
          }
          return 'vendor';
        },
      },
    },
  },
})
