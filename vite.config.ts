import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    // Phase 3: Proxy API requests to the Rust backend server
    proxy: {
      '/api': {
        // This should point to your Rust backend server in production
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        // The rewrite is important if your backend doesn't expect the /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
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
})); 