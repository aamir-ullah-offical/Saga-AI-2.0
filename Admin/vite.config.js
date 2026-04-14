// admin/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => ({
  // • "/" in dev  →  no Vite warning
  // • "/admin/" in production build
  base: mode === "production" ? "/admin/" : "/",

  plugins: [react()],

  cacheDir: "./node_modules/.vite_cache",

  server: {
    port: 3001,
    open: false,       // no automatic browser open
    hmr: { overlay: true },
  },
}));
