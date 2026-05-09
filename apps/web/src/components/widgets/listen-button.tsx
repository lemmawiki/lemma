import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, type Language } from "../../context/app-context";

// Browser-native TTS reader. v1 uses window.speechSynthesis — no third-party
// API, no audio assets, runs offline alongside the SEED. The voices are OS-
// dependent (Yuna/Heami for ko on Apple, Samantha/Daniel for en) but they
// already sit on every reader's machine.
//
// Picks up the page's prose by walking the rendered DOM after click — every
// <p> inside <main> that isn't inside a widget. Sentence by sentence so the
// reader can pause cleanly. Pause / resume / stop, that's it.
//
// Future v2 can swap to ElevenLabs for studio-grade voices with audio
// descriptions of widget state. For v1, getting the prose into earbuds is
// enough.

type State = "idle" | "playing" | "paused";

function pickVoice(
  language: Language,
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const target = language === "ko" ? /^ko/i : /^en/i;
  // Prefer local (OS-native) voices over remote — they speak instantly.
  const local = voices.filter((v) => target.test(v.lang) && v.localService);
  const all = voices.filter((v) => target.test(v.lang));
  return local[0] ?? all[0] ?? null;
}

// Walk a node, harvest visible prose. Skip widgets (their controls don't
// vocalize meaningfully) and Compute / Term chips (they collapse to symbols).
function harvestProse(): string[] {
  const main = document.querySelector("main");
  if (!main) return [];
  const out: string[] = [];
  const sel = "main h1, main h2, main h3, main p, main li, main blockquote";
  const nodes = Array.from(main.querySelectorAll(sel)) as HTMLElement[];
  for (const node of nodes) {
    // Skip widget interiors — anything under a [data-no-print] or inside a
    // .MafsView / svg.
    if (node.closest('[data-no-print="true"]')) continue;
    if (node.closest("svg")) continue;
    if (node.closest(".MafsView")) continue;
    const text = node.innerText.replace(/\s+/g, " ").trim();
    if (!text) continue;
    out.push(text);
  }
  return out;
}

// Split a paragraph into sentence-ish chunks. Aggressive — TTS engines
// stutter on very long single utterances.
function chunk(text: string): string[] {
  return text
    .split(/(?<=[.?!。?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function ListenButton({ language: langProp }: { language?: Language } = {}) {
  const ctx = useContext(AppContext);
  const language: Language = langProp ?? ctx?.language ?? "en";
  const [state, setState] = useState<State>("idle");
  const [supported, setSupported] = useState(true);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) setSupported(false);
    return () => {
      // Be a good neighbor on unmount.
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, []);

  function speakNext() {
    if (indexRef.current >= queueRef.current.length) {
      setState("idle");
      return;
    }
    const text = queueRef.current[indexRef.current];
    indexRef.current += 1;
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(language, window.speechSynthesis.getVoices());
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? (language === "ko" ? "ko-KR" : "en-US");
    u.rate = 1.0;
    u.pitch = 1.0;
    u.onend = speakNext;
    u.onerror = () => setState("idle");
    window.speechSynthesis.speak(u);
  }

  function play() {
    if (!supported) return;
    if (state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
      return;
    }
    const prose = harvestProse();
    queueRef.current = prose.flatMap(chunk);
    indexRef.current = 0;
    setState("playing");
    // Voices may not be loaded synchronously on first paint. If empty, wait.
    if (window.speechSynthesis.getVoices().length === 0) {
      const onLoad = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onLoad);
        speakNext();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onLoad);
      // Most browsers also fire it via internal kick — speak triggers loading.
      setTimeout(() => speakNext(), 250);
    } else {
      speakNext();
    }
  }

  function pause() {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    queueRef.current = [];
    indexRef.current = 0;
    setState("idle");
  }

  const labelListen = language === "en" ? "listen" : "듣기";
  const labelPause = language === "en" ? "pause" : "일시정지";
  const labelResume = language === "en" ? "resume" : "이어서";
  const labelStop = language === "en" ? "stop" : "정지";
  const labelUnsupported = language === "en" ? "audio not supported" : "오디오 미지원";

  if (!supported) {
    return (
      <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-mute">
        {labelUnsupported}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-mute"
      data-no-print="true"
    >
      {state === "idle" && (
        <button
          type="button"
          onClick={play}
          className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 transition-colors hover:border-acc hover:text-acc"
          aria-label={labelListen}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
          </svg>
          {labelListen}
        </button>
      )}
      {state === "playing" && (
        <>
          <button
            type="button"
            onClick={pause}
            className="inline-flex items-center gap-1.5 rounded-full border border-acc px-3 py-1 text-acc transition-colors"
            aria-label={labelPause}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <rect x="2" y="1" width="2.5" height="8" fill="currentColor" />
              <rect x="5.5" y="1" width="2.5" height="8" fill="currentColor" />
            </svg>
            {labelPause}
          </button>
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 transition-colors hover:border-acc hover:text-acc"
            aria-label={labelStop}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <rect x="1.5" y="1.5" width="7" height="7" fill="currentColor" />
            </svg>
            {labelStop}
          </button>
        </>
      )}
      {state === "paused" && (
        <>
          <button
            type="button"
            onClick={play}
            className="inline-flex items-center gap-1.5 rounded-full border border-acc px-3 py-1 text-acc transition-colors"
            aria-label={labelResume}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
            </svg>
            {labelResume}
          </button>
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 transition-colors hover:border-acc hover:text-acc"
            aria-label={labelStop}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <rect x="1.5" y="1.5" width="7" height="7" fill="currentColor" />
            </svg>
            {labelStop}
          </button>
        </>
      )}
    </span>
  );
}
