// Adiciona um ouvinte de evento para o carregamento do documento
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona elementos específicos do DOM
  let headerTemplate = document.querySelector(".header-template");
  let headerSearch = document.querySelector(".search-input");
  let headerSearchElement = document.querySelector(".header-search");
  let headerButton = document.querySelector(".search-button"); // Adicionado

  // Função para alternar a sombra e a cor do texto de um elemento
  function toggleBoxShadow(headerElement, shadowClass, textColorVar) {
    // Obtém a posição de rolagem atual
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Se a posição de rolagem for maior que 15
    if (headerElement && scrollTop > 15) {
      // Adiciona a classe de sombra ao elemento
      headerElement.classList.add(shadowClass);
      // Altera a transição e a cor do elemento de pesquisa
      headerSearchElement.style.transition = "color 0.3s ease";
      headerSearchElement.style.color = textColorVar;
      // Adiciona o z-index ao elemento
      headerElement.style.zIndex = "1005";
    } else if (headerElement) {
      // Remove a classe de sombra do elemento
      headerElement.classList.remove(shadowClass);
      // Altera a transição e a cor do elemento de pesquisa
      headerSearchElement.style.transition = "color 0.3s ease";
      headerSearchElement.style.color = textColorVar;
      // Remove o z-index do elemento
      headerElement.style.zIndex = "";
    }
  }

  // Chama a função toggleBoxShadow no carregamento inicial da página para cada elemento
  toggleBoxShadow(
    headerTemplate,
    "box-shadow-active",
    "var(--fundo-container)"
  );
  toggleBoxShadow(headerSearch, "scroll-active", "var(--fundo-container)");
  toggleBoxShadow(headerButton, "scroll-active", "var(--fundo-container)"); // Adicionado

  // Adiciona um ouvinte de evento para a rolagem da janela
  window.addEventListener("scroll", function () {
    // Chama a função toggleBoxShadow quando a janela é rolada
    toggleBoxShadow(
      headerTemplate,
      "box-shadow-active",
      "var(--fundo-container)"
    );
    toggleBoxShadow(headerSearch, "scroll-active", "var(--fundo-container)");
    toggleBoxShadow(headerButton, "scroll-active", "var(--fundo-container)"); // Adicionado
  });
});

// Adiciona um ouvinte de evento para o carregamento do documento
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona elementos específicos do DOM
  let homeHeaderTemplate = document.querySelector(".home-header-template");
  let homeHeaderTitle = document.querySelector(".home-header-title");

  // Função para alternar a sombra e a cor do texto de um elemento
  function toggleBoxShadow() {
    // Obtém a posição de rolagem atual
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Se a posição de rolagem for maior que 0
    if (homeHeaderTemplate && homeHeaderTitle && scrollTop > 15) {
      // Adiciona a classe de sombra ao elemento
      homeHeaderTemplate.classList.add("box-shadow-active");
      // Altera a transição e a cor do título
      homeHeaderTitle.style.transition = "color 0.3s ease";
      homeHeaderTitle.style.color = "var(--cor-s1)";
      // Adiciona o z-index ao elemento
      homeHeaderTemplate.style.zIndex = "1005";
    } else if (homeHeaderTemplate && homeHeaderTitle) {
      // Remove a classe de sombra do elemento
      homeHeaderTemplate.classList.remove("box-shadow-active");
      // Altera a transição e a cor do título
      homeHeaderTitle.style.transition = "color 0.3s ease";
      homeHeaderTitle.style.color = "var(--cor-s1)";
      // Remove o z-index do elemento
      homeHeaderTemplate.style.zIndex = "";
    }
  }

  // Chama a função toggleBoxShadow no carregamento inicial da página
  toggleBoxShadow();

  // Adiciona um ouvinte de evento para a rolagem da janela
  window.addEventListener("scroll", function () {
    // Chama a função toggleBoxShadow quando a janela é rolada
    toggleBoxShadow();
  });
});
