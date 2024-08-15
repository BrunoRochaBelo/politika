const STATIC_CACHE_NAME = "static-cache-v2";
const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const MAX_CACHE_ITEMS = 100;

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
  "/static/imagens/icones/1-estrela.svg",
  "/static/imagens/icones/2-estrela.svg",
  "/static/imagens/icones/3-estrela.svg",
  "/static/imagens/icones/4-estrela.svg",
  "/static/imagens/icones/5-estrela.svg",
  "/static/imagens/icones/agora.svg",
  "/static/imagens/icones/apps.svg",
  "/static/imagens/icones/apps-select.svg",
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
  console.log("Service Worker instalado");
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
  console.log("Service Worker ativado");
  return self.clients.claim();
});

function cacheFirst(event) {
  return caches.match(event.request).then((cachedResponse) => {
    if (cachedResponse) {
      console.log(`Cache hit: ${event.request.url}`);
      return cachedResponse;
    }
    console.log(`Cache miss: ${event.request.url}`);
    return fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_ITEMS);
          return networkResponse;
        });
      }
    });
  });
}

function networkFirst(event) {
  return fetch(event.request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_ITEMS);
          console.log(`Network success: ${event.request.url}`);
          return networkResponse;
        });
      }
    })
    .catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`Cache fallback: ${event.request.url}`);
          return cachedResponse;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          console.log(`Offline fallback: ${event.request.url}`);
          return caches.match("/offline.html");
        }
      });
    });
}

function limitCacheSize(name, size) {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        console.log(`Cache limit exceeded: deleting ${keys[0].url}`);
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestURL = new URL(request.url);

  if (urlsToCache.includes(requestURL.pathname)) {
    event.respondWith(cacheFirst(event));
  } else if (API_URLS.includes(requestURL.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          if (response && response.status === 200) {
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }
          console.log(`API fetch success: ${request.url}`);
          return response;
        })
        .catch(() => {
          console.log(`API fetch failure: ${request.url}`);
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            } else {
              return new Response(
                JSON.stringify({
                  error: "API request failed and no cached data available.",
                }),
                { headers: { "Content-Type": "application/json" } }
              );
            }
          });
        })
    );
  } else {
    event.respondWith(networkFirst(event));
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestURL = new URL(request.url);

  if (urlsToCache.includes(requestURL.pathname)) {
    // Verificar se o recurso é crítico para renderização dinâmica
    if (
      requestURL.pathname.endsWith(".js") ||
      requestURL.pathname.endsWith(".css")
    ) {
      // Pode-se forçar um network-first para esses recursos para garantir a atualização
      event.respondWith(networkFirst(event));
    } else {
      event.respondWith(cacheFirst(event));
    }
  } else if (API_URLS.includes(requestURL.pathname)) {
    event.respondWith(networkFirst(event));
  } else {
    event.respondWith(networkFirst(event));
  }
});
