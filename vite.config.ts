import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Enable gzip compression for production builds
    compression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files larger than 10KB
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Enable brotli compression for better compression ratio
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "brotli",
      ext: ".br",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ["react", "react-dom", "react-router-dom"],
          // UI library chunks
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-popover"],
          // Utility chunks
          utils: ["zod", "date-fns", "clsx"],
        },
      },
    },
    // Optimize CSS code splitting
    cssCodeSplit: true,
    // Minify CSS and JS
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Source maps for production debugging
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Report compressed size
    reportCompressedSize: true,
  },
  // Optimize CSS handling
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
    },
  },
});
