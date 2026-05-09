import { useContext, useState, type ReactNode } from "react";
import { AppContext, pick, type Language } from "../context/app-context";

export type ExerciseProps = {
  number: number;
  tag: { en: string; ko: string };
  prompt: { en: ReactNode; ko: ReactNode };
  solution: { en: ReactNode; ko: ReactNode };
  noCalculator?: boolean;
  language?: Language;
};

export function Exercise({
  number,
  tag,
  prompt,
  solution,
  noCalculator,
  language: langProp,
}: ExerciseProps) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
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

// MDX-friendly Exercise. Body and solution come from MDX children, so the
// translator writes prose, not React structures. Use one <ExerciseInline>
// wrapper per exercise; the prose between <ExerciseInline> and <Solution>
// is the prompt; the prose inside <Solution> is the solution.
export function ExerciseInline({
  number,
  tag,
  noCalculator,
  language: langProp,
  children,
}: {
  number: number;
  tag: string;
  noCalculator?: boolean;
  language?: Language;
  children: ReactNode;
}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [shown, setShown] = useState(false);

  // Walk children and split at the <Solution> sentinel. Everything before is
  // prompt; everything inside <Solution> is solution.
  const promptNodes: ReactNode[] = [];
  let solutionNodes: ReactNode = null;
  if (Array.isArray(children)) {
    for (const c of children) {
      if (
        typeof c === "object" &&
        c !== null &&
        "type" in c &&
        (c.type === Solution || c.type?.displayName === "Solution")
      ) {
        solutionNodes = c.props?.children;
      } else {
        promptNodes.push(c);
      }
    }
  } else {
    promptNodes.push(children);
  }

  return (
    <div className="mb-3 rounded-lg border border-rule bg-bg-card px-5 py-[18px]">
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-acc-soft font-serif text-[22px] font-semibold text-acc [font-feature-settings:'lnum']">
          {number}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute">
          {tag}
        </span>
        {noCalculator && (
          <span className="ml-auto rounded-full bg-acc-soft px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.08em] text-acc-deep">
            {pick(language, "no calculator", "계산기 없이")}
          </span>
        )}
      </div>
      <div className="mb-3 text-base leading-[1.6] text-ink [&_b]:text-acc-deep">{promptNodes}</div>
      {solutionNodes !== null && (
        <>
          <button
            className="rounded-md border border-dashed border-rule bg-transparent px-3.5 py-2 font-mono text-xs tracking-[0.04em] text-ink-mute transition-all hover:border-solid hover:border-acc hover:text-acc"
            onClick={() => setShown((s) => !s)}
          >
            {shown
              ? pick(language, "hide solution", "풀이 감추기")
              : pick(language, "try first, then reveal", "먼저 풀어본 뒤 펼치기")}
          </button>
          <div
            className="mt-3 rounded-r-md border-l-[3px] border-green bg-rule-soft px-4 py-3.5 text-[15px] leading-[1.6] text-ink-soft [&_b]:text-green [&_em]:italic [&_em]:text-acc"
            hidden={!shown}
          >
            {solutionNodes}
          </div>
        </>
      )}
    </div>
  );
}

// Sentinel for MDX. Inside <ExerciseInline>, <Solution>...</Solution> wraps
// the solution prose. Rendered nothing if used outside (safe).
export function Solution({ children: _children }: { children?: ReactNode }) {
  return null;
}
Solution.displayName = "Solution";
