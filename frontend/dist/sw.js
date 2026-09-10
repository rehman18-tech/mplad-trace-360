// MPLAD-TRACE 360 Progressive Web App Service Worker
const CACHE_NAME = 'mplad-trace-v1.2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/images/baseline_inspection.jpg',
  '/images/recent_inspection.jpg'
];

// Install: pre-cache static app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first with Cache fallback for offline mode
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Don't intercept chrome-extension or non-GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Static images and icons: Cache-First
  if (request.url.includes('/images/') || request.url.includes('/icons/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // HTML / App navigation / Assets: Network-first, fallback to Cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful responses for offline use
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails (e.g. airplane mode or offline village), return from cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // If navigating to a page, fallback to index.html (SPA routing)
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return new Response('Offline: Content unavailable without network connection.', {
            status: 503,
            statusText: 'Offline',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
