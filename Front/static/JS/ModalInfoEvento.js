class ModalInfoEvento {
  constructor() {
    this.cardsEvento = document.querySelectorAll(".evento");
    this.modal = document.querySelector("#modal-info-evento");
    this.modalEditButton = document.querySelector("#modalEventoEditButton");
    this.init();
  }

  fillModal(card) {
    document.querySelector("#modalEventoName").textContent = card.querySelector(
      '[data-filter="tituloEvento"]'
    ).innerText;
    document.querySelector("#modalEventoCategoria").textContent =
      card.querySelector('[data-filter="tagEvento"]').innerText;
    document.querySelector("#modalEventoParticipantes").textContent =
      card.querySelector('[data-filter="participantesEvento"]').innerText;
    document.querySelector("#modalEventoDuracao").textContent =
      card.querySelector('[data-filter="duracaoEvento"]').innerText;
  }

  fetchEventData(eventoId) {
    fetch(`https://backend-url.com/eventos/${eventoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        document.querySelector("#modalEventoTipo").textContent = data.tipo;
        document.querySelector("#modalEventoDataInicio").textContent =
          data.dataInicio;
        document.querySelector("#modalEventoDataFim").textContent =
          data.dataFim;
        document.querySelector("#modalEventoResponsavel").textContent =
          data.responsavel;
        document.querySelector("#modalEventoAssunto").textContent =
          data.assunto;
        document.querySelector("#modalEventoEndereco").textContent =
          data.endereco;
        document.querySelector("#modalEventoSala").textContent = data.sala;
        document.querySelector("#modalEventoRecursos").textContent =
          data.recursos;
        document.querySelector("#modalEventoAnotacoes").textContent =
          data.anotacoes;
      })
      .catch((error) => {
        document.querySelector("#modalEventoError").textContent =
          "Erro ao obter restante dos dados do evento";
      });
  }

  closeModal() {
    this.modal.classList.remove("show_evento_modal");
  }

  init() {
    this.cardsEvento.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        this.modal.classList.add("show_evento_modal");
        this.fillModal(card);
        const eventoId = card.getAttribute("data-idEvento");
        this.fetchEventData(eventoId);
      });
    });

    this.modal
      .querySelector(".close_evento_modal")
      .addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        this.closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeModal();
      }
    });

    this.modalEditButton.addEventListener("click", (event) => {
      event.preventDefault();
      const eventoId = this.modal.querySelector(
        '[data-filter="idEvento"]'
      ).textContent;
      window.location.href = `/evento/put/${eventoId}`;
    });
  }
}

new ModalInfoEvento();
