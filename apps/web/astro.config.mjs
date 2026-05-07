import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

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
  },
});
