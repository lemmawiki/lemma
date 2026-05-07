import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Each Astro page contains multiple React islands (Header + page content).
// They live in separate React trees and cannot share context directly, so we
// persist language/mode to localStorage and broadcast changes via custom events
// — every AppProvider instance subscribes and stays in sync within the page.
// Cross-tab sync happens via the native `storage` event.

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

const AppContext = createContext<AppState | null>(null);

function readLang(): Language {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(LANG_KEY) === "ko" ? "ko" : "en";
}
function readMode(): Mode {
  if (typeof window === "undefined") return "general";
  return localStorage.getItem(MODE_KEY) === "code" ? "code" : "general";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(readLang);
  const [mode, setModeState] = useState<Mode>(readMode);

  useEffect(() => {
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent<Language>).detail;
      if (detail === "en" || detail === "ko") setLang(detail);
    };
    const onMode = (e: Event) => {
      const detail = (e as CustomEvent<Mode>).detail;
      if (detail === "general" || detail === "code") setModeState(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && (e.newValue === "en" || e.newValue === "ko")) setLang(e.newValue);
      if (e.key === MODE_KEY && (e.newValue === "general" || e.newValue === "code"))
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
  }, []);

  function setLanguage(l: Language) {
    localStorage.setItem(LANG_KEY, l);
    setLang(l);
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: l }));
  }
  function setMode(m: Mode) {
    localStorage.setItem(MODE_KEY, m);
    setModeState(m);
    window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: m }));
  }

  const value = useMemo(
    () => ({ language, setLanguage, mode, setMode }),
    [language, mode],
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
