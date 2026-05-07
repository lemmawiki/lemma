import { useEffect } from "react";
import { useApp, pick } from "../context/AppContext";
import { Link } from "../lib/router";
import { applications, PILLAR_LABEL } from "../data/applications";
import { modules } from "../data/modules";
import { glossary } from "../data/glossary";

function Hero() {
  const { language } = useApp();
  return (
    <section className="home-hero">
      <h1 className="home-title">
        {pick(language, "An interactive math textbook built backwards.", "거꾸로 만든 인터랙티브 수학 교과서.")}
      </h1>
      <p className="home-lede">
        {pick(
          language,
          <>We start with the question. The math comes after.</>,
          <>질문에서 시작합니다. 수학은 그 다음입니다.</>
        )}
      </p>
    </section>
  );
}

function ApplicationsList() {
  const { language } = useApp();
  const live = applications.filter((a) => a.status === "available");
  return (
    <section className="home-section">
      <div className="kicker">
        {pick(language, `applications · available · ${live.length}`, `응용 · 공개됨 · ${live.length}`)}
      </div>
      <ul className="app-list">
        {live.map((app) => (
          <li key={app.id} className="app-card">
            <Link to={app.href} className="app-card-link">
              <div className="app-card-meta">
                <span className="app-card-pillar">{PILLAR_LABEL[app.pillar][language]}</span>
                <span className="app-card-sep">·</span>
                <span className="app-card-modules">{app.modules.join(" · ")}</span>
              </div>
              <h2 className="app-card-title">{app.title[language]}</h2>
              <p className="app-card-hook">{app.hook[language]}</p>
              <span className="app-card-cta">
                {pick(language, "open →", "열기 →")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ModulesList() {
  const { language } = useApp();
  const live = modules.filter((m) => m.status === "available");
  return (
    <section className="home-section">
      <div className="kicker">
        {pick(language, `modules · available · ${live.length}`, `모듈 · 공개됨 · ${live.length}`)}
      </div>
      <ul className="app-list">
        {live.map((m) => (
          <li key={m.id} className="app-card">
            <Link to={m.href} className="app-card-link">
              <div className="app-card-meta">
                <span className="app-card-pillar">{pick(language, "module", "모듈")}</span>
              </div>
              <h2 className="app-card-title">{m.title[language]}</h2>
              <p className="app-card-hook">{m.hook[language]}</p>
              <span className="app-card-cta">
                {pick(language, "open →", "열기 →")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Status() {
  const { language } = useApp();
  return (
    <section className="home-section">
      <div className="kicker">{pick(language, "status", "현재 상태")}</div>
      <p className="home-status">
        {pick(
          language,
          <>Early. One application live, more in progress. The bar is one question: <em>does this make a curious learner understand something they could not understand before?</em> Yes — it ships. No — it doesn't, however polished.</>,
          <>초기. 응용 하나 공개, 더 작업 중. 기준은 단 하나: <em>호기심 있는 학습자가 이전엔 이해하지 못한 것을 이해하게 만드는가?</em> 예 — 들어옵니다. 아니오 — 아무리 다듬어졌어도 들어오지 않습니다.</>
        )}
      </p>
    </section>
  );
}

function Counters() {
  const { language } = useApp();
  return (
    <section className="home-counters">
      <div className="counter">
        <div className="counter-num">{applications.filter((a) => a.status === "available").length}</div>
        <div className="counter-label">{pick(language, "applications", "응용")}</div>
      </div>
      <div className="counter">
        <div className="counter-num">{modules.length}</div>
        <div className="counter-label">{pick(language, "modules", "모듈")}</div>
      </div>
      <div className="counter">
        <div className="counter-num">{glossary.length}</div>
        <div className="counter-label">{pick(language, "glossary terms", "용어")}</div>
      </div>
      <div className="counter">
        <div className="counter-num">2</div>
        <div className="counter-label">{pick(language, "languages", "언어")}</div>
      </div>
    </section>
  );
}

function HomeFooter() {
  const { language } = useApp();
  return (
    <footer className="footer">
      <div>
        {pick(
          language,
          <>Lemma is bilingual at the term level. Hover any underlined word to see its counterpart.</>,
          <>Lemma는 용어 단위로 이중언어입니다. 밑줄 그어진 단어 위에 마우스를 올리면 반대 언어가 보입니다.</>
        )}
      </div>
      <div className="footer-license">CC BY 4.0 (content) · MIT (code)</div>
    </footer>
  );
}

export function Home() {
  useEffect(() => {
    document.title = "Lemma";
  }, []);
  return (
    <>
      <Hero />
      <Counters />
      <ApplicationsList />
      <ModulesList />
      <Status />
      <HomeFooter />
    </>
  );
}
