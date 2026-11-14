import { defineConfig } from "astro/config";
export default defineConfig({
  site: (process.env.SITE_URL || "https://argilearena.fr"),
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  compressHTML: true,
  vite: { build: { chunkSizeWarningLimit: 1500 } }
});
