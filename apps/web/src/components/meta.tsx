import type { ReactNode } from "react";
import { useApp, pick } from "../context/app-context";
import type { Locale } from "../data/glossary";

type Bilingual = Record<Locale, ReactNode>;

// ToolSpec — sits at the top of a module page. A module is a tool, not a
// chapter; this is its type signature. Three rows: what it is, when it
// applies, when it breaks. Read before the prose so the rest of the page
// has a frame.
export function ToolSpec({
  definition,
  appliesWhen,
  breaksWhen,
}: {
  definition: Bilingual;
  appliesWhen: Bilingual;
  breaksWhen: Bilingual;
}) {
  const { language } = useApp();
  return (
    <section className="mt-12 rounded-[10px] border border-rule bg-bg-card px-6 py-5 max-md:-mx-[18px] max-md:rounded-none max-md:border-x-0 max-md:px-3 max-md:py-4">
      <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, "tool spec", "도구 사양")}
      </div>
      <dl className="grid grid-cols-[120px_1fr] gap-x-5 gap-y-3 text-[15px] leading-[1.55] text-ink-soft max-md:grid-cols-[88px_1fr] max-md:gap-x-3 max-md:text-[14.5px] [&_b]:font-semibold [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          {pick(language, "what", "정의")}
        </dt>
        <dd className="m-0">{pick(language, definition.en, definition.ko)}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          {pick(language, "applies when", "적용")}
        </dt>
        <dd className="m-0">{pick(language, appliesWhen.en, appliesWhen.ko)}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-acc-deep">
          {pick(language, "breaks when", "한계")}
        </dt>
        <dd className="m-0">{pick(language, breaksWhen.en, breaksWhen.ko)}</dd>
      </dl>
    </section>
  );
}

// Counterexample — sits at the bottom of an arc. One concrete input where the
// preceding reasoning fails. Not pedagogical seasoning — a discipline. If you
// can't write one, you may not understand the limit yet.
export function Counterexample({ children }: { children: Bilingual }) {
  const { language } = useApp();
  return (
    <div className="mt-4 rounded-r-md border-l-[3px] border-dashed border-acc-deep bg-acc-soft/40 px-4 py-3 text-[14.5px] leading-[1.55] text-ink-soft [&_b]:font-semibold [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-acc-deep">
        {pick(language, "now break it", "이제 깨봐")}
      </div>
      <div>{pick(language, children.en, children.ko)}</div>
    </div>
  );
}

// WhyNotTaught — closing meta paragraph. The manifesto in action, per page.
// Why does the textbook usually start somewhere else? Answering that out loud
// is what separates Lemma from a glossy textbook clone.
export function WhyNotTaught({ children }: { children: Bilingual }) {
  const { language } = useApp();
  return (
    <section className="mt-12 border-t border-rule pt-6">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute">
        {pick(language, "why this isn't taught this way", "왜 교과서는 이렇게 안 가르치나")}
      </div>
      <p className="m-0 max-w-[58ch] font-serif text-[17px] italic leading-[1.6] text-ink-soft [&_b]:not-italic [&_b]:font-semibold [&_b]:text-ink [&_em]:not-italic [&_em]:text-acc-deep">
        {pick(language, children.en, children.ko)}
      </p>
    </section>
  );
}
