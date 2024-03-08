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

    // Chama a função toggleVisibility para fechar o overlay
    toggleVisibility(areaContent, button, area, mainSidenav);
  });

  return overlay;
}

var overlay = createOverlay();

// Função para alternar a visibilidade do conteúdo
function toggleVisibility(areaContent, button, area, mainSidenav) {
  if (areaContent.style.maxHeight) {
    areaContent.style.maxHeight = null;
    button.innerHTML = "Pesquisa rápida";
    area.style.boxShadow = "none";
    mainSidenav.style.height = "";
    area.style.background = "none";
    overlay.style.display = "none";
  } else {
    areaContent.style.maxHeight = areaContent.scrollHeight + "px";
    button.innerHTML = "X";
    mainSidenav.style.height = "auto";
    area.style.background = "var(--cor-p4)";
    overlay.style.display = "block";
  }
}

function toggleOcultarExibir() {
  var areaContent = selectElement(".area-template-fil-content");
  var area = selectElement(".area-template-fil");
  var button = selectElement(".btn-recuar-expandir");
  var mainSidenav = selectElement(".main-sidenav");

  toggleVisibility(areaContent, button, area, mainSidenav);

  window.scrollTo(0, 0);
}
