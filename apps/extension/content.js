// Content script — runs on every page, scans for known glossary terms,
// underlines matches, and renders a popover on click linking back to Lemma.
//
// Default ON; togglable via chrome.storage.local.lemmaEnabled.

(async function lemmaDeconstruct() {
  if (window.__lemmaDeconstructLoaded) return;
  window.__lemmaDeconstructLoaded = true;

  const { lemmaEnabled = true } = await chrome.storage.local.get("lemmaEnabled");
  if (!lemmaEnabled) return;

  let corpus;
  try {
    const url = chrome.runtime.getURL("corpus.json");
    corpus = await (await fetch(url)).json();
  } catch (err) {
    console.warn("[Lemma] failed to load corpus", err);
    return;
  }

  // Build phrase index.
  // Skip ASCII single words shorter than 6 chars to keep noise down ("log", "bit",
  // "base" are common non-math words on the open web). Multi-word phrases and
  // anything with non-ASCII chars are kept as-is.
  const index = new Map();
  function shouldIndex(phrase) {
    if (/^[A-Za-z]+$/.test(phrase) && phrase.length < 6) return false;
    return true;
  }
  for (const entry of corpus.entries) {
    for (const lang of ["en", "ko"]) {
      const phrase = entry[lang]?.term;
      if (!phrase) continue;
      if (!shouldIndex(phrase)) continue;
      const key = phrase.toLowerCase();
      if (!index.has(key)) index.set(key, { ...entry, lang });
    }
  }

  const phrases = Array.from(index.keys()).sort((a, b) => b.length - a.length);
  if (!phrases.length) return;

  // Build single regex with word-boundaries on ASCII phrases. Korean has no
  // word boundaries so non-ASCII phrases match anywhere.
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isAscii(s) {
    for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) return false;
    return true;
  }
  const patterns = phrases.map((p) => {
    const e = escapeRe(p);
    return isAscii(p) ? `\\b${e}\\b` : e;
  });
  const re = new RegExp(`(${patterns.join("|")})`, "giu");

  const skipTags = new Set([
    "SCRIPT",
    "STYLE",
    "CODE",
    "PRE",
    "TEXTAREA",
    "INPUT",
    "NOSCRIPT",
    "IFRAME",
    "SVG",
    "MATH",
    "BUTTON",
  ]);

  function nodeOK(node) {
    if (!node.nodeValue || node.nodeValue.trim().length < 4) return false;
    let p = node.parentNode;
    while (p) {
      if (p.nodeType === 1) {
        if (skipTags.has(p.tagName)) return false;
        if (p.classList?.contains("lemma-mark")) return false;
        if (p.isContentEditable) return false;
      }
      p = p.parentNode;
    }
    return true;
  }

  let matched = 0;
  const cap = 200;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (nodeOK(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const targets = [];
  let n;
  while ((n = walker.nextNode())) targets.push(n);

  for (const node of targets) {
    if (matched >= cap) break;
    const text = node.nodeValue;
    re.lastIndex = 0;
    if (!re.test(text)) continue;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m;
    while ((m = re.exec(text)) !== null && matched < cap) {
      const start = m.index;
      const end = start + m[0].length;
      if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
      const entry = index.get(m[0].toLowerCase());
      const span = document.createElement("span");
      span.className = "lemma-mark";
      span.dataset.id = entry?.id ?? "";
      span.textContent = m[0];
      frag.appendChild(span);
      last = end;
      matched++;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    if (last > 0) node.parentNode?.replaceChild(frag, node);
  }

  // Popover.
  let pop = null;
  function closePop() {
    if (pop) {
      pop.remove();
      pop = null;
    }
  }

  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (t instanceof HTMLElement && t.classList.contains("lemma-mark")) {
        e.preventDefault();
        e.stopPropagation();
        const id = t.dataset.id;
        if (!id) return;
        const entry = corpus.entries.find((x) => x.id === id);
        if (!entry) return;
        closePop();
        pop = renderPopover(t, entry);
        return;
      }
      if (pop && t instanceof Node && !pop.contains(t)) closePop();
    },
    true,
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePop();
  });

  function renderPopover(anchor, entry) {
    const pageLang = (document.documentElement.lang || "").toLowerCase().startsWith("ko")
      ? "ko"
      : "en";
    const other = pageLang === "en" ? "ko" : "en";
    const primary = entry[pageLang] ?? entry.en ?? entry.ko;
    const counter = entry[other];

    const div = document.createElement("div");
    div.className = "lemma-pop";
    const r = anchor.getBoundingClientRect();
    div.style.top = `${window.scrollY + r.bottom + 6}px`;
    const w = 360;
    div.style.left = `${Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + window.innerWidth - w - 8))}px`;

    const head = document.createElement("div");
    head.className = "lemma-pop-head";
    const t1 = document.createElement("span");
    t1.className = "lemma-pop-term";
    t1.textContent = primary?.term ?? entry.id;
    head.appendChild(t1);
    if (counter?.term) {
      const t2 = document.createElement("span");
      t2.className = "lemma-pop-counter";
      t2.textContent = ` · ${counter.term}`;
      head.appendChild(t2);
    }
    div.appendChild(head);

    const body = document.createElement("div");
    body.className = "lemma-pop-body";
    body.textContent = primary?.oneLiner ?? "";
    div.appendChild(body);

    const foot = document.createElement("div");
    foot.className = "lemma-pop-foot";
    const link = document.createElement("a");
    // Corpus URLs are emitted as /en/... — swap to the reader's page lang.
    const localizedPath = pageLang === "ko" ? entry.url.replace(/^\/en\//, "/ko/") : entry.url;
    link.href = corpus.site + localizedPath;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = pageLang === "ko" ? "Lemma에서 열기 →" : "Open in Lemma →";
    foot.appendChild(link);
    const meta = document.createElement("span");
    meta.className = "lemma-pop-meta";
    meta.textContent = entry.id;
    foot.appendChild(meta);
    div.appendChild(foot);

    document.body.appendChild(div);
    return div;
  }
})();
