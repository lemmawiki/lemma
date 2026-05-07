import { AppProvider, useApp, pick } from "./context/AppContext";
import { RouterProvider, useRouter, Link } from "./lib/router";
import { Home } from "./pages/Home";
import { BitcoinPizza } from "./pages/BitcoinPizza";
import { Logarithm } from "./pages/Logarithm";
import "./styles.css";

function Header() {
  const { language, setLanguage, mode, setMode } = useApp();
  const { path } = useRouter();
  const showMode = path !== "/";
  return (
    <header className="header">
      <Link to="/" className="brand">
        <div className="brand-mark">∴</div>
        <div className="brand-text">
          <div className="brand-title">Lemma</div>
          <div className="brand-sub">
            {pick(language, "math, backwards", "수학, 거꾸로")}
          </div>
        </div>
      </Link>
      <div className="toggles">
        <div className="toggle-group" role="tablist" aria-label="Language">
          <button className={`toggle ${language === "en" ? "on" : ""}`} onClick={() => setLanguage("en")}>EN</button>
          <button className={`toggle ${language === "ko" ? "on" : ""}`} onClick={() => setLanguage("ko")}>KO</button>
        </div>
        {showMode && (
          <div className="toggle-group" role="tablist" aria-label="Mode">
            <button className={`toggle ${mode === "general" ? "on" : ""}`} onClick={() => setMode("general")}>
              {pick(language, "general", "일반")}
            </button>
            <button className={`toggle ${mode === "code" ? "on" : ""}`} onClick={() => setMode("code")}>
              {pick(language, "code", "코드")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function NotFound() {
  const { language } = useApp();
  const { path } = useRouter();
  return (
    <section className="notfound">
      <div className="kicker">404</div>
      <h1 className="hook-title">
        {pick(language, "Nothing here.", "없는 페이지입니다.")}
      </h1>
      <p className="hook-q">
        <span className="mono">{path}</span>{" "}
        {pick(language, "is not a Lemma route.", "는 Lemma 의 경로가 아닙니다.")}
      </p>
      <p>
        <Link to="/">{pick(language, "← back to home", "← 홈으로")}</Link>
      </p>
    </section>
  );
}

function Routes() {
  const { path } = useRouter();
  if (path === "/") return <Home />;
  if (path === "/finance/bitcoin-pizza") return <BitcoinPizza />;
  if (path === "/modules/log") return <Logarithm />;
  return <NotFound />;
}

function Page() {
  return (
    <main className="page">
      <Header />
      <Routes />
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider>
        <Page />
      </RouterProvider>
    </AppProvider>
  );
}
