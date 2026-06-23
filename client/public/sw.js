const CACHE_VERSION = 'sinace-pwa-v3';
const APP_SHELL = [
  '/',
  '/app',
  '/manifest.webmanifest',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon-180.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/favicon.ico',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

const isSameOrigin = request => new URL(request.url).origin === self.location.origin;
const isAppShellRequest = pathname => APP_SHELL.includes(pathname);
const isCriticalAsset = request => ['script', 'style', 'document'].includes(request.destination);
const isPassiveAsset = request => ['image', 'font'].includes(request.destination);

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET' || !isSameOrigin(request)) {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(request, responseClone);
              if (url.pathname === '/' || url.pathname === '/app') {
                cache.put('/app', response.clone());
              }
            });
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          return (
            (await cache.match(request)) ||
            (await cache.match('/app')) ||
            (await cache.match('/')) ||
            (await cache.match('/offline.html'))
          );
        })
    );
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  if (isCriticalAsset(request) || isAppShellRequest(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (isPassiveAsset(request)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, responseClone));
          }
          return response;
        });
      })
    );
  }
});
