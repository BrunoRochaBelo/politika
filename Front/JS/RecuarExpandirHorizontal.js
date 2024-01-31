var tamanhoTelaAnterior = 0; // Armazena o tamanho da tela anterior
var larguraReal = window.screen.width;
/*var larguraElemento = document.getElementById("eventos-sidenav").offsetWidth; // Largura real do elemento com o ID "eventos-sidenav"*/

function toggleRecuarExpandirHorizontal() {
  // Seleciona o elemento marcador-recuar-expandir
  var RecuarExpandirHorizontal = document.querySelector(
    ".recuar-expandir-horizontal"
  );
  // Verifica se a classe "recuar" está presente no elemento antes de realizar a ação de toggle
  var recuarAtualmente = RecuarExpandirHorizontal.classList.contains("recuar");
  // Adiciona ou remove a classe "recuar" no elemento
  RecuarExpandirHorizontal.classList.toggle("recuar");
  // Seleciona a lista de marcadores
  var listaMarcadores = document.querySelector(".lista-vertical-2-template");
  // Verifica se a classe "recuar-expandir-horizontal.recuar" está presente no elemento
  if (
    RecuarExpandirHorizontal.classList.contains(
      "recuar-expandir-horizontal.recuar"
    )
  ) {
    // Muda a classe da lista para horizontal
    listaMarcadores.classList.replace(
      "lista-vertical-2-template",
      "lista-horizontal-template"
    );
  } else {
    // Muda a classe da lista para vertical
    listaMarcadores.classList.replace(
      "lista-horizontal-template",
      "lista-vertical-2-template"
    );
  }
  // Remove explicitamente as classes "recuar" e "lista-horizontal-template" caso estejam presentes
  if (!RecuarExpandirHorizontal.classList.contains("recuar")) {
    listaMarcadores.classList.remove("lista-horizontal-template");
    listaMarcadores.classList.add("lista-vertical-2-template");
    // Se a classe "recuar" foi removida, remova o max-width
    if (recuarAtualmente) {
      var elementosRecuar = document.querySelectorAll(
        ".recuar-expandir-horizontal.recuar"
      );
      elementosRecuar.forEach(function (elemento) {
        elemento.style.maxWidth = "none";
      });
      ajustarMaxWidth();
    }
  }
}

function ajustarMaxWidth() {
  var elementosRecuar = document.querySelectorAll(".area-template-content");
  elementosRecuar.forEach(function (elemento) {
    var larguraElementoAtual =
      document.getElementById("eventos-sidenav").offsetWidth;
    // Verifica se a largura do elemento mudou desde o último carregamento
    if (larguraElementoAtual !== tamanhoTelaAnterior) {
      tamanhoTelaAnterior = larguraElementoAtual;
      var maxWidth = larguraElementoAtual - 0; // Subtrai 20 pixels
      elemento.style.maxWidth = maxWidth + "px";
    }
  });
}

// Chama ajustarMaxWidth() quando a página é carregada
window.addEventListener("load", ajustarMaxWidth);
// Adiciona um ouvinte de evento para o redimensionamento da tela
window.addEventListener("resize", function () {
  ajustarMaxWidth();
});
