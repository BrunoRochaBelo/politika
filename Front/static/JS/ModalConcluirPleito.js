// Função para preencher o modal com os dados do card clicado
function preencherModalConcluir(card) {
  // Seleciona o modal
  var modalConcluir = document.getElementById("modal-concluir-pleito");

  // Preenche os campos do modal com os dados do card
  modalConcluir.querySelector(".modal-concluir-pleito-tiposolici").textContent =
    card.querySelector(".pleitos-medium-card-tiposolici").textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-dataSolici").textContent =
    card.querySelector(".pleitos-medium-card-dataSolici").textContent;
  modalConcluir.querySelector(
    ".modal-concluir-pleito-solicitante"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-solicitante"
  ).textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-desc").textContent =
    card.querySelector(".pleitos-medium-card-desc").textContent;
  modalConcluir.querySelector(
    ".modal-concluir-pleito-beneficiario"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-beneficiario"
  ).textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-uf").textContent =
    card.querySelector(".pleitos-medium-card-uf").textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-cidade").textContent =
    card.querySelector(".pleitos-medium-card-cidade").textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-bairro").textContent =
    card.querySelector(".pleitos-medium-card-bairro").textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-rua").textContent =
    card.querySelector(".pleitos-medium-card-rua").textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-autor").textContent =
    card.querySelector(".pleitos-medium-card-autor").textContent;
  modalConcluir.querySelector(
    ".modal-concluir-pleito-dataCriacao"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-dataCriacao"
  ).textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-status").textContent =
    card.querySelector(".pleitos-medium-card-status").textContent;
  modalConcluir.querySelector(".modal-concluir-pleito-id").textContent =
    card.querySelector(".pleitos-medium-card-id").textContent;
  // Abre o modal
  modalConcluir.style.display = "grid"; // Exibe o modal
}

// Função para fechar o modal quando o usuário clicar no botão de fechar
document.querySelector(".close").addEventListener("click", function () {
  var modalConcluir = document.getElementById("modal-concluir-pleito");
  modalConcluir.style.display = "none";
});

// Função para preencher o modal com os dados do card quando o botão "Concluir" for clicado
document.getElementById("btnConcluir").addEventListener("click", function () {
  // Seleciona o card clicado
  var card = document.querySelector(".pleitos-medium-card");

  // Chama a função para preencher o modal com os dados do card
  preencherModalConcluir(card);
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
