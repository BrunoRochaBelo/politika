// AlterarEsquemaDeCores.js

document.addEventListener("DOMContentLoaded", (event) => {
  const themeToggleButton = document.getElementById("toggleTheme");
  const themeIcon = document.getElementById("themeIcon");
  const alterarTema = document.querySelector(".alterar-tema");
  const headerElement = document.querySelector("header.header");
  const secaoInternaHeaders = document.querySelectorAll(
    ".secao-interna-template-header"
  );
  const areaInternaHeaders = document.querySelectorAll(
    ".area-interna-containerContent-template-header"
  );
  const modalMaisAppsContent = document.querySelectorAll(
    ".modal-mais-apps-content"
  );
  const modalMenuList = document.querySelectorAll(".modalMenu-list");

  // Novas seleções adicionadas
  const headerGcElements = document.querySelectorAll(".header-gc");
  const headerOrganogramaElements = document.querySelectorAll(
    ".header-organograma"
  );
  const tarefaMediumCardDescElements = document.querySelectorAll(
    ".tarefa-medium-card-desc"
  );

  // Seleções para as novas classes
  const headerDashboardElements =
    document.querySelectorAll(".header-dashboard");
  const headerMapasElements = document.querySelectorAll(".header-mapas");
  const headerFinanceiroElements =
    document.querySelectorAll(".header-financeiro");

  // Função para carregar o tema do localStorage
  function loadTheme() {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      applyTheme(localTheme);
    } else {
      // Se não houver tema definido, aplica o tema padrão (dark mode)
      applyTheme("");
      localStorage.setItem("theme", "");
    }
  }

  // Função para aplicar o tema
  function applyTheme(theme) {
    if (theme === "light-mode") {
      document.documentElement.classList.add("light-mode");
      if (headerElement) headerElement.classList.add("invert-filter");

      secaoInternaHeaders.forEach((header) => {
        header.classList.add("invert-filter");
      });
      areaInternaHeaders.forEach((header) => {
        header.classList.add("invert-filter");
      });
      modalMaisAppsContent.forEach((element) => {
        element.classList.add("invert-filter");
      });
      modalMenuList.forEach((element) => {
        element.classList.add("invert-filter");
      });

      headerGcElements.forEach((element) => {
        element.classList.add("invert-filter");
      });
      headerOrganogramaElements.forEach((element) => {
        element.classList.add("invert-filter");
      });
      tarefaMediumCardDescElements.forEach((element) => {
        element.classList.add("invert-filter");
      });

      headerDashboardElements.forEach((element) => {
        element.classList.add("invert-filter");
      });
      headerMapasElements.forEach((element) => {
        element.classList.add("invert-filter");
      });
      headerFinanceiroElements.forEach((element) => {
        element.classList.add("invert-filter");
      });
    } else {
      document.documentElement.classList.remove("light-mode");
      if (headerElement) headerElement.classList.remove("invert-filter");

      secaoInternaHeaders.forEach((header) => {
        header.classList.remove("invert-filter");
      });
      areaInternaHeaders.forEach((header) => {
        header.classList.remove("invert-filter");
      });
      modalMaisAppsContent.forEach((element) => {
        element.classList.remove("invert-filter");
      });
      modalMenuList.forEach((element) => {
        element.classList.remove("invert-filter");
      });

      headerGcElements.forEach((element) => {
        element.classList.remove("invert-filter");
      });
      headerOrganogramaElements.forEach((element) => {
        element.classList.remove("invert-filter");
      });
      tarefaMediumCardDescElements.forEach((element) => {
        element.classList.remove("invert-filter");
      });

      headerDashboardElements.forEach((element) => {
        element.classList.remove("invert-filter");
      });
      headerMapasElements.forEach((element) => {
        element.classList.remove("invert-filter");
      });
      headerFinanceiroElements.forEach((element) => {
        element.classList.remove("invert-filter");
      });
    }

    // Disparar o evento 'themeChanged' para atualizar os gráficos
    const themeChangeEvent = new Event("themeChanged");
    document.dispatchEvent(themeChangeEvent);

    updateButtonContent(theme);
  }

  // Função para atualizar o conteúdo do botão
  function updateButtonContent(theme) {
    if (!themeIcon) return; // Se themeIcon não existir, sai da função

    themeIcon.classList.add("rotating");
    setTimeout(() => {
      themeIcon.classList.remove("rotating");
      if (theme === "light-mode") {
        themeIcon.src = "./static/imagens/icones/moon.svg";
        themeIcon.alt = "Ícone de Lua";
      } else {
        themeIcon.src = "./static/imagens/icones/sun.svg";
        themeIcon.alt = "Ícone de Sol";
      }
    }, 150);
  }

  // Carrega o tema ao carregar a página
  loadTheme();

  function toggleTheme() {
    const isLightMode = document.documentElement.classList.toggle("light-mode");
    const currentTheme = isLightMode ? "light-mode" : "";
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
  }

  // Adiciona os event listeners somente se os elementos existirem
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }
  if (themeIcon) {
    themeIcon.addEventListener("click", toggleTheme);
  }
  if (alterarTema) {
    alterarTema.addEventListener("click", (event) => {
      if (event.target !== themeToggleButton && event.target !== themeIcon) {
        toggleTheme();
      }
    });
  }
});
