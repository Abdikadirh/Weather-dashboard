/* public/sw.js */
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

const SW_VERSION = '2.2.0';               // bump to force update
const CACHE_NAME = `weather-dashboard-${SW_VERSION}`;
const STATIC_ASSETS = [
  '/', '/manifest.json', '/favicon.ico', '/logo192.png'
  // add '/offline.html' here only if you actually create it
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('weather-dashboard-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// SINGLE fetch handler (no duplicates)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only GET
  if (req.method !== 'GET') return;

  // Only same-origin (let OpenWeather requests go straight to network)
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        })
        .catch(async () => {
          // fallback to cached shell (or offline.html if you added it)
          return (await caches.match(req)) || (await caches.match('/'));
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
