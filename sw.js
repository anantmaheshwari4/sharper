// Sharper service worker
// BUMP THIS VERSION NUMBER every time you change any file and redeploy,
// or your phone will keep showing the old cached version.
const VERSION = "v1";
const CACHE_NAME = "sharper-" + VERSION;

// The files that make up the app shell, cached so it works offline.
const FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// On install: cache the app shell, then take over immediately.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// On activate: delete any old caches from previous versions.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// On every request: serve from cache if we have it, otherwise fetch from network.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
