import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Added import for path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Added resolve configuration
    alias: {
      "~": path.resolve(__dirname, "."),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
