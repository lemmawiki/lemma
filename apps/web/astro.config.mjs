import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://lemma.wiki",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ko"],
    routing: {
      // During migration, keep old non-prefixed routes (`/modules/entropy`)
      // alongside new prefixed routes (`/en/modules/entropy`, `/ko/modules/entropy`).
      // Once every page is migrated, flip prefixDefaultLocale → false and
      // remove the duplicate non-prefixed pages.
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      changefreq: "weekly",
      lastmod: new Date(),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", ko: "ko" },
      },
      // Exclude unprefixed content-mirror stubs. They emit redirect HTML with
      // robots:noindex anyway, but keeping them out of the sitemap saves crawl
      // budget. `/` and `/graph` (entry-point hubs) are unaffected — their
      // pillar segment is empty.
      filter: (page) =>
        !/^https:\/\/lemma\.wiki\/(finance|ml|physics|graphics|modules)\/[^/]+\/$/.test(page),
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
