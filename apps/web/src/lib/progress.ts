// Reader state — *stateless* readers were the contract for too long.
//
// Every visit to a Lemma page used to be the first visit. The site treated
// you like you'd just arrived. PROGRESS reverses that without asking for a
// login: localStorage holds, per page URL, the latest visit timestamp and
// the deepest scroll the reader reached. That's enough to:
//
//   - show a "3 weeks ago, 71% in — resume →" banner when the reader returns
//   - surface a "recently read" list on the home hub with progress bars
//
// Privacy: lives 100% in localStorage. Never leaves the browser. Cross-tab
// sync via the native `storage` event. Cap of 50 pages with LRU eviction
// to keep storage bounded.

const STORAGE_KEY = "lemma:read";
const STORAGE_VERSION = 1;
const MAX_PAGES = 50;

export interface PageRead {
  /** ms epoch of latest visit. */
  last: number;
  /** Deepest scroll seen, 0..1 (fraction of scrollable height). */
  scrollMax: number;
}

interface ReadStore {
  version: number;
  pages: Record<string, PageRead>;
}

function emptyStore(): ReadStore {
  return { version: STORAGE_VERSION, pages: {} };
}

/** Strip a trailing slash so `/en/foo` and `/en/foo/` collide on one entry. */
function normalize(url: string): string {
  if (url.length > 1 && url.endsWith("/")) return url.slice(0, -1);
  return url;
}

/** Pages this fraction or above are treated as "done" — hidden from recent. */
const FULLY_READ = 0.95;

function load(): ReadStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ReadStore;
    if (parsed?.version !== STORAGE_VERSION || !parsed.pages) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function save(store: ReadStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota or denied — silently drop. Progress is non-essential UX.
  }
}

/** Read the entry for a single URL, or null if never visited. */
export function getPageRead(url: string): PageRead | null {
  const key = normalize(url);
  return load().pages[key] ?? null;
}

/** Update — keeps the deepest scrollMax ever seen, refreshes timestamp. */
export function updatePageRead(url: string, scrollMax: number): void {
  const key = normalize(url);
  const store = load();
  const prev = store.pages[key];
  const next: PageRead = {
    last: Date.now(),
    scrollMax: Math.max(prev?.scrollMax ?? 0, Math.min(1, Math.max(0, scrollMax))),
  };
  store.pages[key] = next;

  // LRU eviction by `last`, oldest first, until size <= MAX_PAGES.
  const entries = Object.entries(store.pages);
  if (entries.length > MAX_PAGES) {
    entries.sort((a, b) => b[1].last - a[1].last);
    store.pages = Object.fromEntries(entries.slice(0, MAX_PAGES));
  }
  save(store);
}

export interface RecentEntry extends PageRead {
  url: string;
}

/** Most-recently-visited pages, freshest first. Pages read to >=95% are
 *  hidden — once you finish a page, it leaves the resume list. */
export function listRecent(limit = 5): RecentEntry[] {
  const store = load();
  return Object.entries(store.pages)
    .filter(([, r]) => r.scrollMax < FULLY_READ)
    .map(([url, read]) => ({ url, ...read }))
    .sort((a, b) => b.last - a.last)
    .slice(0, limit);
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

/** Locale-aware "n ago" — short, no library. */
export function formatRelative(ts: number, lang: "en" | "ko", now = Date.now()): string {
  const delta = Math.max(0, now - ts);
  if (lang === "ko") {
    if (delta < MIN) return "방금";
    if (delta < HOUR) return `${Math.floor(delta / MIN)}분 전`;
    if (delta < DAY) return `${Math.floor(delta / HOUR)}시간 전`;
    if (delta < WEEK) return `${Math.floor(delta / DAY)}일 전`;
    if (delta < MONTH) return `${Math.floor(delta / WEEK)}주 전`;
    return `${Math.floor(delta / MONTH)}개월 전`;
  }
  if (delta < MIN) return "just now";
  if (delta < HOUR) return `${Math.floor(delta / MIN)}m ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)}h ago`;
  if (delta < WEEK) return `${Math.floor(delta / DAY)}d ago`;
  if (delta < MONTH) return `${Math.floor(delta / WEEK)}w ago`;
  return `${Math.floor(delta / MONTH)}mo ago`;
}

/**
 * Scroll the page so the reader resumes near where they left off. Uses the
 * documentElement's scrollable height at call time — content shifts between
 * visits make this approximate; that's acceptable.
 */
export function resumeScroll(scrollMax: number, smooth = true): void {
  if (typeof window === "undefined") return;
  const docEl = document.documentElement;
  const target = Math.max(
    0,
    (docEl.scrollHeight - window.innerHeight) * Math.min(1, Math.max(0, scrollMax)),
  );
  window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
}
