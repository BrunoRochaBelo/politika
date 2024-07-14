document.addEventListener("DOMContentLoaded", function () {
  const contentArea = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaSelect = document.querySelector(".lista-select.nav-calendar");
  let item1 = document.querySelector(".item1");
  let item2 = document.querySelector(".item2");

  const item1Original = item1.cloneNode(true);
  const item2Original = item2.cloneNode(true);

  contentArea.addEventListener("scroll", function () {
    const scrollTop = contentArea.scrollTop;

    if (scrollTop > 0) {
      listaSelect.classList.remove("visible-gap");
      listaSelect.classList.add("hidden-gap");

      if (item1) {
        item1.classList.remove("visible");
        item1.classList.add("hidden");
        item1.addEventListener("transitionend", function removeItem1() {
          if (item1 && item1.parentElement) {
            item1.parentElement.removeChild(item1);
            item1 = null;
          }
          item1.removeEventListener("transitionend", removeItem1);
        });
      }

      if (item2) {
        item2.classList.remove("visible");
        item2.classList.add("hidden");
        item2.addEventListener("transitionend", function removeItem2() {
          if (item2 && item2.parentElement) {
            item2.parentElement.removeChild(item2);
            item2 = null;
          }
          item2.removeEventListener("transitionend", removeItem2);
        });
      }
    } else {
      listaSelect.classList.remove("hidden-gap");
      listaSelect.classList.add("visible-gap");

      if (!item1) {
        const newItem1 = item1Original.cloneNode(true);
        newItem1.classList.add("hidden");
        listaSelect.insertBefore(newItem1, listaSelect.firstChild);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            newItem1.classList.remove("hidden");
            newItem1.classList.add("visible");
          });
        });
        item1 = newItem1;
      }

      if (!item2) {
        const newItem2 = item2Original.cloneNode(true);
        newItem2.classList.add("hidden");
        listaSelect.insertBefore(newItem2, document.querySelector(".item3"));
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            newItem2.classList.remove("hidden");
            newItem2.classList.add("visible");
          });
        });
        item2 = newItem2;
      }
    }
  });
});
