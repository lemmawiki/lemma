import { AppProvider, useApp, pick } from "../context/app-context";

function HeaderInner({ pathname }: { pathname: string }) {
  const { language, setLanguage, mode, setMode } = useApp();
  const showMode = pathname !== "/";
  return (
    <header className="flex items-center justify-between border-b border-rule pb-[18px] max-md:flex-col max-md:items-start max-md:gap-[14px]">
      <a href="/" className="group/brand flex items-center gap-[14px] text-inherit no-underline">
        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-ink group-hover/brand:text-acc-deep [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
          aria-hidden
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="38" r="26" />
            <line x1="10" y1="64" x2="90" y2="64" />
          </svg>
        </span>
        <div>
          <div className="font-serif text-lg font-semibold tracking-[-0.01em] text-ink group-hover/brand:text-acc">
            Lemma
          </div>
          <div className="font-mono text-[11px] tracking-[0.04em] text-ink-mute">
            {pick(language, "math, backwards", "수학, 거꾸로")}
          </div>
        </div>
      </a>
      <div className="flex gap-3 max-md:flex-wrap">
        <div
          className="inline-flex overflow-hidden rounded-full border border-rule bg-bg-card"
          role="tablist"
          aria-label="Language"
        >
          <button className={toggleClass(language === "en")} onClick={() => setLanguage("en")}>
            EN
          </button>
          <button className={toggleClass(language === "ko")} onClick={() => setLanguage("ko")}>
            KO
          </button>
        </div>
        {showMode && (
          <div
            className="inline-flex overflow-hidden rounded-full border border-rule bg-bg-card"
            role="tablist"
            aria-label="Mode"
          >
            <button className={toggleClass(mode === "general")} onClick={() => setMode("general")}>
              {pick(language, "general", "일반")}
            </button>
            <button className={toggleClass(mode === "code")} onClick={() => setMode("code")}>
              {pick(language, "code", "코드")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function toggleClass(on: boolean): string {
  const base = "border-0 px-3 py-1.5 font-mono text-xs tracking-[0.04em] transition-colors";
  return on ? `${base} bg-ink text-bg` : `${base} bg-transparent text-ink-mute hover:text-ink`;
}

export default function Header({ pathname }: { pathname: string }) {
  return (
    <AppProvider>
      <HeaderInner pathname={pathname} />
    </AppProvider>
  );
}
