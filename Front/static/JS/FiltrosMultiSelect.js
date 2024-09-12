document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".filtro-multi-select-card-header");

  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const card = header.parentElement;
      const content = card.querySelector(".filtro-multi-select-card-content");
      const arrow = header.querySelector(".arrow");

      if (content.classList.contains("exibirMultiSelect")) {
        // Esconde o conteúdo e reseta o estado visual
        content.classList.remove("exibirMultiSelect");
        card.classList.remove("filtro-multi-select-card-expanded");
        header.classList.remove("exibirMultiSelect");
        arrow.classList.remove("up");
        arrow.classList.add("down");
      } else {
        // Mostra o conteúdo e aplica os novos estilos
        content.classList.add("exibirMultiSelect");
        card.classList.add("filtro-multi-select-card-expanded");
        header.classList.add("exibirMultiSelect");
        arrow.classList.remove("down");
        arrow.classList.add("up");
      }
    });
  });
});
