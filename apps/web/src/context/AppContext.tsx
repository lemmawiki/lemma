import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "ko";
export type Mode = "general" | "code";

type AppState = {
  language: Language;
  setLanguage: (l: Language) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mode, setMode] = useState<Mode>("general");
  return (
    <AppContext.Provider value={{ language, setLanguage, mode, setMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function pick<T>(language: Language, en: T, ko: T): T {
  return language === "en" ? en : ko;
}
