const STATIC_CACHE_NAME = "static-cache-v1";
const DYNAMIC_CACHE_NAME = "dynamic-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const FONT_CACHE_NAME = "font-cache-v1";
const IMAGE_CACHE_NAME = "image-cache-v1";
const EXTERNAL_CACHE_NAME = "external-cache-v1";
const MAX_CACHE_ITEMS = 100;

// URLs para o cache estático
const staticUrlsToCache = [
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
];

// URLs de imagens e ícones para o cache de imagens
const imageUrlsToCache = [
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
  "/static/imagens/icones/home.svg",
  "/static/imagens/icones/home-select.svg",
  "/static/imagens/icones/identificação.svg",
  "/static/imagens/icones/info_complementar.svg",
  "/static/imagens/icones/menu.svg",
  "/static/imagens/icones/moon.svg",
  "/static/imagens/icones/notificação.svg",
  "/static/imagens/icones/notificação-select.svg",
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
  "/static/imagens/icones/voltar.svg",
  "/static/imagens/icones/whatsapp-icon.svg",
];

// URLs de fontes para o cache de fontes
const fontUrlsToCache = [
  "/static/fonts/font1.woff2",
  "/static/fonts/font2.woff2",
];

// URLs de scripts para o cache dinâmico
const scriptUrlsToCache = [
  "/static/scripts/AlterarEsquemaDeCores.js",
  "/static/scripts/AtualizarListaDeArquivos.js",
  "/static/scripts/BarraPesquisaContato.js",
  "/static/scripts/BuscaEndereco.js",
  "/static/scripts/DashboardCentroCustoDespesas.js",
  "/static/scripts/DespesaSearchAll.js",
  "/static/scripts/ExibirAniversAriantes.js",
  "/static/scripts/ExibirDetalhesAniversariante.js",
  "/static/scripts/ExibirDetalhesContato.js",
  "/static/scripts/ExibirDetalhesDespesa.js",
  "/static/scripts/ExibirDetalhesEvento.js",
  "/static/scripts/ExibirDetalhesPleito.js",
  "/static/scripts/ExibirDetalhesTarefa.js",
  "/static/scripts/FiltroBtnPerfilInfluencia.js",
  "/static/scripts/FormContatoFormatarCampos.js",
  "/static/scripts/GcContaCorrente.js",
  "/static/scripts/GcPerfil.js",
  "/static/scripts/HistoricoDeLigacoes.js",
  "/static/scripts/IncluirContato.js",
  "/static/scripts/IncluirEmpresa.js",
  "/static/scripts/ManipularHistorico.js",
  "/static/scripts/ModalBTNFloating.js",
  "/static/scripts/ModalConcluirPleito.js",
  "/static/scripts/ModalDespacharPleito.js",
  "/static/scripts/ModalDestino.js",
  "/static/scripts/ModalMaisApps.js",
  "/static/scripts/ModalMenu.js",
  "/static/scripts/ModalNotificacoes.js",
  "/static/scripts/NavAbasInternas.js",
  "/static/scripts/NavDia.js",
  "/static/scripts/NavFiltroTarefa.js",
  "/static/scripts/NavSecoes.js",
  "/static/scripts/OcultarExibirAgenda.js",
  "/static/scripts/OcultarExibirFiltro.js",
  "/static/scripts/RecuarExpandirHorizontal.js",
  "/static/scripts/RegisterSW.js",
  "/static/scripts/ScrollRemoverItensCalendario.js",
  "/static/scripts/ScrollRemoverItensDespesa.js",
  "/static/scripts/SombraHeaderScroll.js",
];

// URLs de APIs que podem ser cacheadas dinamicamente
const API_URLS = [
  "/api/endpoint1",
  "/api/endpoint2",
  // Adicione outras URLs de API se necessário
];

// URLs externas que precisam ser cacheadas
const EXTERNAL_RESOURCES = [
  "https://fonts.googleapis.com",
  "https://cdn.jsdelivr.net",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .open(STATIC_CACHE_NAME)
        .then((cache) => cache.addAll(staticUrlsToCache)),
      caches
        .open(IMAGE_CACHE_NAME)
        .then((cache) => cache.addAll(imageUrlsToCache)),
      caches
        .open(FONT_CACHE_NAME)
        .then((cache) => cache.addAll(fontUrlsToCache)),
      caches
        .open(DYNAMIC_CACHE_NAME)
        .then((cache) => cache.addAll(scriptUrlsToCache)),
    ]).catch((error) => {
      console.error("Falha ao adicionar recursos ao cache:", error);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return ![
              STATIC_CACHE_NAME,
              DYNAMIC_CACHE_NAME,
              API_CACHE_NAME,
              FONT_CACHE_NAME,
              IMAGE_CACHE_NAME,
              EXTERNAL_CACHE_NAME,
            ].includes(cacheName);
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

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

  if (requestURL.origin === location.origin) {
    if (staticUrlsToCache.includes(requestURL.pathname)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    } else if (API_URLS.includes(requestURL.pathname)) {
      event.respondWith(networkFirst(request));
    } else if (
      fontUrlsToCache.some((url) => requestURL.pathname.includes(url))
    ) {
      event.respondWith(cacheFirst(request, FONT_CACHE_NAME));
    } else if (
      imageUrlsToCache.some((url) => requestURL.pathname.includes(url))
    ) {
      event.respondWith(cacheFirst(request, IMAGE_CACHE_NAME));
    } else if (scriptUrlsToCache.includes(requestURL.pathname)) {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(networkFirst(request));
    }
  } else if (
    EXTERNAL_RESOURCES.some((resource) => requestURL.href.startsWith(resource))
  ) {
    event.respondWith(externalCache(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) return cachedResponse;

    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          return caches.open(cacheName).then((cache) => {
            cache.put(request, networkResponse.clone());
            limitCacheSize(cacheName, MAX_CACHE_ITEMS);
            return networkResponse;
          });
        } else {
          // Retorna uma resposta de fallback se a resposta da rede não for OK
          return caches.match("/offline.html");
        }
      })
      .catch(() => {
        // Retorna uma resposta de fallback em caso de erro de rede
        return caches.match("/offline.html");
      });
  });
}

function networkFirst(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_ITEMS);
          return networkResponse;
        });
      } else {
        // Tenta retornar a resposta do cache se a resposta da rede não for OK
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match("/offline.html");
        });
      }
    })
    .catch(() => {
      // Retorna a resposta do cache ou uma página de fallback em caso de erro
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || caches.match("/offline.html");
      });
    });
}

function externalCache(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) return cachedResponse;

    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          return caches.open(EXTERNAL_CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            limitCacheSize(EXTERNAL_CACHE_NAME, MAX_CACHE_ITEMS);
            return networkResponse;
          });
        } else {
          // Retorna a resposta da rede mesmo se não for OK
          return networkResponse;
        }
      })
      .catch(() => {
        // Retorna uma nova resposta de erro em caso de falha de rede
        return new Response("Erro na rede", {
          status: 408,
          statusText: "Request Timeout",
        });
      });
  });
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

// Adicionar o manipulador de eventos 'message'
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
