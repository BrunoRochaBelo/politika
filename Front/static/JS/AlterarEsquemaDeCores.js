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

  // Função para carregar o tema do localStorage ou do servidor
  function loadTheme() {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      applyTheme(localTheme);
    } else {
      fetch("/get_user_theme")
        .then((response) => response.json())
        .then((data) => {
          const currentTheme = data.theme || "";
          applyTheme(currentTheme);
          localStorage.setItem("theme", currentTheme);
        })
        .catch(() => {
          if (localTheme) {
            applyTheme(localTheme);
          }
        });
    }
  }

  // Função para aplicar o tema
  function applyTheme(theme) {
    if (theme === "light-mode") {
      document.documentElement.classList.add("light-mode");
      headerElement && headerElement.classList.add("invert-filter");

      // Adiciona a classe 'invert-filter' aos elementos necessários
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
    } else {
      document.documentElement.classList.remove("light-mode");
      headerElement && headerElement.classList.remove("invert-filter");

      // Remove a classe 'invert-filter' dos elementos necessários
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
    }
    updateButtonContent(theme);
  }

  // Função para atualizar o conteúdo do botão
  function updateButtonContent(theme) {
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

    // Envia a nova preferência do tema para o back-end
    fetch("/update_theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme: currentTheme }),
    }).catch(() => {
      console.error("Falha ao salvar a preferência do tema no servidor.");
    });
  }

  themeToggleButton.addEventListener("click", toggleTheme);
  themeIcon.addEventListener("click", toggleTheme);
  alterarTema.addEventListener("click", (event) => {
    if (event.target !== themeToggleButton && event.target !== themeIcon) {
      toggleTheme();
    }
  });
});
