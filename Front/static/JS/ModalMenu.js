function toggleMenu(x) {
  x.classList.toggle("change");
  const modal = document.getElementById("modalMenu");
  modal.classList.toggle("show");
  if (modal.classList.contains("show")) {
    document.addEventListener("click", outsideClickListener);
  } else {
    document.removeEventListener("click", outsideClickListener);
  }
}

// Função para ocultar o modal
function hideModal() {
  const modal = document.getElementById("modalMenu");
  const headerMenu = document.querySelector(".header-menu");
  modal.classList.remove("show");
  headerMenu.classList.remove("change");
  document.removeEventListener("click", outsideClickListener);
}

// Função para o logout
function logout() {
  // Adicione aqui o código real para efetuar o logout
  alert("Logout realizado com sucesso!");
  window.location.href = "./login.html";
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
