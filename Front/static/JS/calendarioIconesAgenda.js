document.addEventListener("DOMContentLoaded", function () {
  // Função para disparar a animação: remove a classe, força o reflow e readiciona a classe
  function triggerAnimation(header) {
    const img = header.querySelector(".agenda-icon img");
    if (img) {
      img.classList.remove("animate");
      void img.offsetWidth; // Força reflow para "resetar" a animação
      img.classList.add("animate");
    }
  }

  // Função para remover a animação, se necessário
  function removeAnimation(header) {
    const img = header.querySelector(".agenda-icon img");
    if (img) {
      img.classList.remove("animate");
    }
  }

  // Adiciona um listener de clique de forma delegada no documento
  document.addEventListener("click", function (e) {
    // Procura um ancestral que seja o header da agenda
    const header = e.target.closest(
      ".area-agenda .secao-interna-template-header"
    );
    if (header) {
      // Aguarda um tick para que o changeSession (chamado inline) já tenha alterado as classes
      setTimeout(() => {
        if (header.classList.contains("active-header")) {
          triggerAnimation(header);
        } else {
          removeAnimation(header);
        }
      }, 0);
    }
  });
});
