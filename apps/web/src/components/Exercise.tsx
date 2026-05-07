import { useState, type ReactNode } from "react";
import { useApp, pick } from "../context/AppContext";

export type ExerciseProps = {
  number: number;
  tag: { en: string; ko: string };
  prompt: { en: ReactNode; ko: ReactNode };
  solution: { en: ReactNode; ko: ReactNode };
  noCalculator?: boolean;
};

export function Exercise({ number, tag, prompt, solution, noCalculator }: ExerciseProps) {
  const { language } = useApp();
  const [shown, setShown] = useState(false);

  return (
    <div className="exercise">
      <div className="exercise-head">
        <span className="exercise-num">{number}</span>
        <span className="exercise-tag">{pick(language, tag.en, tag.ko)}</span>
        {noCalculator && (
          <span className="exercise-nocalc">{pick(language, "no calculator", "계산기 없이")}</span>
        )}
      </div>
      <div className="exercise-prompt">{pick(language, prompt.en, prompt.ko)}</div>
      <button className="reveal-btn" onClick={() => setShown((s) => !s)}>
        {shown
          ? pick(language, "hide solution", "풀이 감추기")
          : pick(language, "try first, then reveal", "먼저 풀어본 뒤 펼치기")}
      </button>
      {/* Always render the solution (Terms inside need to register) — visually
          hidden until revealed. */}
      <div className="exercise-solution" hidden={!shown}>
        {pick(language, solution.en, solution.ko)}
      </div>
    </div>
  );
}
