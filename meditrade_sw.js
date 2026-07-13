const CACHE = "meditrade-v3";
const ASSETS = [
  "/Meditrade/index.html",
  "/Meditrade/meditrade_manifest.json",
  "/Meditrade/MediTrade_Icon_192.png",
  "/Meditrade/MediTrade_Icon_512.png",
  "/Meditrade/MediTrade_Icon_1024.png",
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request).then(res => {
        if (res && res.status === 200 && e.request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => new Response("Offline", { status: 503 }))
    )
  );
});
