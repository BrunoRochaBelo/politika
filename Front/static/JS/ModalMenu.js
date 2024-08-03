function toggleMenu(x) {
  x.classList.toggle("change");
  const modal = document.getElementById("modalMenu");
  const modalContent = document.querySelector(".modal-content-template");

  if (modal.classList.contains("show")) {
    modalContent.classList.remove("show");
    modalContent.classList.add("hide");
    modalContent.addEventListener(
      "animationend",
      () => {
        modal.classList.remove("show");
        modalContent.classList.remove("hide");
        modal.style.display = "none";
      },
      { once: true }
    );
    document.removeEventListener("click", outsideClickListener);
  } else {
    modal.style.display = "flex";
    modal.classList.add("show");
    modalContent.classList.add("show");
    document.addEventListener("click", outsideClickListener);
  }
}

// Função para ocultar o modal
function hideModal() {
  const modal = document.getElementById("modalMenu");
  const modalContent = document.querySelector(".modal-content-template");
  const headerMenu = document.querySelector(".header-menu");

  modalContent.classList.remove("show");
  modalContent.classList.add("hide");
  modalContent.addEventListener(
    "animationend",
    () => {
      modal.classList.remove("show");
      modalContent.classList.remove("hide");
      modal.style.display = "none";
    },
    { once: true }
  );
  headerMenu.classList.remove("change");
  document.removeEventListener("click", outsideClickListener);
}

// Função para fechar o modal ao clicar fora do modal-content
function outsideClickListener(event) {
  const modal = document.getElementById("modalMenu");
  const modalContent = document.querySelector(".modal-content-template");
  if (
    !modalContent.contains(event.target) &&
    !event.target.closest(".header-menu")
  ) {
    hideModal();
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  const modalContent = document.querySelector(".modal-content-template");
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});
