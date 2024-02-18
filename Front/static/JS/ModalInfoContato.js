// Variável global para armazenar o contatoId do card clicado
let currentContatoId;

let cardsContato = document.querySelectorAll(".contato");

function fillModal(card) {
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

function fetchContactData(contatoId) {
  fetch(`https://backend-url.com/contatos/${contatoId}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#modalContactType").textContent =
        data.contactType;
      document.querySelector("#modalPersonType").textContent = data.personType;
      document.querySelector("#modalEmail").textContent = data.email;
    })
    .catch((error) => {
      document.querySelector("#modalError").textContent =
        "Erro ao obter restante dos dados do contato";
    });
}

cardsContato.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();

    if (event.target.closest(".contatos-small-card-phone")) {
      window.location.href = `tel:${
        card.querySelector(".contatos-small-card-num").textContent
      }`;
    } else {
      let modal = document.querySelector("#modal-info-contato");
      modal.classList.add("show_contato_modal");

      fillModal(card);

      currentContatoId = card.getAttribute("data-idContato");
      fetchContactData(currentContatoId);
    }
  });
});

function closeModal() {
  document
    .querySelector("#modal-info-contato")
    .classList.remove("show_contato_modal");
}

document
  .querySelector("#modal-info-contato .close_contato_modal")
  .addEventListener("click", closeModal);

document
  .querySelector("#modal-info-contato")
  .addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

document
  .querySelector("#modalCallButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let phoneNumber = document.querySelector("#modalNumber").textContent;
    window.location.href = `tel:${phoneNumber}`;
  });

document
  .querySelector("#modalEditButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/contato/put/${currentContatoId}`;
  });
