import { useEffect, useState } from "react";
import { formatRelative, getPageRead, resumeScroll, type PageRead } from "../../lib/progress";
import type { Language } from "../../context/app-context";

// Tiny "you were here last time" banner.
//
// Only renders when the reader has prior state on this URL, the prior visit
// reached at least 10% of the page (otherwise it's not really a resume),
// and the current viewport is still near the top (so we don't elbow in
// after the reader has already started scrolling).

const MIN_RESUME_FRACTION = 0.1;
const RECENT_VISIT_GUARD_MS = 60 * 1000;

export function ProgressBanner({ language }: { language?: Language }) {
  const lang = language ?? "en";
  const [state, setState] = useState<PageRead | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const url = window.location.pathname;
    const read = getPageRead(url);
    if (!read) return;

    // Direct-from-recent-panel click: auto-resume silently, strip the param,
    // do not show the banner. The reader already chose to come back.
    const params = new URLSearchParams(window.location.search);
    if (params.get("resume") === "1") {
      resumeScroll(read.scrollMax, false);
      params.delete("resume");
      const qs = params.toString();
      const clean = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
      window.history.replaceState(null, "", clean);
      return;
    }

    if (read.scrollMax < MIN_RESUME_FRACTION) return;
    if (Date.now() - read.last < RECENT_VISIT_GUARD_MS) return;
    if (window.scrollY > 100) return;
    setState(read);
  }, []);

  if (!state || dismissed) return null;

  const pct = Math.round(state.scrollMax * 100);
  const ago = formatRelative(state.last, lang);
  const labelLine = lang === "ko" ? `${ago}, ${pct}%까지 읽음` : `${ago}, ${pct}% in`;
  const labelResume = lang === "ko" ? "이어 읽기" : "resume";
  const labelDismiss = lang === "ko" ? "닫기" : "dismiss";

  function onResume() {
    if (!state) return;
    resumeScroll(state.scrollMax);
    setDismissed(true);
  }

  return (
    <aside
      className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule pb-2.5 font-mono text-[12px] text-ink-mute"
      data-no-print="true"
    >
      <span>{labelLine}</span>
      <button
        type="button"
        onClick={onResume}
        className="rounded-full border border-acc px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.06em] text-acc hover:bg-acc-soft"
      >
        {labelResume} →
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-auto text-[11px] uppercase tracking-[0.06em] hover:text-ink"
        aria-label={labelDismiss}
      >
        ×
      </button>
    </aside>
  );
}
