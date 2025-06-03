import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // → wichtig für STATICFILES_DIRS in Django
    manifest: true, // → wichtig für django-vite
    emptyOutDir: true, // → löscht alten Build vor Neuem
  },
});
