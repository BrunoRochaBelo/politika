document.addEventListener("DOMContentLoaded", function () {
  const contentArea = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaSelect = document.querySelector(".lista-select.nav-calendar");
  let item1 = document.querySelector(".item1");
  let item2 = document.querySelector(".item2");

  // Verifica se os itens existem antes de cloná-los
  const item1Original = item1 ? item1.cloneNode(true) : null;
  const item2Original = item2 ? item2.cloneNode(true) : null;

  function handleTransitionEnd(event) {
    if (
      event.propertyName === "opacity" &&
      event.target.classList.contains("hidden")
    ) {
      event.target.removeEventListener("transitionend", handleTransitionEnd);
      event.target.parentElement.removeChild(event.target);
      if (event.target.classList.contains("item1")) {
        item1 = null;
      } else if (event.target.classList.contains("item2")) {
        item2 = null;
      }
    }
  }

  function hideItem(item) {
    if (item) {
      item.classList.remove("visible");
      item.classList.add("hidden");
      item.addEventListener("transitionend", handleTransitionEnd);
    }
  }

  function showItem(itemOriginal, insertBeforeElement) {
    if (!itemOriginal) return null;

    const newItem = itemOriginal.cloneNode(true);
    newItem.classList.add("hidden");
    listaSelect.insertBefore(newItem, insertBeforeElement);

    // Reintroduzindo o duplo requestAnimationFrame para garantir a transição
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newItem.classList.remove("hidden");
        newItem.classList.add("visible");
      });
    });

    return newItem;
  }

  function handleScroll() {
    const scrollTop = contentArea.scrollTop;

    if (scrollTop > 0) {
      listaSelect.classList.remove("visible-gap");
      listaSelect.classList.add("hidden-gap");

      hideItem(item1);
      hideItem(item2);
    } else {
      listaSelect.classList.remove("hidden-gap");
      listaSelect.classList.add("visible-gap");

      if (!item1) {
        item1 = showItem(item1Original, listaSelect.firstChild);
      }

      if (!item2) {
        const item3 = document.querySelector(".item3");
        item2 = showItem(item2Original, item3);
      }
    }
  }

  if (contentArea) {
    contentArea.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(handleScroll);
      },
      { passive: true }
    );
  }
});
