class ModalBtnFloating {
  constructor() {
    this.botao = document.querySelector(".floatingButton");
    this.modal = document.querySelector(".modal-btn-floating-Overlay");
    this.modalContent = document.querySelector(".modal-btn-floating-content");
    this.adicionarEventoBtn = document.querySelector(".card-empty-card-add");
    this.init();
  }

  abrirModalBtnFloating() {
    if (this.modal && this.modalContent && this.botao) {
      this.modal.style.display = "flex";
      this.modal.style.opacity = "1";
      this.modal.style.visibility = "visible";
      this.modalContent.classList.add("open");
      this.botao.innerHTML = "&times;"; // Altera o conteúdo do botão para "×"
      this.botao.style.zIndex = 2005; // Alterar z-index quando o modal for exibido
    }
  }

  fecharModalBtnFloating() {
    if (this.modal && this.modalContent && this.botao) {
      this.modal.style.opacity = "0";
      this.modal.style.visibility = "hidden";
      this.modalContent.classList.remove("open");
      this.botao.textContent = "+"; // Altera o conteúdo do botão para "+"
      setTimeout(() => {
        this.modal.style.display = "none";
        this.botao.style.zIndex = 2002; // Voltar z-index ao valor original
      }, 300); // Tempo deve coincidir com a duração da transição CSS
    }
  }

  init() {
    if (this.botao) {
      this.botao.addEventListener("click", (event) => {
        event.stopPropagation();
        if (
          this.modal.style.display === "none" ||
          this.modal.style.display === ""
        ) {
          this.abrirModalBtnFloating();
        } else {
          this.fecharModalBtnFloating();
        }
      });
    }

    if (this.modal && this.botao) {
      window.addEventListener("click", (event) => {
        if (event.target !== this.botao) {
          this.fecharModalBtnFloating();
        }
      });
    }

    if (this.adicionarEventoBtn) {
      // Adiciona evento de clique para o botão "adicionar evento"
      this.adicionarEventoBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.abrirModalBtnFloating();
      });
    }
  }
}

new ModalBtnFloating();
