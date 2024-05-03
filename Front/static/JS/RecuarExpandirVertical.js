function toggleRecuarExpandirVertical() {
  // Obtenha o elemento
  var element = document.querySelector(".area-template-fil-alt-content");

  // Seleciona o botão pelo ID
  var button = document.querySelector("#RecuarExpandirVertical");

  // Verifique se a largura da tela é menor ou igual a 768px
  var mediaQuery = window.matchMedia("(max-width: 768px)");

  // Adicione um ouvinte de evento de mudança de mídia
  mediaQuery.addListener(function (e) {
    if (!e.matches) {
      // Se a largura da tela for maior que 768px, recarregue a página
      location.reload();
    }
  });

  if (mediaQuery.matches) {
    // Obtenha a altura atual do elemento
    var currentHeight = window.getComputedStyle(element).height;

    // Altere a altura do elemento
    if (currentHeight === "130px") {
      element.style.height = "auto";

      // Altera o conteúdo do botão para "Recuar"
      button.innerHTML = "Recuar";
    } else {
      element.style.height = "130px";

      // Altera o conteúdo do botão para "Expandir"
      button.innerHTML = "Expandir";
    }
  } else {
    // Se a largura da tela for maior que 768px, defina a altura como auto
    element.style.height = "auto";
  }
}
