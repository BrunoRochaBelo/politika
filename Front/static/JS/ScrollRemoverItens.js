document.addEventListener("DOMContentLoaded", function () {
  const contentArea = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaSelect = document.querySelector(".lista-select.nav-calendar");
  let item1 = document.querySelector(".item1");
  let item2 = document.querySelector(".item2");

  // Clonar os elementos originais
  const item1Original = item1.cloneNode(true);
  const item2Original = item2.cloneNode(true);

  // Função para ajustar o max-height com base na presença de itens e no modo responsivo
  function adjustMaxHeight() {
    if (window.innerWidth <= 900) {
      // Modo responsivo
      if (item1 || item2) {
        contentArea.style.maxHeight = "68vh"; // Quando os itens estão presentes
      } else {
        contentArea.style.maxHeight = "69vh"; // Quando os itens foram removidos
      }
    } else {
      // Não modo responsivo
      if (item1 || item2) {
        contentArea.style.maxHeight = "69vh"; // Quando os itens estão presentes
      } else {
        contentArea.style.maxHeight = "71vh"; // Quando os itens foram removidos
      }
    }
  }

  // Ajusta o max-height inicialmente
  adjustMaxHeight();

  contentArea.addEventListener("scroll", function () {
    if (contentArea.scrollTop > 0) {
      // Verifica se os itens estão presentes e remove-os
      if (item1) {
        item1.classList.add("fade-out");
        item1.addEventListener(
          "animationend",
          () => {
            if (item1) {
              item1.remove();
              item1 = null;
            }
          },
          { once: true }
        );
      }

      if (item2) {
        item2.classList.add("fade-out");
        item2.addEventListener(
          "animationend",
          () => {
            if (item2) {
              item2.remove();
              item2 = null;
            }
          },
          { once: true }
        );
      }

      // Aplica estilos quando os itens são removidos
      listaSelect.style.paddingTop = "0px";
      listaSelect.style.gap = "0";
    } else {
      // Verifica se os itens não estão presentes e adiciona-os de volta
      if (!item1) {
        const newItem1 = item1Original.cloneNode(true);
        newItem1.classList.add("fade-in");
        listaSelect.insertBefore(newItem1, listaSelect.firstChild);
        item1 = newItem1;
      }

      if (!item2) {
        const newItem2 = item2Original.cloneNode(true);
        newItem2.classList.add("fade-in");
        listaSelect.insertBefore(newItem2, document.querySelector(".item3"));
        item2 = newItem2;
      }

      // Aplica estilos quando os itens são adicionados de volta
      listaSelect.style.padding = "5px";
      listaSelect.style.gap = "12px";
    }
  });

  // Ajusta o max-height quando a janela é redimensionada
  window.addEventListener("resize", adjustMaxHeight);
});
