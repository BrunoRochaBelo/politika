const STATIC_CACHE_NAME = "static-cache-v2";
const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const MAX_CACHE_ITEMS = 50;

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
  "/tarefas.html",
  "/static/imagens/logo/logo.png",
  "/static/imagens/logo/logo-1.png",
  "/static/imagens/logo/logo-2.png",
  "/static/imagens/icones/1-estrela.svg",
  "/static/imagens/icones/2-estrela.svg",
  "/static/imagens/icones/3-estrela.svg",
  "/static/imagens/icones/4-estrela.svg",
  "/static/imagens/icones/5-estrela.svg",
  "/static/imagens/icones/agora.svg",
  "/static/imagens/icones/anterior.svg",
  "/static/imagens/icones/avançar.svg",
  "/static/imagens/icones/calendario.svg",
  "/static/imagens/icones/calendario-select.svg",
  "/static/imagens/icones/call.svg",
  "/static/imagens/icones/check.svg",
  "/static/imagens/icones/contas.svg",
  "/static/imagens/icones/contas-select.svg",
  "/static/imagens/icones/contatos.svg",
  "/static/imagens/icones/contatos-select.svg",
  "/static/imagens/icones/dashboard.svg",
  "/static/imagens/icones/dashboard-select.svg",
  "/static/imagens/icones/despesas.svg",
  "/static/imagens/icones/despesas-select.svg",
  "/static/imagens/icones/editar.svg",
  "/static/imagens/icones/endereço.svg",
  "/static/imagens/icones/equipe.svg",
  "/static/imagens/icones/equipe-select.svg",
  "/static/imagens/icones/eventos.svg",
  "/static/imagens/icones/futuro.svg",
  "/static/imagens/icones/gerenciar-conta.svg",
  "/static/imagens/icones/historico.svg",
  "/static/imagens/icones/hoje.svg",
  "/static/imagens/icones/home.svg",
  "/static/imagens/icones/home-select.svg",
  "/static/imagens/icones/identificação.svg",
  "/static/imagens/icones/info_complementar.svg",
  "/static/imagens/icones/menu.svg",
  "/static/imagens/icones/moon.svg",
  "/static/imagens/icones/notificação.svg",
  "/static/imagens/icones/notificação-select.svg",
  "/static/imagens/icones/notificado.svg",
  "/static/imagens/icones/passado.svg",
  "/static/imagens/icones/perfil.svg",
  "/static/imagens/icones/perfil-select.svg",
  "/static/imagens/icones/pessoa-fisica.svg",
  "/static/imagens/icones/pessoa-juridica.svg",
  "/static/imagens/icones/phone.svg",
  "/static/imagens/icones/pleitos.svg",
  "/static/imagens/icones/pleitos-select.svg",
  "/static/imagens/icones/referencia_poli.svg",
  "/static/imagens/icones/sair.svg",
  "/static/imagens/icones/send.svg",
  "/static/imagens/icones/sun.svg",
  "/static/imagens/icones/tarefas.svg",
  "/static/imagens/icones/tarefas-select.svg",
  "/static/imagens/icones/visualização em card.svg",
  "/static/imagens/icones/visualização em lista.svg",
  "/static/imagens/icones/voltar.svg",
  "/static/imagens/icones/whatsapp-icon.svg",
  // Add all scripts
  "/static/scripts/AlterarEsquemaDeCores.js",
  "/static/scripts/AtualizarListaDeArquivos.js",
  "/static/scripts/BarraPesquisaContato.js",
  "/static/scripts/BuscaEndereco.js",
  "/static/scripts/DashboardCentroCustoDespesas.js",
  "/static/scripts/ExibirAniversAriantes.js",
  "/static/scripts/ExibirDetalhesAniversariante.js",
  "/static/scripts/ExibirDetalhesContato.js",
  "/static/scripts/ExibirDetalhesDespesa.js",
  "/static/scripts/ExibirDetalhesEvento.js",
  "/static/scripts/ExibirDetalhesPleito.js",
  "/static/scripts/ExibirDetalhesTarefa.js",
  "/static/scripts/FiltroBtnPerfilInfluencia.js",
  "/static/scripts/FormContato.js",
  "/static/scripts/FormContatoFormatarCampos.js",
  "/static/scripts/FormContatoValidarCampos.js",
  "/static/scripts/GcContaCorrente.js",
  "/static/scripts/GcPerfil.js",
  "/static/scripts/HistoricoDeligacoes.js",
  "/static/scripts/ManipularHistorico.js",
  "/static/scripts/ModalBTNFloating.js",
  "/static/scripts/ModalConcluirPleito.js",
  "/static/scripts/ModalDespacharPleito.js",
  "/static/scripts/ModalDestino.js",
  "/static/scripts/ModalMenu.js",
  "/static/scripts/ModalNotificacoes.js",
  "/static/scripts/NavAbasInternas.js",
  "/static/scripts/NavDia.js",
  "/static/scripts/NavFiltroTarefa.js",
  "/static/scripts/NavSecoes.js",
  "/static/scripts/OcultarExibirAgenda.js",
  "/static/scripts/OcultarExibirFiltro.js",
  "/static/scripts/RecuarExpandirHorizontal.js",
  "/static/scripts/RecuarExpandirVertical.js",
  "/static/scripts/ScrollRemoverItensCalendario.js",
  "/static/scripts/ScrollRemoverItensDespesa.js",
  "/static/scripts/SombraHeaderScroll.js",
];

const API_URLS = ["/api/endpoint1", "/api/endpoint2"];

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
  return self.clients.claim();
});

function cacheFirst(event) {
  return caches.match(event.request).then((cachedResponse) => {
    return (
      cachedResponse ||
      fetch(event.request).then((networkResponse) => {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_ITEMS);
          return networkResponse;
        });
      })
    );
  });
}

function networkFirst(event) {
  return fetch(event.request)
    .then((networkResponse) => {
      if (networkResponse) {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_ITEMS);
          return networkResponse;
        });
      }
      return networkResponse;
    })
    .catch(() => caches.match(event.request));
}

function limitCacheSize(name, size) {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
}

self.addEventListener("fetch", (event) => {
  if (urlsToCache.includes(new URL(event.request.url).pathname)) {
    event.respondWith(cacheFirst(event));
  } else if (API_URLS.includes(new URL(event.request.url).pathname)) {
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
    event.respondWith(
      networkFirst(event).catch(() => {
        return caches.match("/offline.html");
      })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
