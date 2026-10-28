/* Service worker: offline režim a aktualizace.
   Po každé změně aplikace zvyš číslo VERSION, ať si telefon stáhne novou verzi. */
const VERSION = 'v1';
const CORE = 'mongolstina-core-' + VERSION;
const FONTS = 'mongolstina-fonts';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((k) => k.startsWith('mongolstina-core-') && k !== CORE)
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isFontHost(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

async function networkFirst(request) {
  const cache = await caches.open(CORE);
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const fresh = await fetch(request, { signal: ctrl.signal });
    clearTimeout(timer);
    if (fresh && fresh.ok) cache.put('./index.html', fresh.clone());
    return fresh;
  } catch (err) {
    return (await cache.match(request, { ignoreSearch: true })) ||
           (await cache.match('./index.html')) ||
           Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then((resp) => {
    if (resp && (resp.ok || resp.type === 'opaque')) cache.put(request, resp.clone());
    return resp;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, CORE));
  } else if (isFontHost(url)) {
    event.respondWith(staleWhileRevalidate(request, FONTS));
  }
});
