function toggleOcultarExibir() {
  // Seleciona o elemento com a classe 'area-template-fil-content'
  var elemento = document.querySelector(".area-template-fil-content");
  var botao = document.querySelector(".btn-recuar-expandir");

  // Verifica se a largura da janela do navegador é menor que 768 pixels
  if (window.matchMedia("(max-width: 768px)").matches) {
    // Verifica se o elemento está sendo exibido ou não
    if (elemento.style.display === "none") {
      // Se o elemento está oculto, remove a propriedade 'display' para retornar ao valor original da classe
      elemento.style.removeProperty("display");
      setTimeout(() => (botao.textContent = "Ocultar pesquisa rápida"), 50);
    } else {
      // Se o elemento está sendo exibido, oculta o elemento e altera o texto do botão para 'Exibir'
      elemento.style.display = "none";
      setTimeout(() => (botao.textContent = "Exibir pesquisa rápida"), 50);
    }
  } else {
    // Se a largura da janela do navegador é maior que 768 pixels, remove a propriedade 'display' para retornar ao valor original da classe
    elemento.style.removeProperty("display");
    setTimeout(() => (botao.textContent = "Ocultar pesquisa rápida"), 50);
  }
}

// Adiciona um ouvinte de evento para a mudança de tamanho da janela
window.addEventListener("resize", toggleOcultarExibir);

// Adiciona um ouvinte de evento para o carregamento da página
window.addEventListener("load", toggleOcultarExibir);
