class ModalBtnFloating {
  constructor() {
    this.botao = document.querySelector(".floatingButton");
    this.modal = document.querySelector(".modal-btn-floating-Overlay");
    this.init();
  }

  abrirModalBtnFloating() {
    this.modal.style.display = "flex";
    this.botao.innerHTML = "&times;"; // Altera o conteúdo do botão para "×"
  }

  fecharModalBtnFloating() {
    this.modal.style.display = "none";
    this.botao.textContent = "+"; // Altera o conteúdo do botão para "+"
  }

  init() {
    this.botao.addEventListener("click", (event) => {
      event.stopPropagation(); // Impede que o evento se propague para o window
      if (
        this.modal.style.display === "none" ||
        this.modal.style.display === ""
      ) {
        this.abrirModalBtnFloating();
      } else {
        this.fecharModalBtnFloating();
      }
    });

    window.addEventListener("click", (event) => {
      // Verifica se o evento de clique não foi originado no botão antes de fechar o modal
      if (event.target !== this.botao) {
        this.fecharModalBtnFloating();
      }
    });
  }
}

new ModalBtnFloating();
