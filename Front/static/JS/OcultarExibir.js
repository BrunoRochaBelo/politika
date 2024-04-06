// Função para selecionar elementos pelo seletor
function selectElement(selector) {
  return document.querySelector(selector);
}

// Função para criar o overlay
function createOverlay() {
  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 1000;
  overlay.style.display = "none";
  document.body.appendChild(overlay);

  // Adiciona um evento de clique ao overlay
  overlay.addEventListener("click", function () {
    var areaContent = selectElement(".area-template-fil-content");
    var area = selectElement(".area-template-fil");
    var button = selectElement(".btn-recuar-expandir");
    var mainSidenav = selectElement(".main-sidenav");
    var areaHeader = selectElement(".area-template-fil-header");

    // Chama a função toggleVisibility para fechar o overlay
    toggleVisibility(areaContent, button, area, mainSidenav, areaHeader);
  });

  return overlay;
}

var overlay = createOverlay();

// Função para alternar a visibilidade do conteúdo
function toggleVisibility(areaContent, button, area, mainSidenav, areaHeader) {
  if (window.innerWidth <= 820) {
    if (areaContent.style.maxHeight) {
      areaContent.style.maxHeight = null;
      button.innerHTML = "Filtros";
      area.style.boxShadow = "none";
      mainSidenav.style.height = "";
      area.style.background = "none";
      overlay.style.display = "none";

      // Define as propriedades para quando a área não está exibida
      areaHeader.style.color = "transparent";
      areaHeader.style.fontSize = "0px";

      // Adiciona a classe para mostrar o pseudo-elemento ::after
      button.classList.add("show-after");
      button.classList.remove("hide-after");
    } else {
      areaContent.style.maxHeight = areaContent.scrollHeight + "px";
      button.innerHTML = "X";
      button.style.color = "var(--cor-p3)";
      mainSidenav.style.height = "auto";
      area.style.background = "#513598";
      overlay.style.display = "block";

      // Define as propriedades para quando a área está exibida
      areaHeader.style.color = "var(--cor-p3)";
      areaHeader.style.fontSize = "var(--titulo-xl)";

      // Adiciona a classe para ocultar o pseudo-elemento ::after
      button.classList.add("hide-after");
      button.classList.remove("show-after");
    }
  }
}

// Adiciona um ouvinte de evento 'resize' à janela
window.addEventListener("resize", function () {
  if (window.innerWidth > 820) {
    // Recarrega a página para garantir que tudo volte ao padrão
    window.location.reload();
  }
});

function toggleOcultarExibir() {
  var areaContent = selectElement(".area-template-fil-content");
  var area = selectElement(".area-template-fil");
  var button = selectElement(".btn-recuar-expandir");
  var mainSidenav = selectElement(".main-sidenav");
  var areaHeader = selectElement(".area-template-fil-header"); // Seleciona o elemento .area-template-fil-header

  toggleVisibility(areaContent, button, area, mainSidenav, areaHeader);

  window.scrollTo(0, 0);
}
