// Seleciona todos os cards
let cards = document.querySelectorAll(".card-s");

// Adiciona um evento de clique a cada card
cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();

    // Verifica se o clique foi no ícone de telefone
    if (event.target.closest(".contatos-small-card-phone")) {
      // Faz uma ligação telefônica
      window.location.href = `tel:${
        card.querySelector(".contatos-small-card-num").textContent
      }`;
    } else {
      // Abre o modal
      let modal = document.querySelector("#modal-info-contato");
      modal.classList.add("show");

      // Preenche os campos do modal com os dados do card
      document.querySelector("#modalName").textContent = card.querySelector(
        ".contatos-small-card-title"
      ).textContent;
      document.querySelector("#modalNumber").textContent = card.querySelector(
        ".contatos-small-card-num"
      ).textContent;
      document.querySelector("#modalInfluence").textContent =
        card.querySelector(".contatos-small-card-star").textContent;

      // Faz uma solicitação ao backend para obter os dados restantes
      let contatoId = card.getAttribute("data-contato-id");
      fetch(`https://backend-url.com/contatos/${contatoId}`)
        .then((response) => response.json())
        .then((data) => {
          // Preenche os campos restantes do modal com os dados obtidos
          document.querySelector("#modalContactType").textContent =
            data.contactType;
          document.querySelector("#modalPersonType").textContent =
            data.personType;
          document.querySelector("#modalEmail").textContent = data.email;
        })
        .catch((error) => {
          // Exibe um erro no modal se a solicitação falhar
          document.querySelector("#modalError").textContent =
            "Erro ao obter restante dos dados do contato";
        });
    }
  });
});

// Adiciona um evento de clique ao botão de fechar do modal
document
  .querySelector("#modal-info-contato .close")
  .addEventListener("click", () => {
    document.querySelector("#modal-info-contato").classList.remove("show");
  });

// Adiciona um evento de clique ao fundo do modal para fechá-lo
document
  .querySelector("#modal-info-contato")
  .addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      document.querySelector("#modal-info-contato").classList.remove("show");
    }
  });

// Adiciona um evento de tecla ao document para fechar o modal ao pressionar ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector("#modal-info-contato").classList.remove("show");
  }
});

// Adiciona um evento de clique ao botão "Ligar" que faz uma ligação telefônica
document
  .querySelector("#modalCallButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let phoneNumber = document
      .querySelector("#modal-info-contato")
      .getAttribute("data-phone-number");
    window.location.href = `tel:${phoneNumber}`;
  });

// Adiciona um evento de clique ao botão "Ligar" que faz uma ligação telefônica
document
  .querySelector("#modalCallButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let phoneNumber = document.querySelector(
      ".contatos-small-card-num"
    ).textContent;
    window.location.href = `tel:${phoneNumber}`;
  });
