import { useMemo, useState } from "react";
import { useApp, pick } from "../../context/app-context";
import { WidgetShell } from "./widget-shell";

// Four toy docs. Kept English so the example reads the same in both locales —
// Korean tech readers search English corpora; faking 은/는 stopwords would be
// theatre.
const DOCS = [
  "the cat sat on the mat",
  "the dog ran fast",
  "cat and dog are friends",
  "the quick brown fox",
] as const;

const PRESETS = ["cat", "the", "cat dog", "fox"] as const;

type Method = "count" | "tfidf";

const TOKENS = DOCS.map((d) => d.toLowerCase().split(/\s+/).filter(Boolean));
const N = DOCS.length;

function tokenize(q: string): string[] {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

function rawCount(term: string, doc: string[]): number {
  let c = 0;
  for (const w of doc) if (w === term) c++;
  return c;
}

function tf(term: string, doc: string[]): number {
  return rawCount(term, doc) / doc.length;
}

function df(term: string): number {
  let d = 0;
  for (const doc of TOKENS) if (doc.includes(term)) d++;
  return d;
}

function idf(term: string): number {
  const d = df(term);
  return d === 0 ? 0 : Math.log2(N / d);
}

function fmt(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return "—";
  const s = n.toFixed(digits);
  return s;
}

export function TfIdfCooker() {
  const { language } = useApp();
  const [query, setQuery] = useState<string>("cat");
  const [method, setMethod] = useState<Method>("tfidf");

  const queryTerms = useMemo(() => tokenize(query), [query]);

  // For every term in the query, the (df, idf) pair across the corpus.
  const idfTable = useMemo(
    () => queryTerms.map((t) => ({ term: t, dfVal: df(t), idfVal: idf(t) })),
    [queryTerms],
  );

  // Per-doc ranking: score, plus per-term breakdown for the bar.
  const ranking = useMemo(() => {
    const rows = TOKENS.map((doc, i) => {
      const parts = queryTerms.map((t) => {
        if (method === "count") {
          const v = rawCount(t, doc);
          return { term: t, value: v };
        }
        const v = tf(t, doc) * idf(t);
        return { term: t, value: v };
      });
      const total = parts.reduce((s, p) => s + p.value, 0);
      return { docIdx: i, total, parts };
    });
    // Stable sort: descending total, then by original index.
    rows.sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.docIdx - b.docIdx;
    });
    return rows;
  }, [queryTerms, method]);

  const maxTotal = Math.max(0.0001, ...ranking.map((r) => r.total));

  // Color cycle for query terms — colorblind-safe accent rotation.
  const TERM_COLORS = ["#1e6da6", "#b6451e", "#3a8c4a", "#7a4ea0"];

  return (
    <WidgetShell kicker={pick(language, "Widget — TF-IDF cooker", "위젯 — TF-IDF 요리기")}>
      {/* Query input + presets */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[12.5px] text-ink-mute">
          {pick(language, "query", "쿼리")}
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-md border border-rule bg-bg-card px-2.5 py-1 font-mono text-[13px] text-ink outline-none focus:border-acc"
          placeholder="cat dog"
          aria-label={pick(language, "search query", "검색 쿼리")}
        />
        <span className="ml-2 font-mono text-[11.5px] text-ink-mute">
          {pick(language, "or try:", "예시:")}
        </span>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setQuery(p)}
            className={
              "rounded-full border px-2.5 py-0.5 font-mono text-[11.5px] transition-colors " +
              (query === p
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            {p}
          </button>
        ))}
      </div>

      {/* Method toggle */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["count", "tfidf"] as Method[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={
              "rounded-full border px-3 py-1 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors " +
              (method === m
                ? "border-acc bg-acc/10 text-acc"
                : "border-rule text-ink-mute hover:border-acc hover:text-acc")
            }
          >
            {m === "count"
              ? pick(language, "raw count", "원시 빈도")
              : pick(language, "TF-IDF", "TF-IDF")}
          </button>
        ))}
      </div>

      {/* IDF table for the current query terms */}
      {queryTerms.length > 0 && method === "tfidf" && (
        <div className="mb-4 rounded-md bg-rule-soft px-4 py-3 font-mono text-[12px]">
          <div className="mb-2 text-ink-mute">
            {pick(
              language,
              `corpus N = ${N} · idf = log₂(N / df)`,
              `코퍼스 N = ${N} · idf = log₂(N / df)`,
            )}
          </div>
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-x-4 gap-y-1.5">
            <span className="text-ink-mute">{pick(language, "term", "단어")}</span>
            <span />
            <span className="text-right text-ink-mute">df</span>
            <span className="text-right text-ink-mute">idf (bits)</span>
            {idfTable.map((r, i) => (
              <RowFrag
                key={`${r.term}-${i}`}
                term={r.term}
                dfVal={r.dfVal}
                idfVal={r.idfVal}
                color={TERM_COLORS[i % TERM_COLORS.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ranked results */}
      <div className="grid gap-2.5">
        {ranking.map((r, rank) => {
          const widthPct = (r.total / maxTotal) * 100;
          const winner = rank === 0 && r.total > 0;
          return (
            <div
              key={r.docIdx}
              className={
                "rounded-md border px-4 py-3 transition-colors " +
                (winner ? "border-acc bg-acc/5" : "border-rule bg-bg-card")
              }
            >
              <div className="mb-2 flex items-baseline gap-3">
                <span
                  className={"font-mono text-[12px] " + (winner ? "text-acc" : "text-ink-mute")}
                >
                  #{rank + 1}
                </span>
                <span className="font-serif text-[15px] text-ink">
                  &ldquo;{DOCS[r.docIdx]}&rdquo;
                </span>
                <span className="ml-auto font-mono text-[12px] text-ink-mute">
                  {pick(language, "len", "길이")}= {TOKENS[r.docIdx].length}
                </span>
              </div>

              {/* Stacked bar: per-term contribution */}
              <div
                className="h-2 w-full overflow-hidden rounded-sm bg-rule-soft"
                style={{ minHeight: 8 }}
              >
                <div className="flex h-full" style={{ width: `${widthPct}%` }}>
                  {r.parts.map((p, i) => {
                    const w = r.total > 0 ? (p.value / r.total) * 100 : 0;
                    return (
                      <div
                        key={`${p.term}-${i}`}
                        style={{
                          width: `${w}%`,
                          background: TERM_COLORS[i % TERM_COLORS.length],
                          opacity: p.value > 0 ? 0.9 : 0,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Numeric breakdown */}
              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11.5px]">
                <span className="text-ink-mute">{pick(language, "score", "점수")}</span>
                <span className={"font-semibold " + (winner ? "text-acc" : "text-ink")}>
                  {fmt(r.total)}
                </span>
                {r.parts.map((p, i) => (
                  <span key={`${p.term}-${i}`} className="text-ink-soft">
                    <span
                      aria-hidden
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: TERM_COLORS[i % TERM_COLORS.length],
                        marginRight: 6,
                        verticalAlign: "middle",
                      }}
                    />
                    {p.term}
                    {": "}
                    {method === "count"
                      ? `${p.value}`
                      : `${fmt(tf(p.term, TOKENS[r.docIdx]), 3)} × ${fmt(idf(p.term), 2)} = ${fmt(p.value, 3)}`}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-rule pt-3 text-[14px] leading-[1.55] text-ink-soft [&_b]:text-ink [&_em]:italic [&_em]:text-acc-deep">
        {pick(
          language,
          <>
            Try this. Search <b className="font-mono">the</b> with <b>raw count</b> — doc 1 wins
            because it uses "the" twice. Switch to <b>TF-IDF</b>: the score collapses to almost
            nothing for every doc, because <em>"the" appears in 3 of 4 docs</em> and{" "}
            <span className="font-mono">log₂(4/3) ≈ 0.42</span> bits is barely any signal. Now
            search <b className="font-mono">fox</b>:{" "}
            <span className="font-mono">log₂(4/1) = 2</span> bits, so the only doc that contains it
            leaps to the top. <em>Rarity is the signal.</em>
          </>,
          <>
            이걸 해보자. <b className="font-mono">the</b>를 <b>원시 빈도</b>로 검색 — 문서 1이
            "the"를 두 번 써서 이긴다. <b>TF-IDF</b>로 바꾸면: 모든 문서의 점수가 거의 0으로
            무너진다. <em>"the"는 4개 문서 중 3개에 등장</em>하므로{" "}
            <span className="font-mono">log₂(4/3) ≈ 0.42</span>비트, 거의 신호가 없기 때문. 이번엔{" "}
            <b className="font-mono">fox</b>: <span className="font-mono">log₂(4/1) = 2</span>비트,
            그래서 fox를 가진 단 하나의 문서가 위로 솟는다. <em>희귀함이 신호다.</em>
          </>,
        )}
      </div>
    </WidgetShell>
  );
}

function RowFrag({
  term,
  dfVal,
  idfVal,
  color,
}: {
  term: string;
  dfVal: number;
  idfVal: number;
  color: string;
}) {
  return (
    <>
      <span className="text-ink">
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: 2,
            background: color,
            marginRight: 6,
            verticalAlign: "middle",
          }}
        />
        {term}
      </span>
      <span />
      <span className="text-right text-ink-soft">{dfVal}</span>
      <span className="text-right text-ink">{fmt(idfVal, 2)}</span>
    </>
  );
}
