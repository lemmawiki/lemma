import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Page content lives at src/content/pages/<kind>/<slug>/<locale>.mdx
//
// kind     = modules | applications | hubs   (also: index for the home page)
// slug     = entropy | bitcoin-pizza | ...   (matches the URL path segment)
// locale   = en | ko  (the language file)
//
// The dynamic route `src/pages/[lang]/[...slug].astro` queries this collection
// by id (e.g. "modules/entropy/en") and renders.
//
// Glossary stays as a separate filesystem-driven module (src/data/glossary).
// Hub pages (home, graph) live here too as `hubs/<slug>/<locale>.mdx`.

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    kicker: z.string().optional(),
    breadcrumb: z
      .object({
        parent: z.string().optional(),
        parent_path: z.string().optional(),
        current: z.string(),
      })
      .optional(),
    // For listings (e.g., the home page). Filled at build time from
    // applications.ts / modules.ts when needed.
    layout: z.enum(["page", "home", "graph"]).default("page"),
  }),
});

export const collections = { pages };
