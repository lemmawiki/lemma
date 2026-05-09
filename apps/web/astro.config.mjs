import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://lemma.wiki",
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      lastmod: new Date(),
    }),
  ],
  vite: {
    assetsInclude: ["**/*.md"],
    plugins: [tailwindcss()],
    // Mafs ships a pre-bundled ESM dist; under pnpm Vite can hand its
    // internals a different React copy than the app uses, which surfaces as
    // "Invalid hook call". Dedupe + pre-bundle to keep them on one React.
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: ["mafs"],
    },
    ssr: {
      noExternal: ["mafs"],
    },
  },
});
