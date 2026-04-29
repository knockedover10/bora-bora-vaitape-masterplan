import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// GitHub Pages serves at https://<user>.github.io/<repo>/, so we need the
// base path to match the repo name in production. Local dev stays at "/".
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/bora-bora-vaitape-masterplan/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
}));
