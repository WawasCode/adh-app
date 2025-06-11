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
  },
  resolve: {
    // Added resolve configuration
    alias: {
      "~": path.resolve(__dirname, "."),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
