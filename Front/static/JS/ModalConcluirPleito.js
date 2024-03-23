// Função para preencher o modal com os dados do card clicado
function preencherModal(card) {
  // Seleciona o modal
  var modal = document.getElementById("modal-concluir-pleito");

  // Preenche os campos do modal com os dados do card
  modal.querySelector(".modal-concluir-pleito-tiposolici").textContent =
    card.querySelector(".pleitos-medium-card-tiposolici").textContent;
  modal.querySelector(".modal-concluir-pleito-dataSolici").textContent =
    card.querySelector(".pleitos-medium-card-dataSolici").textContent;
  modal.querySelector(".modal-concluir-pleito-solicitante").textContent =
    card.querySelector(".pleitos-medium-card-solicitante").textContent;
  modal.querySelector(".modal-concluir-pleito-desc").textContent =
    card.querySelector(".pleitos-medium-card-desc").textContent;
  modal.querySelector(".modal-concluir-pleito-beneficiario").textContent =
    card.querySelector(".pleitos-medium-card-beneficiario").textContent;
  modal.querySelector(".modal-concluir-pleito-uf").textContent =
    card.querySelector(".pleitos-medium-card-uf").textContent;
  modal.querySelector(".modal-concluir-pleito-cidade").textContent =
    card.querySelector(".pleitos-medium-card-cidade").textContent;
  modal.querySelector(".modal-concluir-pleito-bairro").textContent =
    card.querySelector(".pleitos-medium-card-bairro").textContent;
  modal.querySelector(".modal-concluir-pleito-rua").textContent =
    card.querySelector(".pleitos-medium-card-rua").textContent;
  modal.querySelector(".modal-concluir-pleito-autor").textContent =
    card.querySelector(".pleitos-medium-card-autor").textContent;
  modal.querySelector(".modal-concluir-pleito-dataCriacao").textContent =
    card.querySelector(".pleitos-medium-card-dataCriacao").textContent;
  modal.querySelector(".modal-concluir-pleito-status").textContent =
    card.querySelector(".pleitos-medium-card-status").textContent;
  modal.querySelector(".modal-concluir-pleito-id").textContent =
    card.querySelector(".pleitos-medium-card-id").textContent;
  // Abre o modal
  modal.style.display = "grid"; // Exibe o modal
}

// Função para fechar o modal quando o usuário clicar no botão de fechar
document.querySelector(".close").addEventListener("click", function () {
  var modal = document.getElementById("modal-concluir-pleito");
  modal.style.display = "none"; // Esconde o modal
});

// Função para preencher o modal com os dados do card quando o botão "Concluir" for clicado
document.getElementById("btnConcluir").addEventListener("click", function () {
  // Seleciona o card clicado
  var card = document.querySelector(".pleitos-medium-card");

  // Chama a função para preencher o modal com os dados do card
  preencherModal(card);
});

// Adiciona um ouvinte de eventos de clique ao fundo do modal
document.addEventListener("DOMContentLoaded", function () {
  const modalBackground = document.querySelector(".modal-concluir-pleito");
  const modalContent = document.querySelector(".modal-concluir-pleito-content");

  modalBackground.addEventListener("click", function (event) {
    if (event.target === modalBackground) {
      modalBackground.style.display = "none";
    }
  });
});
