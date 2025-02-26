// /Front/static/js/config.js

const Config = {
  // 1. Ambiente Atual
  ENVIRONMENT: "development", // 'production' ou 'development'

  // 2. URLs Base para Diferentes Ambientes
  BASE_URL: {
    development: "http://192.168.1.14:8000",
    production: "http://dev.inforvia.com.br",
  },

  // 3. Caminho para o Service Worker
  SERVICE_WORKER_PATH: "/Front/service-worker.js",

  // 4. Nomes de Cache
  CACHE_NAMES: {
    STATIC: "static-cache-v1",
    DYNAMIC: "dynamic-cache-v1",
    API: "api-cache-v1",
    FONT: "font-cache-v1",
    IMAGE: "image-cache-v1",
    EXTERNAL: "external-cache-v1",
  },

  // 5. Limite de Itens no Cache
  MAX_CACHE_ITEMS: 100, // Valor padrão para desenvolvimento

  // 6. URLs para o Cache Estático
  STATIC_URLS_TO_CACHE: [
    "/",
    "/index.html",
    "/login.html",
    "/arquivos.html",
    "/calendario.html",
    "/contatos.html",
    "/despesas.html",
    "/pleitos.html",
    "/offline.html",
    "/styles.css",
    "/tarefas.html",
  ],

  // 7. URLs de Imagens e Ícones para o Cache de Imagens
  IMAGE_URLS_TO_CACHE: [
    "/static/imagens/logo/logo.png",
    "/static/imagens/icones/1-estrela.svg",
    "/static/imagens/icones/2-estrela.svg",
    "/static/imagens/icones/3-estrela.svg",
    "/static/imagens/icones/4-estrela.svg",
    "/static/imagens/icones/5-estrela.svg",
    "/static/imagens/icones/add.svg",
    "/static/imagens/icones/agora.svg",
    "/static/imagens/icones/apps.svg",
    "/static/imagens/icones/apps-select.svg",
    "/static/imagens/icones/arquivos.svg",
    "/static/imagens/icones/arquivos-select.svg",
    "/static/imagens/icones/anterior.svg",
    "/static/imagens/icones/avançar.svg",
    "/static/imagens/icones/calendario.svg",
    "/static/imagens/icones/calendario-select.svg",
    "/static/imagens/icones/call.svg",
    "/static/imagens/icones/check.svg",
    "/static/imagens/icones/contas-corrente.svg",
    "/static/imagens/icones/contas-corrente-corrente-select.svg",
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
    "/static/imagens/icones/excluir.svg",
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
  ],

  // 8. URLs de Fontes para o Cache de Fontes
  FONT_URLS_TO_CACHE: [
    "/static/fonts/font1.woff2",
    "/static/fonts/font2.woff2",
  ],

  // 9. URLs de Scripts para o Cache Dinâmico
  SCRIPT_URLS_TO_CACHE: [
    "/static/js/AlterarEsquemaDeCores.js",
    "/static/js/AtualizarListaDeArquivos.js",
    "/static/js/BarraPesquisaContato.js",
    "/static/js/BuscaEndereco.js",
    "/static/js/DashboardCentroCustoDespesas.js",
    "/static/js/DespesaSearchAll.js",
    "/static/js/ExibirAniversAriantes.js",
    "/static/js/ExibirDetalhesAniversariante.js",
    "/static/js/ExibirDetalhesContato.js",
    "/static/js/ExibirDetalhesDespesa.js",
    "/static/js/ExibirDetalhesEvento.js",
    "/static/js/ExibirDetalhesPleito.js",
    "/static/js/ExibirDetalhesTarefa.js",
    "/static/js/FiltroBtnPerfilInfluencia.js",
    "/static/js/FormContatoFormatarCampos.js",
    "/static/js/GcContaCorrente.js",
    "/static/js/GcPerfil.js",
    "/static/js/HistoricoDeLigacoes.js",
    "/static/js/IncluirContato.js",
    "/static/js/IncluirEmpresa.js",
    "/static/js/ManipularHistorico.js",
    "/static/js/ModalBTNFloating.js",
    "/static/js/ModalConcluirPleito.js",
    "/static/js/ModalDespacharPleito.js",
    "/static/js/ModalDestino.js",
    "/static/js/ModalMaisApps.js",
    "/static/js/ModalMenu.js",
    "/static/js/ModalNotificacoes.js",
    "/static/js/NavAbasInternas.js",
    "/static/js/NavDia.js",
    "/static/js/NavFiltroTarefa.js",
    "/static/js/NavSecoes.js",
    "/static/js/OcultarExibirAgenda.js",
    "/static/js/OcultarExibirFiltro.js",
    "/static/js/RecuarExpandirHorizontal.js",
    "/static/js/RegisterSW.js",
    "/static/js/ScrollRemoverItensCalendario.js",
    "/static/js/ScrollRemoverItensDespesa.js",
    "/static/js/SombraHeaderScroll.js",
  ],

  // 10. URLs de APIs que Podem Ser Cacheadas Dinamicamente
  API_URLS: [
    "/api/contato/searchall",
    "/api/destino/searchall",
    "/api/localvotacao/searchall",
    "/api/endpoint1",
    "/api/endpoint2",
    // Adicione outras URLs de API se necessário
  ],

  // 11. URLs Externas que Precisam Ser Cacheadas
  EXTERNAL_RESOURCES: [
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
  ],

  // 12. Endpoints de API
  API_ENDPOINTS: {
    CONTACT_SEARCH_ALL: "/api/contato/searchall",
    DESTINATION_SEARCH_ALL: "/api/destino/searchall",
    VOTATION_LOCATION_SEARCH_ALL: "/api/localvotacao/searchall",
    GET_ALL_LIBS: "/api/docfile/get/all_libs",
    GET_ALL_FOLDERS: "/api/docfile/get/all_folders",
    GET_ALL_FOLDER_DOCS: "/api/docfile/get/all_folders_docs",
  },

  // 13. Feature Flags
  FEATURE_FLAGS: {
    ENABLE_DASHBOARD: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_OFFLINE_MODE: true,
    // Adicione mais flags conforme necessário
  },

  // 14. Configurações de Segurança
  SECURITY: {
    CONTENT_SECURITY_POLICY:
      "default-src 'self'; script-src 'self'; object-src 'none';",
    // Adicione mais configurações conforme necessário
  },

  // 15. Configurações de Performance
  PERFORMANCE: {
    CACHE_EXPIRATION_DAYS: 1, // Valor padrão para desenvolvimento
    MAX_CONCURRENT_REQUESTS: 5,
    // Adicione mais configurações conforme necessário
  },

  // 16. URLs de Recursos Estáticos
  STATIC_RESOURCES: {
    LOGO: "/static/imagens/logo/logo.png",
    ICONS: {
      STAR_1: "/static/imagens/icones/1-estrela.svg",
      STAR_2: "/static/imagens/icones/2-estrela.svg",
      STAR_3: "/static/imagens/icones/3-estrela.svg",
      STAR_4: "/static/imagens/icones/4-estrela.svg",
      STAR_5: "/static/imagens/icones/5-estrela.svg",
      ADD: "/static/imagens/icones/add.svg",
      AGORA: "/static/imagens/icones/agora.svg",
      APPS: "/static/imagens/icones/apps.svg",
      APPS_SELECT: "/static/imagens/icones/apps-select.svg",
      ARQUIVOS: "/static/imagens/icones/arquivos.svg",
      ARQUIVOS_SELECT: "/static/imagens/icones/arquivos-select.svg",
      ANTERIOR: "/static/imagens/icones/anterior.svg",
      AVANCAR: "/static/imagens/icones/avançar.svg",
      CALENDARIO: "/static/imagens/icones/calendario.svg",
      CALENDARIO_SELECT: "/static/imagens/icones/calendario-select.svg",
      CALL: "/static/imagens/icones/call.svg",
      CHECK: "/static/imagens/icones/check.svg",
      CONTAS_CORRENTE: "/static/imagens/icones/contas-corrente.svg",
      CONTAS_CORRENTE_SELECT:
        "/static/imagens/icones/contas-corrente-corrente-select.svg",
      CONTATOS: "/static/imagens/icones/contatos.svg",
      CONTATOS_SELECT: "/static/imagens/icones/contatos-select.svg",
      DASHBOARD: "/static/imagens/icones/dashboard.svg",
      DASHBOARD_SELECT: "/static/imagens/icones/dashboard-select.svg",
      DESPESAS: "/static/imagens/icones/despesas.svg",
      DESPESAS_SELECT: "/static/imagens/icones/despesas-select.svg",
      EDITAR: "/static/imagens/icones/editar.svg",
      ENDERECO: "/static/imagens/icones/endereço.svg",
      EQUIPE: "/static/imagens/icones/equipe.svg",
      EQUIPE_SELECT: "/static/imagens/icones/equipe-select.svg",
      EVENTOS: "/static/imagens/icones/eventos.svg",
      EXCLUIR: "/static/imagens/icones/excluir.svg",
      FUTURO: "/static/imagens/icones/futuro.svg",
      GERENCIAR_CONTA: "/static/imagens/icones/gerenciar-conta.svg",
      HISTORICO: "/static/imagens/icones/historico.svg",
      HOME: "/static/imagens/icones/home.svg",
      HOME_SELECT: "/static/imagens/icones/home-select.svg",
      IDENTIFICACAO: "/static/imagens/icones/identificação.svg",
      INFO_COMPLEMENTAR: "/static/imagens/icones/info_complementar.svg",
      MENU: "/static/imagens/icones/menu.svg",
      MOON: "/static/imagens/icones/moon.svg",
      NOTIFICACAO: "/static/imagens/icones/notificação.svg",
      NOTIFICACAO_SELECT: "/static/imagens/icones/notificação-select.svg",
      PASSADO: "/static/imagens/icones/passado.svg",
      PERFIL: "/static/imagens/icones/perfil.svg",
      PERFIL_SELECT: "/static/imagens/icones/perfil-select.svg",
      PESSOA_FISICA: "/static/imagens/icones/pessoa-fisica.svg",
      PESSOA_JURIDICA: "/static/imagens/icones/pessoa-juridica.svg",
      PHONE: "/static/imagens/icones/phone.svg",
      PLEITOS: "/static/imagens/icones/pleitos.svg",
      PLEITOS_SELECT: "/static/imagens/icones/pleitos-select.svg",
      REFERENCIA_POLI: "/static/imagens/icones/referencia_poli.svg",
      SAIR: "/static/imagens/icones/sair.svg",
      SEND: "/static/imagens/icones/send.svg",
      SUN: "/static/imagens/icones/sun.svg",
      TAREFAS: "/static/imagens/icones/tarefas.svg",
      TAREFAS_SELECT: "/static/imagens/icones/tarefas-select.svg",
      VOLTAR: "/static/imagens/icones/voltar.svg",
      WHATSAPP_ICON: "/static/imagens/icones/whatsapp-icon.svg",
    },
  },

  // 17. Configurações de Internacionalização (i18n)
  I18N: {
    DEFAULT_LANGUAGE: "pt-BR",
    SUPPORTED_LANGUAGES: ["pt-BR", "en-US", "es-ES"],
  },

  // 18. Configurações de Analytics
  ANALYTICS: {
    GOOGLE_ANALYTICS_ID: "UA-XXXXXX-X", // Habilitado somente em produção
  },
};

// Aplicar valores condicionais após a definição do objeto
if (Config.ENVIRONMENT === "production") {
  Config.MAX_CACHE_ITEMS = 500;
  Config.PERFORMANCE.CACHE_EXPIRATION_DAYS = 30;
  Config.ANALYTICS.GOOGLE_ANALYTICS_ID = "UA-XXXXXX-X";
} else {
  Config.MAX_CACHE_ITEMS = 100;
  Config.PERFORMANCE.CACHE_EXPIRATION_DAYS = 1;
  Config.ANALYTICS.GOOGLE_ANALYTICS_ID = null;
}

// Exponha o Config no escopo global para acesso tanto na main thread quanto no Service Worker
if (typeof window !== "undefined") {
  window.Config = Config;
}

if (typeof self !== "undefined") {
  self.Config = Config;
}
