const CACHE_NAME = 'shalom-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/app.css',
    './assets/js/lib/htm.js',
    './assets/js/core/store.js',
    './assets/js/core/icons.js',
    './assets/js/core/pitch.js',
    './assets/js/core/pinyin.js',
    './assets/js/core/json-extract.js',
    './assets/js/core/ai-search.js',
    './assets/js/core/swipe-row.js',
    './assets/js/panels/search-panel.js',
    './assets/js/panels/library-panel.js',
    './assets/js/panels/setlist-panel.js',
    './assets/js/panels/key-panel.js',
    './assets/js/sheets/song-sheet.js',
    './assets/js/sheets/edit-sheet.js',
    './assets/js/sheets/settings-sheet.js',
    './assets/js/sheets/pickpl-sheet.js',
    './assets/js/sheets/newpl-sheet.js',
    './assets/js/app.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/icon-512-maskable.png'
];

// These rarely change once shipped, so they're safe to serve cache-first.
const CACHE_FIRST = ['/assets/icons/icon-192.png', '/assets/icons/icon-512.png', '/assets/icons/icon-512-maskable.png'];

// Install event - cache static assets
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.all(
                ASSETS.map(asset =>
                    cache.add(asset).catch(err => {
                        console.warn('[SW] Failed to cache asset:', asset, err);
                    })
                )
            )
        )
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // CRITICAL FIX: Never intercept or cache AI API calls.
    // Let them go straight to the network.
    if (url.hostname === 'generativelanguage.googleapis.com' || url.hostname === 'api.anthropic.com') {
        return;
    }

    // Icons: cache-first (fast, cheap, and they don't change often).
    if (CACHE_FIRST.some(p => url.pathname.endsWith(p))) {
        e.respondWith(
            caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => Response.error()))
        );
        return;
    }

    // App shell (HTML/CSS/JS/manifest) and page navigations: network-first,
    // so a new deploy shows up the next time you open the app with a
    // connection, with no manual cache-busting needed. Falls back to the
    // cached copy when offline.
    e.respondWith(
        fetch(e.request).then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
            return res;
        }).catch(() =>
            caches.match(e.request).then(cached => {
                if (cached) return cached;
                if (e.request.mode === 'navigate') return caches.match('./index.html');
                return Response.error();
            })
        )
    );
});
