class ModalInfoContato {
  constructor() {
    this.cardsContato = document.querySelectorAll(".contato");
    this.modal = document.querySelector("#modal-info-contato");
    this.modalCallButton = document.querySelector("#modalCallButton");
    this.modalEditButton = document.querySelector("#modalEditButton");
    this.init();
  }

  fillModal(card) {
    document.querySelector("#modalName").textContent = card.querySelector(
      '[data-filter="nomeContato"]'
    ).innerText;
    document.querySelector("#modalNumber").textContent = card.querySelector(
      '[data-filter="numeroContato"]'
    ).innerText;
    document.querySelector("#modalInfluence").src = card.querySelector(
      '[data-filter="perfilInfluencia"]'
    ).src;
  }

  fetchContactData(contatoId) {
    fetch(`http://192.168.1.21:5000/api/contato/get/${contatoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erro na solicitação: ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          throw new Error("Dados do contato não encontrados");
        }

        document.querySelector("#modalContactType").textContent =
          data.contactType;
        document.querySelector("#modalPersonType").textContent =
          data.personType;
        document.querySelector("#modalEmail").textContent = data.email;
      })
      .catch((error) => {
        document.querySelector("#modalError").textContent = error.message;
      });
  }

  closeModal() {
    this.modal.classList.remove("show_contato_modal");
  }

  init() {
    this.cardsContato.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.preventDefault();

        if (event.target.closest(".contatos-small-card-phone")) {
          window.location.href = `tel:${
            card.querySelector(".contatos-small-card-num").textContent
          }`;
        } else {
          this.modal.classList.add("show_contato_modal");
          this.fillModal(card);
          const contatoId = card.querySelector(
            '[data-filter="idContato"]'
          ).textContent;
          this.fetchContactData(contatoId);
        }
      });
    });

    this.modal
      .querySelector(".close_contato_modal")
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

    this.modalCallButton.addEventListener("click", (event) => {
      event.preventDefault();
      let phoneNumber = document.querySelector("#modalNumber").textContent;
      window.location.href = `tel:${phoneNumber}`;
    });

    this.modalEditButton.addEventListener("click", (event) => {
      event.preventDefault();
      const contatoId = this.modal.querySelector(
        '[data-filter="idContato"]'
      ).textContent;
      window.location.href = `/contato/put/${contatoId}`;
    });
  }
}

new ModalInfoContato();
