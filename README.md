# Shalom

A mobile-first PWA for worship teams: find songs (with AI web search), keep a
personal library with pinyin-annotated Chinese lyrics, build weekly setlists,
and find your vocal key with a built-in mic tuner + range recorder.

No build step. No bundler. Just static files served as-is — open `index.html`
in a browser (or better, run a local static server so the service worker and
mic access work correctly).

## Running it locally

Any static file server works, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed URL. Note: the service worker and `getUserMedia` (mic
access for the Key tab) require either `https://` or `localhost` — opening
`index.html` directly via `file://` will skip the service worker and may block
the microphone.

## Project structure

```
index.html            Loads all scripts/styles, in dependency order
manifest.json         PWA manifest
sw.js                 Service worker (network-first app shell, cache-first icons)
assets/
  css/
    app.css           All styles
  icons/              App icons (192, 512, 512 maskable)
  js/
    lib/
      htm.js          Vendored htm (tagged-template → React.createElement)
    core/             Shared logic, no UI menu of its own
      store.js        Persistence (window.storage → localStorage → memory), uid(), langLabel(), TABS
      icons.js        Bottom-nav tab icons
      pitch.js        Pitch detection (autocorrelation) + note-name helpers
      pinyin.js       Chinese-text tokenizer + <Lyrics> component (pinyin-pro)
      json-extract.js Tolerant JSON parsing (handles fences / truncated AI output)
      ai-search.js    Gemini web-search call used by the Search tab
      swipe-row.js    Swipe-to-delete row wrapper (used by Library + Setlist)
    panels/           One file per bottom-nav menu
      search-panel.js
      library-panel.js
      setlist-panel.js
      key-panel.js
    sheets/           Modal "sheets" opened from the panels above
      song-sheet.js     Full song view (read-only)
      edit-sheet.js     Add / edit song form
      settings-sheet.js Gemini API key entry
      pickpl-sheet.js   "Add to setlist" picker
      newpl-sheet.js    "Create new setlist" form
    app.js            Root <App>, tab/router state, sheet routing, SW registration
```

Everything that isn't `index.html`, `manifest.json`, or `sw.js` (which all need
to stay at the site root) lives under `assets/` — styles, icons, and scripts
alike.

### Why plain `<script>` tags instead of ES modules?

There's no `import`/`export` anywhere. Every file is a classic script, and
top-level `const`/`function` declarations in classic scripts share a single
global scope across the page — so `assets/js/core/store.js` can define `uid`, and
`assets/js/panels/library-panel.js` can just use it directly, no wiring required.

This means **load order in `index.html` matters**. The order is:

1. Vendor scripts (React, ReactDOM, pinyin-pro, htm)
2. `assets/js/core/*` — shared helpers everything else depends on
3. `assets/js/panels/*` — the four menu screens
4. `assets/js/sheets/*` — modals opened from panels
5. `assets/js/app.js` — root component + render + service worker registration (always last)

If you add a new file, add its `<script src>` tag in the right place in that
order.

## Features by menu

- **Search** — Type a song title/author (English or Chinese). Sends a prompt
  with Google Search grounding to the Gemini API (`assets/js/core/ai-search.js`) and
  parses the JSON response. Requires a free Gemini API key, set via the ⚙
  settings sheet.
- **Library** — Songs saved on-device (via `assets/js/core/store.js`), searchable
  offline, swipe left to delete.
- **Setlist** — One or more named setlists; each holds independent copies of
  songs (editing a song in a setlist doesn't affect the Library copy or other
  setlists).
- **Key** — Live pitch detection via the Web Audio API + autocorrelation,
  tracks your sung vocal range, and can record short takes (via
  `MediaRecorder`) to play back or download.

## Persistence

`assets/js/core/store.js` tries, in order:

1. `window.storage` (Claude's storage API, if present)
2. `localStorage`
3. An in-memory fallback (so the app still works if both are unavailable —
   though nothing will survive a reload in that case)

## Chinese lyrics / pinyin

`assets/js/core/pinyin.js` splits each lyric line into runs of Hanzi vs. everything
else, looks up readings via the `pinyin-pro` CDN library, and renders each
Hanzi stacked above its pinyin reading (`.pychar` in `app.css`). This runs
entirely client-side and works offline for any song already in the library —
whether it came from AI search or was typed in manually.

## Service worker / updates

`sw.js` caches the app shell network-first (so a refreshed deploy is picked up
automatically when online) and serves icons cache-first. `CACHE_NAME` is
versioned (`shalom-cache-v1`); bump it whenever you change which files are
cached or their paths, so old installs don't get stuck serving stale assets.
When an update is detected, the app shows a "tap to refresh" toast
(`shalom:update-ready` event in `assets/js/app.js`).
