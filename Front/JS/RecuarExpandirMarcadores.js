// Armazena o tamanho da tela anterior
var tamanhoTelaAnterior = 0;
var larguraReal = window.screen.width;
// Obter a largura real do elemento com o ID "eventos-sidenav"
var larguraElemento = document.getElementById("eventos-sidenav").offsetWidth;

function toggleRecuarExpandir() {
  // Seleciona o elemento marcador-recuar-expandir
  var marcadorRecuarExpandir = document.querySelector(
    ".marcador-recuara-expandir"
  );

  // Verifica se a classe "recuar" está presente no elemento antes de realizar a ação de toggle
  var recuarAtualmente = marcadorRecuarExpandir.classList.contains("recuar");

  // Adiciona ou remove a classe "recuar" no elemento
  marcadorRecuarExpandir.classList.toggle("recuar");

  // Seleciona a lista de marcadores
  var listaMarcadores = document.querySelector(
    ".lista-marcador-vertical-template"
  );

  // Verifica se a classe "marcador-recuara-expandir.recuar" está presente no elemento
  if (
    marcadorRecuarExpandir.classList.contains(
      "marcador-recuara-expandir.recuar"
    )
  ) {
    // Muda a classe da lista para horizontal
    listaMarcadores.classList.replace(
      "lista-marcador-vertical-template",
      "lista-marcador-horizontal-template"
    );
  } else {
    // Muda a classe da lista para vertical
    listaMarcadores.classList.replace(
      "lista-marcador-horizontal-template",
      "lista-marcador-vertical-template"
    );
  }

  // Remove explicitamente as classes "recuar" e "lista-marcador-horizontal-template" caso estejam presentes
  if (!marcadorRecuarExpandir.classList.contains("recuar")) {
    listaMarcadores.classList.remove("lista-marcador-horizontal-template");
    listaMarcadores.classList.add("lista-marcador-vertical-template");

    // Se a classe "recuar" foi removida, remova o max-width
    if (recuarAtualmente) {
      var elementosRecuar = document.querySelectorAll(
        ".marcador-recuara-expandir.recuar"
      );

      elementosRecuar.forEach(function (elemento) {
        elemento.style.maxWidth = "none";
      });
      ajustarMaxWidth();
    }
  }
}

function ajustarMaxWidth() {
  var elementosRecuar = document.querySelectorAll(
    ".marcadores-template-content"
  );

  elementosRecuar.forEach(function (elemento) {
    var screenWidth = larguraElemento;

    // Verifica se o tamanho da tela mudou desde o último carregamento
    if (screenWidth !== tamanhoTelaAnterior) {
      tamanhoTelaAnterior = screenWidth;

      var maxWidth = screenWidth - 20; // Subtrai 20 pixels

      elemento.style.maxWidth = maxWidth + "px";
    }
  });
}

// Chama ajustarMaxWidth() quando a página é carregada
window.addEventListener("load", ajustarMaxWidth);
