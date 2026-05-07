import { useState } from "react";
import {
  futureValue,
  yearsToTarget,
  impliedRate,
  formatCurrency,
  formatYears,
  formatPercent,
} from "../../lib/finance";
import { useApp, pick } from "../../context/AppContext";

type Door = "F" | "t" | "r";

// Widget B — Three Doors. One equation. Three unknowns. Three operations.
export function ThreeDoors() {
  const { language } = useApp();
  const [door, setDoor] = useState<Door>("F");

  const [P, setP] = useState(41);
  const [r, setR] = useState(1.89);
  const [t, setT] = useState(16);
  const [F, setF] = useState(1_000_000_000);

  let answer: number;
  let formula: React.ReactNode;
  let formulaKo: React.ReactNode;
  let opLabel: { en: string; ko: string };

  if (door === "F") {
    answer = futureValue(P, r, t);
    formula = (
      <>
        F = P · (1 + r)<sup>t</sup>
      </>
    );
    formulaKo = (
      <>
        F = P · (1 + r)<sup>t</sup>
      </>
    );
    opLabel = { en: "operation: exponent", ko: "연산: 지수" };
  } else if (door === "t") {
    answer = yearsToTarget(P, F, r);
    formula = <>t = log(F / P) ÷ log(1 + r)</>;
    formulaKo = <>t = log(F / P) ÷ log(1 + r)</>;
    opLabel = { en: "operation: logarithm", ko: "연산: 로그" };
  } else {
    answer = impliedRate(P, F, t);
    formula = (
      <>
        r = (F / P)<sup>1/t</sup> − 1
      </>
    );
    formulaKo = (
      <>
        r = (F / P)<sup>1/t</sup> − 1
      </>
    );
    opLabel = { en: "operation: n-th root", ko: "연산: 거듭제곱근" };
  }

  return (
    <div className="widget">
      <div className="widget-title">
        {pick(language, "Widget B — Three Doors", "위젯 B — 세 개의 문")}
      </div>

      <div className="three-doors">
        <button className={`door ${door === "F" ? "active" : ""}`} onClick={() => setDoor("F")}>
          <div className="door-q">{pick(language, "How much?", "얼마?")}</div>
          <div className="door-unknown">F = ?</div>
          <div className="door-op">exp</div>
        </button>
        <button className={`door ${door === "t" ? "active" : ""}`} onClick={() => setDoor("t")}>
          <div className="door-q">{pick(language, "How long?", "언제까지?")}</div>
          <div className="door-unknown">t = ?</div>
          <div className="door-op">log</div>
        </button>
        <button className={`door ${door === "r" ? "active" : ""}`} onClick={() => setDoor("r")}>
          <div className="door-q">{pick(language, "What rate?", "이율은 얼마?")}</div>
          <div className="door-unknown">r = ?</div>
          <div className="door-op">root</div>
        </button>
      </div>

      <div className="formula">{pick(language, formula, formulaKo)}</div>
      <div className="op-label">{pick(language, opLabel.en, opLabel.ko)}</div>

      <div className="widget-controls">
        <label className="ctrl">
          <span>P</span>
          <input
            type="range"
            min={1}
            max={1000}
            step={1}
            value={P}
            onChange={(e) => setP(+e.target.value)}
          />
          <span className="ctrl-val">{formatCurrency(P)}</span>
        </label>

        {door !== "r" && (
          <label className="ctrl">
            <span>r</span>
            <input
              type="range"
              min={0.001}
              max={2.5}
              step={0.01}
              value={r}
              onChange={(e) => setR(+e.target.value)}
            />
            <span className="ctrl-val">{(r * 100).toFixed(1)}%</span>
          </label>
        )}

        {door !== "t" && (
          <label className="ctrl">
            <span>t</span>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={t}
              onChange={(e) => setT(+e.target.value)}
            />
            <span className="ctrl-val">{t.toFixed(0)} yr</span>
          </label>
        )}

        {door !== "F" && (
          <label className="ctrl">
            <span>F</span>
            <input
              type="range"
              min={Math.log10(P + 1)}
              max={14}
              step={0.01}
              value={Math.log10(Math.max(F, 1))}
              onChange={(e) => setF(Math.pow(10, +e.target.value))}
            />
            <span className="ctrl-val">{formatCurrency(F)}</span>
          </label>
        )}
      </div>

      <div className="answer-card">
        <div className="answer-label">
          {door === "F" && pick(language, "F (future value)", "F (미래 가치)")}
          {door === "t" && pick(language, "t (years to F)", "t (F까지 햇수)")}
          {door === "r" && pick(language, "r (implied rate)", "r (함의 이율)")}
        </div>
        <div className="answer-value">
          {door === "F" && formatCurrency(answer)}
          {door === "t" && formatYears(answer)}
          {door === "r" && formatPercent(answer)}
        </div>
      </div>

      <div className="widget-caption">
        {pick(
          language,
          <>
            One equation. Three unknowns. <b>exp</b> isolates F. <b>log</b> isolates t. <b>root</b>{" "}
            isolates r. Same machine, three doors.
          </>,
          <>
            한 식. 세 미지수. <b>지수</b>는 F를, <b>로그</b>는 t를, <b>거듭제곱근</b>은 r을
            분리한다. 같은 기계, 세 문.
          </>,
        )}
      </div>
    </div>
  );
}
