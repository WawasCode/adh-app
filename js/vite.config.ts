import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Added import for path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external connections
    port: 5173,
    strictPort: true, // Fail if port is already in use
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Proxy to the backend API !! Change this to your backend URL !!
        changeOrigin: true, // Change the origin of the host header to the target URL
        secure: false, // Disable SSL verification for development
      },
      "/photon": {
        target: "http://localhost:2322",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/photon/, '/api'),
      },
    },
  },
  resolve: {
    // Added resolve configuration
    alias: {
      "~": path.resolve(__dirname, "."),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
