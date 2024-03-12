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
  "/static/imagens/logo/logo.png",
  "/static/imagens/logo/logo-2.png",
  "/static/imagens/icones/1-estrela.png",
  "/static/imagens/icones/2-estrelas.png",
  "/static/imagens/icones/3-estrelas.png",
  "/static/imagens/icones/4-estrelas.png",
  "/static/imagens/icones/5-estrelas.png",
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
];

// Instala o Service Worker
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
