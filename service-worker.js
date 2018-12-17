const CACHE_NAME = "firstpwa-v6";
const IMAGE_CACHE = 'images-cache';
const allCaches = [
  CACHE_NAME,
  IMAGE_CACHE
];
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/pages/home.html",
  "/pages/popular.html",
  "/pages/top-rated.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/logo.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  )
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('firstpwa-') && !allCaches.includes(cacheName);
        }).map(cacheName => {
          return caches.delete(cacheName)
        })
      )
    })
  )
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.includes('.jpg') || requestUrl.pathname.includes('.png')){
    event.respondWith(serveImage(event.request));
    return;
  }else{
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request)),
    );
    return;
  }
})

function serveImage(req) {
  return caches.open(IMAGE_CACHE).then( cache => {
    return cache.match(req.url).then( response => {
      if (response) return response;

      return fetch(req).then( networkResponse => {
        cache.put(req.url, networkResponse.clone());
        return networkResponse;
      })
    })
  })
}