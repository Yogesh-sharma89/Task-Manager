const CACHE_NAME = 'taskflow-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/images/logo.png' // ➜ Updated path
];


// 1. Install Event: Cache all core UI assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Event: Serve cached files immediately when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached file if found, otherwise download from network
      return cachedResponse || fetch(event.request);
    })
  );
});
