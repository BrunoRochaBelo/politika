const STATIC_CACHE_NAME = "static-cache-v1";
const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/calendario.html",
  "/contatos.html",
  "/despesas.html",
  "/pleitos.html",
  "/offline.html",
  "/styles.css",
  "/static/imagens/logo/logo.png",
  "/static/imagens/logo/logo-2.png",
  "/static/imagens/icones/1-estrela.svg",
  "/static/imagens/icones/2-estrela.svg",
  "/static/imagens/icones/3-estrela.svg",
  "/static/imagens/icones/4-estrela.svg",
  "/static/imagens/icones/5-estrela.svg",
  "/static/imagens/icones/anterior.svg",
  "/static/imagens/icones/avançar.svg",
  "/static/imagens/icones/calendario.svg",
  "/static/imagens/icones/calendario-select.svg",
  "/static/imagens/icones/contatos.svg",
  "/static/imagens/icones/contatos-select.svg",
  "/static/imagens/icones/despesas.svg",
  "/static/imagens/icones/despesas-select.svg",
  "/static/imagens/icones/home.svg",
  "/static/imagens/icones/home-select.svg",
  "/static/imagens/icones/menu.svg",
  "/static/imagens/icones/pesquisar.svg",
  "/static/imagens/icones/call.svg",
  "/static/imagens/icones/pleitos.svg",
  "/static/imagens/icones/pleitos-select.svg",
  "/static/imagens/icones/voltar.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("Static cache aberto");
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Falha ao adicionar recursos ao cache:", error);
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Estratégia Cache First
function cacheFirst(event) {
  return caches.match(event.request).then((cachedResponse) => {
    return (
      cachedResponse ||
      fetch(event.request).then((networkResponse) => {
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      })
    );
  });
}

// Estratégia Network First
function networkFirst(event) {
  return fetch(event.request)
    .then((networkResponse) => {
      if (networkResponse) {
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
      }
      return networkResponse;
    })
    .catch(() => caches.match(event.request));
}

const MAX_CACHE_ITEMS = 50;

function limitCacheSize(name, size) {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
}

const API_URLS = ["/api/endpoint1", "/api/endpoint2"];

self.addEventListener("fetch", (event) => {
  if (urlsToCache.includes(event.request.url)) {
    event.respondWith(cacheFirst(event));
  } else if (API_URLS.includes(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(API_CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(networkFirst(event));
  }

  if (!urlsToCache.includes(event.request.url)) {
    event.waitUntil(limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_ITEMS));
  }
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            // Verifica se a resposta é válida
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== "basic"
            ) {
              return networkResponse;
            }
            // Clona a resposta e armazena no cache
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
        );
      })
      .catch(() => {
        // Se falhar a busca na rede e não tiver no cache, serve a página de fallback
        return caches.match("/offline.html");
      })
  );
});
