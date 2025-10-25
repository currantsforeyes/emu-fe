import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: true, // Fail if port is already in use
  },

  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Generate sourcemaps for debugging
    sourcemap: true,
  },

  // Important for Electron: use relative paths
  base: './',

  // Resolve aliases (optional - for cleaner imports)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'three'],
  },
});
