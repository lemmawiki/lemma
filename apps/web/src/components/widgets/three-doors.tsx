import { useState } from "react";
import {
  futureValue,
  yearsToTarget,
  impliedRate,
  formatCurrency,
  formatYears,
  formatPercent,
} from "../../lib/finance";
import { useApp, pick } from "../../context/app-context";

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
    <div className="mt-9 rounded-[10px] border border-rule bg-bg-card px-6 py-[22px]">
      <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, "Widget B — Three Doors", "위젯 B — 세 개의 문")}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 max-md:grid-cols-1">
        <DoorButton
          active={door === "F"}
          q={pick(language, "How much?", "얼마?")}
          unknown="F = ?"
          op="exp"
          onClick={() => setDoor("F")}
        />
        <DoorButton
          active={door === "t"}
          q={pick(language, "How long?", "언제까지?")}
          unknown="t = ?"
          op="log"
          onClick={() => setDoor("t")}
        />
        <DoorButton
          active={door === "r"}
          q={pick(language, "What rate?", "이율은 얼마?")}
          unknown="r = ?"
          op="root"
          onClick={() => setDoor("r")}
        />
      </div>

      <div className="mb-1.5 rounded-md bg-rule-soft p-3.5 text-center font-mono text-lg text-ink">
        {pick(language, formula, formulaKo)}
      </div>
      <div className="mb-3.5 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, opLabel.en, opLabel.ko)}
      </div>

      <div className="mt-2 grid gap-2.5">
        <Ctrl label="P" value={formatCurrency(P)}>
          <input
            type="range"
            className="w-full accent-acc"
            min={1}
            max={1000}
            step={1}
            value={P}
            onChange={(e) => setP(+e.target.value)}
          />
        </Ctrl>

        {door !== "r" && (
          <Ctrl label="r" value={`${(r * 100).toFixed(1)}%`}>
            <input
              type="range"
              className="w-full accent-acc"
              min={0.001}
              max={2.5}
              step={0.01}
              value={r}
              onChange={(e) => setR(+e.target.value)}
            />
          </Ctrl>
        )}

        {door !== "t" && (
          <Ctrl label="t" value={`${t.toFixed(0)} yr`}>
            <input
              type="range"
              className="w-full accent-acc"
              min={1}
              max={40}
              step={1}
              value={t}
              onChange={(e) => setT(+e.target.value)}
            />
          </Ctrl>
        )}

        {door !== "F" && (
          <Ctrl label="F" value={formatCurrency(F)}>
            <input
              type="range"
              className="w-full accent-acc"
              min={Math.log10(P + 1)}
              max={14}
              step={0.01}
              value={Math.log10(Math.max(F, 1))}
              onChange={(e) => setF(Math.pow(10, +e.target.value))}
            />
          </Ctrl>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between rounded-md bg-ink px-4 py-3.5 text-[#f5e9d4]">
        <div className="font-mono text-xs tracking-[0.06em] opacity-70">
          {door === "F" && pick(language, "F (future value)", "F (미래 가치)")}
          {door === "t" && pick(language, "t (years to F)", "t (F까지 햇수)")}
          {door === "r" && pick(language, "r (implied rate)", "r (함의 이율)")}
        </div>
        <div className="font-mono text-[22px] font-semibold text-[#f5b27e]">
          {door === "F" && formatCurrency(answer)}
          {door === "t" && formatYears(answer)}
          {door === "r" && formatPercent(answer)}
        </div>
      </div>

      <div className="mt-3.5 border-t border-rule pt-3 text-[14.5px] text-ink-soft [&_b]:text-ink">
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

function DoorButton({
  active,
  q,
  unknown,
  op,
  onClick,
}: {
  active: boolean;
  q: string;
  unknown: string;
  op: string;
  onClick: () => void;
}) {
  const base = "rounded-lg border px-3 py-3.5 text-center transition-colors";
  const state = active ? "border-acc bg-acc-soft" : "border-rule bg-bg hover:border-acc";
  return (
    <button className={`${base} ${state}`} onClick={onClick}>
      <div className="mb-1 font-serif text-base font-semibold text-ink">{q}</div>
      <div className="mb-1.5 font-mono text-sm text-acc">{unknown}</div>
      <div
        className={`font-mono text-[11px] uppercase tracking-[0.08em] ${active ? "font-semibold text-acc-deep" : "text-ink-mute"}`}
      >
        {op}
      </div>
    </button>
  );
}

function Ctrl({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid grid-cols-[220px_1fr_90px] items-center gap-3 text-[13.5px] max-md:grid-cols-[100px_1fr_70px]">
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-mute">
        {label}
      </span>
      {children}
      <span className="text-right font-mono text-[12.5px] text-ink">{value}</span>
    </label>
  );
}
