// Keeps the app shell available offline. Data sync is handled by Firebase.
const CACHE = "pvr-gh-v26";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./firebase-config.js", "./icon-192.png", "./icon-512.png", "./mountain-bg.svg"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  const own = url.origin === location.origin && !url.pathname.startsWith("/__/");
  const cdn = /(^|\.)(cdnjs\.cloudflare\.com|gstatic\.com|fonts\.googleapis\.com)$/.test(url.hostname) && !url.pathname.includes("/channel");
  if (!own && !cdn) return;
  e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })
    .catch(() => caches.match(req).then(m => m || (req.mode === "navigate" ? caches.match("./index.html") : undefined))));
});
