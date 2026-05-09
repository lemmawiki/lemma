import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Each Astro page contains multiple React islands (Header + page content). They
// live in separate React trees and cannot share context directly, so we persist
// language/mode to localStorage and broadcast changes via custom events — every
// AppProvider instance subscribes and stays in sync within the page. Cross-tab
// sync happens via the native `storage` event.
//
// Migration note (URL-based locale):
//   New pages live under src/pages/[lang]/... and the locale is determined by
//   the URL, not localStorage. The Astro layout passes `language` as a prop to
//   each React island it mounts; AppProvider then runs in URL mode and
//   `setLanguage` becomes a navigation rather than a state mutation.
//   Old pages (no `language` prop) continue running in localStorage mode for
//   backwards-compatibility during the migration. Both modes coexist.

export type Language = "en" | "ko";
export type Mode = "general" | "code";

const LANG_KEY = "lemma:lang";
const MODE_KEY = "lemma:mode";
const LANG_EVENT = "lemma:lang-change";
const MODE_EVENT = "lemma:mode-change";

type AppState = {
  language: Language;
  setLanguage: (l: Language) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
};

// Exported so individual components can read it directly with `useContext` and
// fall back to a `language` prop when no provider is in scope. New
// MDX-rendered islands receive locale from the URL via props rather than
// requiring an AppProvider above each one.
export const AppContext = createContext<AppState | null>(null);

function readLang(): Language {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(LANG_KEY) === "ko" ? "ko" : "en";
}
function readMode(): Mode {
  if (typeof window === "undefined") return "general";
  return localStorage.getItem(MODE_KEY) === "code" ? "code" : "general";
}

// Derive the URL of the same page in the counterpart locale. Works for the
// `/[lang]/...` URL scheme; safe no-op for old pages still on `/foo` (returns
// the same URL).
function counterpartHref(currentPath: string, target: Language): string {
  if (typeof window === "undefined") return currentPath;
  // /en/foo → /ko/foo, /ko/foo → /en/foo, others unchanged
  return currentPath.replace(/^\/(en|ko)(?=\/|$)/, `/${target}`);
}

export function AppProvider({
  children,
  language: forcedLang,
}: {
  children: ReactNode;
  // When provided, language is URL-driven (read-only). Switching language
  // navigates to the counterpart URL instead of mutating local state.
  language?: Language;
}) {
  const urlMode = forcedLang !== undefined;
  const [language, setLang] = useState<Language>(urlMode ? forcedLang : readLang);
  const [mode, setModeState] = useState<Mode>(readMode);

  // Keep state in sync with prop when it changes (route nav under SPA mode).
  useEffect(() => {
    if (urlMode && forcedLang !== language) setLang(forcedLang);
  }, [urlMode, forcedLang, language]);

  useEffect(() => {
    const onLang = (e: Event) => {
      if (urlMode) return;
      const detail = (e as CustomEvent<Language>).detail;
      if (detail === "en" || detail === "ko") setLang(detail);
    };
    const onMode = (e: Event) => {
      const detail = (e as CustomEvent<Mode>).detail;
      if (detail === "general" || detail === "code") setModeState(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (!urlMode && e.key === LANG_KEY && (e.newValue === "en" || e.newValue === "ko"))
        setLang(e.newValue);
      if (e.key === MODE_KEY && (e.newValue === "code" || e.newValue === "general"))
        setModeState(e.newValue);
    };
    window.addEventListener(LANG_EVENT, onLang);
    window.addEventListener(MODE_EVENT, onMode);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LANG_EVENT, onLang);
      window.removeEventListener(MODE_EVENT, onMode);
      window.removeEventListener("storage", onStorage);
    };
  }, [urlMode]);

  const setLanguage = useCallback(
    (l: Language) => {
      if (urlMode) {
        // URL mode: navigate to the counterpart URL. The new page mounts a fresh
        // AppProvider with the new `language` prop. Mode persists via localStorage.
        const target = counterpartHref(window.location.pathname, l) + window.location.search;
        window.location.href = target;
        return;
      }
      localStorage.setItem(LANG_KEY, l);
      setLang(l);
      window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: l }));
    },
    [urlMode],
  );
  const setMode = useCallback((m: Mode) => {
    localStorage.setItem(MODE_KEY, m);
    setModeState(m);
    window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: m }));
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, mode, setMode }),
    [language, setLanguage, mode, setMode],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function pick<T>(language: Language, en: T, ko: T): T {
  return language === "en" ? en : ko;
}
