const CACHE_NAME = "dica-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/calendario.html",
  "/contatos.html",
  "/despesas.html",
  "/pleitos.html",
  "/static/imagens/logo/logo.png",
  "/static/imagens/logo/logo-2.png",
  "/static/imagens/icones/1-estrela.svg",
  "/static/imagens/icones/2-estrelas.svg",
  "/static/imagens/icones/3-estrelas.svg",
  "/static/imagens/icones/4-estrelas.svg",
  "/static/imagens/icones/5-estrelas.svg",
  "/static/imagens/icones/anterior.svg",
  "/static/imagens/icones/avancar.svg",
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
  "/static/imagens/icones/pesquisar-black.svg",
  "/static/imagens/icones/phone.svg",
  "/static/imagens/icones/pleitos.svg",
  "/static/imagens/icones/pleitos-select.svg",
  "/static/imagens/icones/voltar.svg",
  "/offline.html",
  "/styles.css",
];

// Instala o Service Worker e adiciona os recursos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Falha ao adicionar recursos ao cache:", error);
      });
    })
  );
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Intercepta as solicitações de rede e responde com recursos em cache, se disponíveis
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Serve recurso do cache se disponível
        if (response) {
          return response;
        }
        // Tenta buscar o recurso na rede
        return fetch(event.request).then((networkResponse) => {
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
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
      .catch(() => {
        // Se falhar a busca na rede e não tiver no cache, serve a página de fallback
        return caches.match("/offline.html");
      })
  );
});
