function toggleOcultarExibir() {
  // Seleciona o primeiro elemento HTML com a classe .area-template-fil-content
  var areaContent = document.querySelector(".area-template-fil-content");

  // Seleciona o botão com a classe .btn-recuar-expandir
  var button = document.querySelector(".btn-recuar-expandir");

  // Verifica se o elemento tem um valor definido para a propriedade maxHeight de seu estilo
  if (areaContent.style.maxHeight) {
    // Se maxHeight estiver definido, redefine para null, removendo a restrição de altura máxima
    areaContent.style.maxHeight = null;

    // Altera o conteúdo do botão para "Exibir pesquisa rápida"
    button.innerHTML = "Exibir pesquisa rápida";
  } else {
    // Se maxHeight não estiver definido, define maxHeight para a altura atual do conteúdo do elemento
    areaContent.style.maxHeight = areaContent.scrollHeight + "px";

    // Altera o conteúdo do botão para "Ocultar pesquisa rápida"
    button.innerHTML = "Ocultar pesquisa rápida";
  }
  // Faz a janela do navegador rolar para o topo
  window.scrollTo(0, 0);
}
