// Variável global para armazenar o contatoId do card clicado
let contatoId;

// Seleciona todos os elementos com a classe "contato"
let cardsContato = document.querySelectorAll(".contato");

// Função para preencher o modal com as informações do card clicado
function fillModal(card) {
  // Preenche o nome, número e imagem de influência do contato no modal
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

// Função para buscar os dados adicionais do contato a partir do backend
function fetchContactData(contatoId) {
  // Faz uma requisição GET para a URL do backend
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

      // Preenche o tipo de contato, tipo de pessoa e email do contato no modal
      document.querySelector("#modalContactType").textContent =
        data.contactType;
      document.querySelector("#modalPersonType").textContent = data.personType;
      document.querySelector("#modalEmail").textContent = data.email;
    })
    .catch((error) => {
      // Em caso de erro, exibe uma mensagem no modal
      document.querySelector("#modalError").textContent = error.message;
    });
}

// Adiciona um evento de clique a cada card de contato
cardsContato.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();

    // Se o usuário clicou no número de telefone, inicia uma chamada
    if (event.target.closest(".contatos-small-card-phone")) {
      window.location.href = `tel:${
        card.querySelector(".contatos-small-card-num").textContent
      }`;
    } else {
      // Caso contrário, exibe o modal com as informações do contato
      let modal = document.querySelector("#modal-info-contato");
      modal.classList.add("show_contato_modal");

      // Preenche o modal com as informações do card clicado
      fillModal(card);

      // Armazena o id do contato e busca os dados adicionais do contato
      contatoId = card.querySelector('[data-filter="idContato"]').textContent;
      fetchContactData(contatoId);
    }
  });
});

// Função para fechar o modal
function closeModal() {
  document
    .querySelector("#modal-info-contato")
    .classList.remove("show_contato_modal");
}

// Adiciona um evento de clique ao botão de fechar o modal
document
  .querySelector("#modal-info-contato .close_contato_modal")
  .addEventListener("click", closeModal);

// Adiciona um evento de clique ao fundo do modal para fechá-lo
document
  .querySelector("#modal-info-contato")
  .addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  });

// Adiciona um evento de pressionar tecla para fechar o modal com a tecla Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Adiciona um evento de clique ao botão de chamada do modal para iniciar uma chamada
document
  .querySelector("#modalCallButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let phoneNumber = document.querySelector("#modalNumber").textContent;
    window.location.href = `tel:${phoneNumber}`;
  });

// Adiciona um evento de clique ao botão de edição do modal para redirecionar para a página de edição do contato
document
  .querySelector("#modalEditButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/contato/put/${contatoId}`;
  });

// class ModalInfoContato {
//   constructor() {
//     this.cardsContato = document.querySelectorAll(".contato");
//     this.modal = document.querySelector("#modal-info-contato");
//     this.modalCallButton = document.querySelector("#modalCallButton");
//     this.modalEditButton = document.querySelector("#modalEditButton");
//     this.init();
//   }

//   fillModal(card) {
//     document.querySelector("#modalName").textContent = card.querySelector(
//       '[data-filter="nomeContato"]'
//     ).innerText;
//     document.querySelector("#modalNumber").textContent = card.querySelector(
//       '[data-filter="numeroContato"]'
//     ).innerText;
//     document.querySelector("#modalInfluence").src = card.querySelector(
//       '[data-filter="perfilInfluencia"]'
//     ).src;
//   }

//   fetchContactData(contatoId) {
//     fetch(`http://192.168.1.21:5000/api/contato/get/${contatoId}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(
//             `Erro na solicitação: ${response.status} - ${response.statusText}`
//           );
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (!data) {
//           throw new Error("Dados do contato não encontrados");
//         }

//         document.querySelector("#modalContactType").textContent =
//           data.contactType;
//         document.querySelector("#modalPersonType").textContent =
//           data.personType;
//         document.querySelector("#modalEmail").textContent = data.email;
//       })
//       .catch((error) => {
//         document.querySelector("#modalError").textContent = error.message;
//       });
//   }

//   closeModal() {
//     this.modal.classList.remove("show_contato_modal");
//   }

//   init() {
//     this.cardsContato.forEach((card) => {
//       card.addEventListener("click", (event) => {
//         event.preventDefault();

//         if (event.target.closest(".contatos-small-card-phone")) {
//           window.location.href = `tel:${
//             card.querySelector(".contatos-small-card-num").textContent
//           }`;
//         } else {
//           this.modal.classList.add("show_contato_modal");
//           this.fillModal(card);
//           const contatoId = card.querySelector(
//             '[data-filter="idContato"]'
//           ).textContent;
//           this.fetchContactData(contatoId);
//         }
//       });
//     });

//     this.modal
//       .querySelector(".close_contato_modal")
//       .addEventListener("click", () => this.closeModal());
//     this.modal.addEventListener("click", (event) => {
//       if (event.target === event.currentTarget) {
//         this.closeModal();
//       }
//     });

//     document.addEventListener("keydown", (event) => {
//       if (event.key === "Escape") {
//         this.closeModal();
//       }
//     });

//     this.modalCallButton.addEventListener("click", (event) => {
//       event.preventDefault();
//       let phoneNumber = document.querySelector("#modalNumber").textContent;
//       window.location.href = `tel:${phoneNumber}`;
//     });

//     this.modalEditButton.addEventListener("click", (event) => {
//       event.preventDefault();
//       const contatoId = this.modal.querySelector(
//         '[data-filter="idContato"]'
//       ).textContent;
//       window.location.href = `/contato/put/${contatoId}`;
//     });
//   }
// }

// new ModalInfoContato();
