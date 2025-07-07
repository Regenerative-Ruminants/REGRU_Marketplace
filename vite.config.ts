import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    // Phase 3: Proxy API requests to the Rust backend server
    proxy: {
      '/api': {
        // This should point to your Rust backend server
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
      },
    },
    watch: {
      // Explicitly watch the frontend source and public directories for changes
      paths: ['src/**', 'public/**', 'index.html'],
    },
  },
  // Configuration for the production web build
  build: {
    outDir: 'dist', // The output directory for build files
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
}); 