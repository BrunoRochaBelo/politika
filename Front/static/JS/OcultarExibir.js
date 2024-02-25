// Função para alternar a visibilidade de um elemento HTML
function toggleOcultarExibir() {
  // Seleciona o primeiro elemento HTML com a classe .area-template-fil-content
  var areaContent = document.querySelector(".area-template-fil-content");

  // Verifica se o elemento tem um valor definido para a propriedade maxHeight de seu estilo
  if (areaContent.style.maxHeight) {
    // Se maxHeight estiver definido, redefine para null, removendo a restrição de altura máxima
    areaContent.style.maxHeight = null;
  } else {
    // Se maxHeight não estiver definido, define maxHeight para a altura atual do conteúdo do elemento
    areaContent.style.maxHeight = areaContent.scrollHeight + "px";
  }
  // Faz a janela do navegador rolar para o topo
  window.scrollTo(0, 0);
}
