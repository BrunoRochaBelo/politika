// Função para preencher o modal com os dados do card de tarefa clicado
function preencherModalConcluirTarefa(card) {
  // Seleciona o modal
  var modalConcluir = document.getElementById("modal-concluir-tarefa");

  // Preenche os campos do modal com os dados do card
  modalConcluir.querySelector(".modal-concluir-tarefa-title").textContent =
    card.querySelector(".tarefa-medium-card-title").textContent;
  modalConcluir.querySelector(".modal-concluir-tarefa-data").textContent =
    card.querySelector(".tarefa-medium-card-data").textContent;
  modalConcluir.querySelector(".modal-concluir-tarefa-status").textContent =
    card.querySelector(".tarefa-medium-card-status").textContent;
  modalConcluir.querySelector(
    ".modal-concluir-tarefa-responsavel"
  ).textContent = card.querySelector(".tarefa-medium-card-resp").textContent;
  modalConcluir.querySelector(".modal-concluir-tarefa-desc").textContent =
    card.querySelector(".tarefa-medium-card-desc").textContent;
  modalConcluir.querySelector(".modal-concluir-tarefa-id").textContent =
    card.querySelector(".tarefa-medium-card-id").textContent;

  // Abre o modal
  modalConcluir.style.display = "grid"; // Exibe o modal
}

// Função para fechar o modal quando o usuário clicar no botão de fechar
document.querySelector(".close").addEventListener("click", function () {
  var modalConcluir = document.getElementById("modal-concluir-tarefa");
  modalConcluir.style.display = "none";
});

// Função para preencher o modal com os dados do card quando o botão "Concluir" for clicado
document.getElementById("btnConcluir").addEventListener("click", function () {
  // Seleciona o card clicado
  var card = document.querySelector(".tarefa-medium-card");

  // Chama a função para preencher o modal com os dados do card
  preencherModalConcluirTarefa(card);
});

// Adiciona um ouvinte de eventos de clique ao fundo do modal
document.addEventListener("DOMContentLoaded", function () {
  const modalBackground = document.querySelector(".modal-concluir-tarefa");
  const modalContent = document.querySelector(".modal-concluir-tarefa-content");

  modalBackground.addEventListener("click", function (event) {
    if (event.target === modalBackground) {
      modalBackground.style.display = "none";
    }
  });
});
