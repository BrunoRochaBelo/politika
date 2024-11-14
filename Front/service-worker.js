// /Front/service-worker.js

// Importa o config.js usando caminho absoluto
importScripts("/Front/static/js/config.js");

// Desestruturação das configurações para facilitar o acesso
const {
  CACHE_NAMES,
  STATIC_URLS_TO_CACHE,
  IMAGE_URLS_TO_CACHE,
  FONT_URLS_TO_CACHE,
  SCRIPT_URLS_TO_CACHE,
  API_URLS,
  EXTERNAL_RESOURCES,
  MAX_CACHE_ITEMS,
} = self.Config;

// Eventos do Service Worker

// Evento de instalação: adiciona recursos ao cache
self.addEventListener("install", (event) => {
  console.log(
    "[Service Worker] Instalando Service Worker e cacheando recursos estáticos."
  );
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.STATIC).then((cache) => {
        console.log(
          `[Service Worker] Cacheando URLs estáticas: ${STATIC_URLS_TO_CACHE}`
        );
        return cache.addAll(STATIC_URLS_TO_CACHE);
      }),
      caches.open(CACHE_NAMES.IMAGE).then((cache) => {
        console.log(
          `[Service Worker] Cacheando URLs de imagens: ${IMAGE_URLS_TO_CACHE}`
        );
        return cache.addAll(IMAGE_URLS_TO_CACHE);
      }),
      caches.open(CACHE_NAMES.FONT).then((cache) => {
        console.log(
          `[Service Worker] Cacheando URLs de fontes: ${FONT_URLS_TO_CACHE}`
        );
        return cache.addAll(FONT_URLS_TO_CACHE);
      }),
      caches.open(CACHE_NAMES.DYNAMIC).then((cache) => {
        console.log(
          `[Service Worker] Cacheando URLs de scripts: ${SCRIPT_URLS_TO_CACHE}`
        );
        return cache.addAll(SCRIPT_URLS_TO_CACHE);
      }),
    ]).catch((error) => {
      console.error(
        "Falha ao adicionar recursos ao cache durante a instalação:",
        error
      );
    })
  );
  self.skipWaiting();
});

// Evento de ativação: limpa caches antigos
self.addEventListener("activate", (event) => {
  console.log(
    "[Service Worker] Ativando Service Worker e limpando caches antigos."
  );
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Filtra caches que não estão definidos no config.js
              return !Object.values(CACHE_NAMES).includes(cacheName);
            })
            .map((cacheName) => {
              console.log(
                `[Service Worker] Deletando cache antigo: ${cacheName}`
              );
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Evento de fetch: intercepta requisições e responde com estratégias de cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestURL = new URL(request.url);

  // Ignorar requests que não são suportados
  if (
    requestURL.protocol === "chrome-extension:" ||
    requestURL.protocol === "data:"
  ) {
    return;
  }

  // Verifica se a requisição é para o mesmo domínio
  if (requestURL.origin === location.origin) {
    if (STATIC_URLS_TO_CACHE.includes(requestURL.pathname)) {
      // Estratégia: Cache First para URLs estáticas
      event.respondWith(cacheFirst(request, CACHE_NAMES.STATIC));
    } else if (API_URLS.includes(requestURL.pathname)) {
      // Estratégia: Network First para APIs
      event.respondWith(networkFirst(request, CACHE_NAMES.API));
    } else if (
      FONT_URLS_TO_CACHE.some((url) => requestURL.pathname.includes(url))
    ) {
      // Estratégia: Cache First para fontes
      event.respondWith(cacheFirst(request, CACHE_NAMES.FONT));
    } else if (
      IMAGE_URLS_TO_CACHE.some((url) => requestURL.pathname.includes(url))
    ) {
      // Estratégia: Cache First para imagens
      event.respondWith(cacheFirst(request, CACHE_NAMES.IMAGE));
    } else if (SCRIPT_URLS_TO_CACHE.includes(requestURL.pathname)) {
      // Estratégia: Network First para scripts dinâmicos
      event.respondWith(networkFirst(request, CACHE_NAMES.DYNAMIC));
    } else {
      // Estratégia padrão: Network First para demais requisições
      event.respondWith(networkFirst(request, CACHE_NAMES.DYNAMIC));
    }
  }
  // Requisições para recursos externos
  else if (
    EXTERNAL_RESOURCES.some((resource) => requestURL.href.startsWith(resource))
  ) {
    // Estratégia: Cache First para recursos externos
    event.respondWith(externalCache(request));
  }
  // Outras requisições não categorizadas
  else {
    // Estratégia padrão: Network First para demais requisições
    event.respondWith(networkFirst(request, CACHE_NAMES.DYNAMIC));
  }
});

// Função de estratégia Cache First
function cacheFirst(request, cacheName) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      console.log(
        `[Service Worker] Retornando recurso do cache: ${request.url}`
      );
      return cachedResponse;
    }

    console.log(`[Service Worker] Buscando recurso na rede: ${request.url}`);
    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          return caches.open(cacheName).then((cache) => {
            console.log(
              `[Service Worker] Adicionando recurso ao cache: ${request.url}`
            );
            cache.put(request, networkResponse.clone());
            limitCacheSize(cacheName, MAX_CACHE_ITEMS);
            return networkResponse;
          });
        } else {
          // Retorna uma resposta de fallback se a resposta da rede não for OK
          console.warn(
            `[Service Worker] Rede retornou status não OK para: ${request.url}. Retornando fallback.`
          );
          return caches.match("/offline.html");
        }
      })
      .catch(() => {
        // Retorna uma resposta de fallback em caso de erro de rede
        console.error(
          `[Service Worker] Erro ao buscar recurso: ${request.url}. Retornando fallback.`
        );
        return caches.match("/offline.html");
      });
  });
}

// Função de estratégia Network First
function networkFirst(request, cacheName) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        return caches.open(cacheName).then((cache) => {
          console.log(
            `[Service Worker] Atualizando cache com recurso da rede: ${request.url}`
          );
          cache.put(request, networkResponse.clone());
          limitCacheSize(cacheName, MAX_CACHE_ITEMS);
          return networkResponse;
        });
      } else {
        // Tenta retornar a resposta do cache se a resposta da rede não for OK
        console.warn(
          `[Service Worker] Rede retornou status não OK para: ${request.url}. Tentando cache.`
        );
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match("/offline.html");
        });
      }
    })
    .catch(() => {
      // Retorna a resposta do cache ou uma página de fallback em caso de erro
      console.error(
        `[Service Worker] Falha ao buscar recurso na rede: ${request.url}. Tentando cache.`
      );
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || caches.match("/offline.html");
      });
    });
}

// Função de estratégia para recursos externos
function externalCache(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      console.log(
        `[Service Worker] Retornando recurso externo do cache: ${request.url}`
      );
      return cachedResponse;
    }

    console.log(
      `[Service Worker] Buscando recurso externo na rede: ${request.url}`
    );
    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          return caches.open(CACHE_NAMES.EXTERNAL).then((cache) => {
            console.log(
              `[Service Worker] Adicionando recurso externo ao cache: ${request.url}`
            );
            cache.put(request, networkResponse.clone());
            limitCacheSize(CACHE_NAMES.EXTERNAL, MAX_CACHE_ITEMS);
            return networkResponse;
          });
        } else {
          // Retorna a resposta da rede mesmo se não for OK
          console.warn(
            `[Service Worker] Rede retornou status não OK para recurso externo: ${request.url}`
          );
          return networkResponse;
        }
      })
      .catch(() => {
        // Retorna uma nova resposta de erro em caso de falha de rede
        console.error(
          `[Service Worker] Erro ao buscar recurso externo: ${request.url}. Retornando erro personalizado.`
        );
        return new Response("Erro na rede", {
          status: 408,
          statusText: "Request Timeout",
        });
      });
  });
}

// Função para limitar o tamanho do cache
function limitCacheSize(name, size) {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        const deleteKey = keys[0];
        console.log(
          `[Service Worker] Excedeu o limite de cache (${size}). Deletando: ${deleteKey.url}`
        );
        cache.delete(deleteKey).then(() => {
          limitCacheSize(name, size);
        });
      }
    });
  });
}

// Evento para lidar com mensagens (por exemplo, skipWaiting)
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    console.log("[Service Worker] Recebida mensagem para skipWaiting.");
    self.skipWaiting();
  }
});
