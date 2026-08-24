import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// GitHub Pages hosts this repo at /Valo-bite-2.0/, so the asset base must
// match the subpath. `VITE_BASE` can still override in CI/local for other
// environments, but the fixed default guarantees correct subpath assets.
const base = process.env.VITE_BASE ?? "/Valo-bite-2.0/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
