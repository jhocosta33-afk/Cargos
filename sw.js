// ======= VERSÃO DO CACHE =======
// 🔴 MUDE ESTE NÚMERO SEMPRE QUE ALTERAR O INDEX
const CACHE_VERSION = "v2026-1.0.1";

const CACHE_NAME = `cargos-iasd-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo-iasd.png",
  "./icon-192.png",
  "./icon-512.png"
];

// ======= INSTALL =======
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ======= ACTIVATE =======
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ======= FETCH =======
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza cache com a versão nova
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() =>
        caches.match(event.request)
      )
  );
});
