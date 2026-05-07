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
    <div className="mb-3 rounded-lg border border-rule bg-bg-card px-5 py-[18px]">
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-acc-soft font-serif text-[22px] font-semibold text-acc [font-feature-settings:'lnum']">
          {number}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">
          {pick(language, tag.en, tag.ko)}
        </span>
        {noCalculator && (
          <span className="ml-auto rounded-full bg-acc-soft px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-acc-deep">
            {pick(language, "no calculator", "계산기 없이")}
          </span>
        )}
      </div>
      <div className="mb-3 text-base leading-[1.6] text-ink [&_b]:text-acc-deep">
        {pick(language, prompt.en, prompt.ko)}
      </div>
      <button
        className="rounded-md border border-dashed border-rule bg-transparent px-3.5 py-2 font-mono text-xs tracking-[0.04em] text-ink-mute transition-all hover:border-solid hover:border-acc hover:text-acc"
        onClick={() => setShown((s) => !s)}
      >
        {shown
          ? pick(language, "hide solution", "풀이 감추기")
          : pick(language, "try first, then reveal", "먼저 풀어본 뒤 펼치기")}
      </button>
      {/* Always render the solution (Terms inside need to register) — visually
          hidden until revealed. */}
      <div
        className="mt-3 rounded-r-md border-l-[3px] border-green bg-rule-soft px-4 py-3.5 text-[15px] leading-[1.6] text-ink-soft [&_b]:text-green [&_em]:italic [&_em]:text-acc"
        hidden={!shown}
      >
        {pick(language, solution.en, solution.ko)}
      </div>
    </div>
  );
}
