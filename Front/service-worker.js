// service-worker.js

// Define os nomes dos caches
const CACHE_NAME = "dica-cache";
const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/calendario.html",
  "/contatos.html",
  "/despesas.html",
  "/pleitos.html",
  "/form-contato.html",
  "/form-evento.html",
  "/form-tarefa.html",
  "/form-lembrete.html",
  "/form-pleito.html",
  "/form-despesa.html",
  "/static/imagens/logo/logo.png",
  "/static/imagens/logo/logo-2.png",
];

// Instala o Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa o Service Worker
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
