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

  // Salvar os estilos originais
  const originalStylesNav = {
    padding: getComputedStyle(listaSelect).padding,
    gap: getComputedStyle(listaSelect).gap,
  };
  const originalStylesItem1 = {
    opacity: getComputedStyle(item1).opacity,
    transform: getComputedStyle(item1).transform,
    padding: getComputedStyle(item1).padding,
  };
  const originalStylesItem2 = {
    opacity: getComputedStyle(item2).opacity,
    transform: getComputedStyle(item2).transform,
    padding: getComputedStyle(item2).padding,
  };

  contentArea.addEventListener("scroll", function () {
    const scrollTop = contentArea.scrollTop;
    const maxScroll = 0;

    // Calcula a opacidade baseada na rolagem
    const opacity = Math.max(0, Math.min(1, 1 - scrollTop / maxScroll));
    const scale = Math.max(0.5, Math.min(1, 1 - scrollTop / (maxScroll * 2)));
    const paddingValue = `${Math.max(0, 12 - (scrollTop / maxScroll) * 12)}px`;

    if (scrollTop > 0) {
      // Atualizar estilos da nav-calendar
      listaSelect.style.padding = "0";
      listaSelect.style.gap = "0";

      if (item1) {
        item1.style.opacity = opacity;
        item1.style.transform = `scale(${scale})`;
        item1.style.padding = paddingValue;
        if (opacity === 0 && item1.parentElement) {
          item1.parentElement.removeChild(item1);
          item1 = null;
        }
      }
      if (item2) {
        item2.style.opacity = opacity;
        item2.style.transform = `scale(${scale})`;
        item2.style.padding = paddingValue;
        if (opacity === 0 && item2.parentElement) {
          item2.parentElement.removeChild(item2);
          item2 = null;
        }
      }
    } else {
      // Restaurar estilos da nav-calendar quando o scroll for zerado
      listaSelect.style.padding = originalStylesNav.padding;
      listaSelect.style.gap = originalStylesNav.gap;

      // Restaurar estilos originais quando o scroll for zerado
      if (!item1) {
        const newItem1 = item1Original.cloneNode(true);
        Object.assign(newItem1.style, originalStylesItem1);
        listaSelect.insertBefore(newItem1, listaSelect.firstChild);
        setTimeout(() => {
          newItem1.style.opacity = originalStylesItem1.opacity;
          newItem1.style.transform = originalStylesItem1.transform;
          newItem1.style.padding = originalStylesItem1.padding;
        }, 10);
        item1 = newItem1;
      }

      if (!item2) {
        const newItem2 = item2Original.cloneNode(true);
        Object.assign(newItem2.style, originalStylesItem2);
        listaSelect.insertBefore(newItem2, document.querySelector(".item3"));
        setTimeout(() => {
          newItem2.style.opacity = originalStylesItem2.opacity;
          newItem2.style.transform = originalStylesItem2.transform;
          newItem2.style.padding = originalStylesItem2.padding;
        }, 10);
        item2 = newItem2;
      }
    }
  });
});
