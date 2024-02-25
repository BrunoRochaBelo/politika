function toggleRecuarExpandirVertical() {
  // Obtenha o elemento
  var element = document.querySelector(".area-template-tmf-alt-content");

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
    if (currentHeight === "100px") {
      element.style.height = "auto";
    } else {
      element.style.height = "100px";
    }
  } else {
    // Se a largura da tela for maior que 768px, defina a altura como auto
    element.style.height = "auto";
  }
}
