import { AppProvider, useApp, pick } from "../context/AppContext";

function HeaderInner({ pathname }: { pathname: string }) {
  const { language, setLanguage, mode, setMode } = useApp();
  const showMode = pathname !== "/";
  return (
    <header className="header">
      <a href="/" className="brand">
        <div className="brand-mark">∴</div>
        <div className="brand-text">
          <div className="brand-title">Lemma</div>
          <div className="brand-sub">{pick(language, "math, backwards", "수학, 거꾸로")}</div>
        </div>
      </a>
      <div className="toggles">
        <div className="toggle-group" role="tablist" aria-label="Language">
          <button
            className={`toggle ${language === "en" ? "on" : ""}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <button
            className={`toggle ${language === "ko" ? "on" : ""}`}
            onClick={() => setLanguage("ko")}
          >
            KO
          </button>
        </div>
        {showMode && (
          <div className="toggle-group" role="tablist" aria-label="Mode">
            <button
              className={`toggle ${mode === "general" ? "on" : ""}`}
              onClick={() => setMode("general")}
            >
              {pick(language, "general", "일반")}
            </button>
            <button
              className={`toggle ${mode === "code" ? "on" : ""}`}
              onClick={() => setMode("code")}
            >
              {pick(language, "code", "코드")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default function Header({ pathname }: { pathname: string }) {
  return (
    <AppProvider>
      <HeaderInner pathname={pathname} />
    </AppProvider>
  );
}
