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
  overlay.style.backgroundColor = "var(--bg-overlay)";
  overlay.style.zIndex = 2003;
  overlay.style.display = "none";
  document.body.appendChild(overlay);

  // Adiciona um evento de clique ao overlay
  overlay.addEventListener("click", function () {
    var areaContent = selectElement(
      ".container-compromisso-hoje-template-content"
    );
    var area = selectElement(".container-compromisso-hoje-template");
    var button = selectElement(".btn-suaAgenda");
    var mainSidenav = selectElement(".main-sidenav");
    var areaHeader = selectElement(
      ".container-compromisso-hoje-template-header"
    );

    // Chama a função toggleVisibility para fechar o overlay
    toggleVisibility(areaContent, button, area, mainSidenav, areaHeader);
  });

  return overlay;
}

var overlay = createOverlay();

// Função para alternar a visibilidade do conteúdo
function toggleVisibility(areaContent, button, area, mainSidenav, areaHeader) {
  if (window.innerWidth <= 900) {
    // Se a área já está exibida, fecha-a
    if (areaContent.style.maxHeight) {
      areaContent.style.maxHeight = null;
      areaContent.style.display = "none"; // Define display none ao fechar
      // Restaura o texto original do botão
      button.innerHTML = "Agenda para hoje";
      mainSidenav.style.boxShadow = "none";
      mainSidenav.style.height = "";
      area.style.background = "none";
      overlay.style.display = "none";

      // Define as propriedades para quando a área não está exibida
      areaHeader.style.color = "transparent";
      areaHeader.style.fontSize = "0px";
      areaHeader.style.padding = "5px 5px 5px 10px";

      // Adiciona a classe para mostrar o pseudo-elemento ::after
      button.classList.add("show-after");
      button.classList.remove("hide-after");
    } else {
      // Se a área não está exibida, abre-a
      areaContent.style.maxHeight = `calc(var(--vh, 1vh) * 100 - 8.5rem)`;
      areaContent.style.display = "block"; // Define display block ao expandir
      button.innerHTML = "X";
      button.style.color = "var(--btn-filtro-alt-txt)";
      mainSidenav.style.height = "auto";
      mainSidenav.style.boxShadow = "var(--sombra-intensa)";
      area.style.background = "var(--modal-bg)";
      overlay.style.display = "block";

      // Define as propriedades para quando a área está exibida
      areaHeader.style.color = "var(--txt-titulo)";
      areaHeader.style.fontSize = "var(--font-xl)";
      areaHeader.style.padding = "10px 10px 10px 20px";

      // Adiciona a classe para ocultar o pseudo-elemento ::after
      button.classList.add("hide-after");
      button.classList.remove("show-after");
    }
  }
}

// Adiciona um ouvinte de evento 'resize' à janela
window.addEventListener("resize", function () {
  if (window.innerWidth > 900) {
    // Recarrega a página para garantir que tudo volte ao padrão
    window.location.reload();
  }
});

// Função para alternar a exibição da agenda
function OcultarExibirAgenda() {
  var areaContent = selectElement(
    ".container-compromisso-hoje-template-content"
  );
  var area = selectElement(".container-compromisso-hoje-template");
  var button = selectElement(".btn-suaAgenda");
  var mainSidenav = selectElement(".main-sidenav");
  var areaHeader = selectElement(".container-compromisso-hoje-template-header");

  toggleVisibility(areaContent, button, area, mainSidenav, areaHeader);

  window.scrollTo(0, 0);
}
