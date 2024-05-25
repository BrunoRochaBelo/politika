//Script para Remover itens ao rolar

document.addEventListener("DOMContentLoaded", function () {
  const contentArea = document.querySelector(".area-template-cbf-content");
  const listaSelect = document.querySelector(".lista-select.nav-calendar");
  let item1 = document.querySelector(".item1");
  let item2 = document.querySelector(".item2");

  // Clonar os elementos originais
  const item1Original = item1.cloneNode(true);
  const item2Original = item2.cloneNode(true);

  contentArea.addEventListener("scroll", function () {
    if (contentArea.scrollTop > 0) {
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

      listaSelect.style.paddingTop = "0px";
      listaSelect.style.gap = "0";
    } else {
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

      listaSelect.style.padding = "5px";
      listaSelect.style.gap = "12px";
    }
  });
});
