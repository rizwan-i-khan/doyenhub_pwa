/* Static contents to be cached */
const staticAssets = [
  './',
  './app.js',
  './styles.css',
  './fallback.json',
  './images/offline.jpg'
];

/* sw register for first time, load all static assets into news-v1 cache. */
self.addEventListener('install', async function () {
    const cache = await caches.open("news-v1");
    cache.addAll(staticAssets);
});

/* Fetch Events:  */
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
      event.respondWith(cacheFirst(request));
    } else {
      event.respondWith(networkFirst(request));
    }
});


/* called for cache first */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

/* called for network first */
async function networkFirst(request) {
    const dynamicCache = await caches.open('news-dynamic');
    try {
      const networkResponse = await fetch(request);
      dynamicCache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (err) {
      const cachedResponse = await dynamicCache.match(request);
      return cachedResponse || await caches.match('./fallback.json');
    }
}