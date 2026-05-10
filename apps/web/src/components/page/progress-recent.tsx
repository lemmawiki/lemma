import { useEffect, useState } from "react";
import { applicationByHref } from "../../data/applications";
import { moduleByHref } from "../../data/modules";
import { useApp, pick } from "../../context/app-context";
import { Link } from "../../lib/router";
import { formatRelative, listRecent, type RecentEntry } from "../../lib/progress";

// "Recently read" panel for the home hub.
//
// Looks up each saved URL against modules/applications registries to recover
// the bilingual title; URLs that don't resolve (journeys, glossary indexes,
// unknown) get the slug as fallback.
//
// Renders nothing on first visit (empty list) — silence is correct UX.

interface ResolvedEntry extends RecentEntry {
  title: string;
  kindLabel: string;
}

function resolveTitle(
  entry: RecentEntry,
  lang: "en" | "ko",
): { title: string; kindLabel: string } | null {
  // Strip /<lang> prefix to match registry hrefs (which start with /<pillar>/...).
  const path = entry.url.replace(/^\/(en|ko)(?=\/)/, "");

  const app = applicationByHref[path];
  if (app) {
    return {
      title: app.title[lang] ?? app.title.en,
      kindLabel: lang === "ko" ? "응용" : "application",
    };
  }

  const mod = moduleByHref[path];
  if (mod) {
    return {
      title: mod.title[lang] ?? mod.title.en,
      kindLabel: lang === "ko" ? "모듈" : "module",
    };
  }

  // Fallback: derive a readable label from the slug.
  const slug = path.split("/").filter(Boolean).pop();
  if (!slug) return null;
  return {
    title: slug.replace(/-/g, " "),
    kindLabel: lang === "ko" ? "페이지" : "page",
  };
}

const KICKER =
  "mb-4 inline-block border-b border-rule pb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute";

export function ProgressRecent() {
  const { language } = useApp();
  const [items, setItems] = useState<ResolvedEntry[] | null>(null);

  useEffect(() => {
    const recent = listRecent(5);
    const resolved = recent
      .map((r): ResolvedEntry | null => {
        const meta = resolveTitle(r, language);
        if (!meta) return null;
        return { ...r, title: meta.title, kindLabel: meta.kindLabel };
      })
      .filter((r): r is ResolvedEntry => r !== null);
    setItems(resolved);
  }, [language]);

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-14" data-no-print="true">
      <div className={KICKER}>
        {pick(language, `recently read · ${items.length}`, `최근 읽은 곳 · ${items.length}`)}
      </div>
      <ul className="m-0 grid list-none gap-2 p-0">
        {items.map((item) => {
          const pct = Math.round(item.scrollMax * 100);
          const ago = formatRelative(item.last, language);
          return (
            <li key={item.url}>
              <Link
                to={`${item.url}?resume=1`}
                className="group block rounded-md border border-rule bg-rule-soft px-3 py-2 no-underline hover:border-acc"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-[15px] text-ink group-hover:text-acc">
                    {item.title}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute">
                    {item.kindLabel} · {ago} · {pct}%
                  </span>
                </div>
                <div
                  className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-rule"
                  aria-hidden="true"
                >
                  <div
                    className="h-full bg-acc transition-[width] duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
