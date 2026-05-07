import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Per-page registry of which glossary term ids actually appeared on the page.
// <Term> auto-registers itself on mount; the page's Glossary section reads the
// set and filters down to "what was used here." Pages without a TermsProvider
// fall back to "show everything," so Term still works in isolation.

type TermsContextValue = {
  used: Set<string>;
  register: (id: string) => void;
};

const TermsContext = createContext<TermsContextValue | null>(null);

export function TermsProvider({ children }: { children: ReactNode }) {
  const [used, setUsed] = useState<Set<string>>(() => new Set());
  const register = useCallback((id: string) => {
    setUsed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);
  return (
    <TermsContext.Provider value={{ used, register }}>
      {children}
    </TermsContext.Provider>
  );
}

export function useTermsRegistry() {
  return useContext(TermsContext);
}
