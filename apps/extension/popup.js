const cb = document.getElementById("enabled");
const count = document.getElementById("count");

chrome.storage.local.get("lemmaEnabled").then(({ lemmaEnabled = true }) => {
  cb.checked = lemmaEnabled;
});

cb.addEventListener("change", () => {
  chrome.storage.local.set({ lemmaEnabled: cb.checked });
});

fetch(chrome.runtime.getURL("corpus.json"))
  .then((r) => r.json())
  .then((c) => {
    count.textContent = String(c.count ?? 0);
  })
  .catch(() => {
    count.textContent = "?";
  });
