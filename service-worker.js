const CACHE_NAME = "firstpwa-v7";
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
  "/img/cinema.jpg",
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  "https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
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
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME })
      .then(response => {
        if (response) {
          console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
          return response;
        }
         console.log(
          "ServiceWorker: Memuat aset dari server: ",
          event.request.url
        );
         return fetch(event.request);
      })
  )
});