// Função para preencher o Modal Concluir com os dados do card clicado
function preencherModalConcluir(card) {
  // Seleciona o modal e o overlay
  var modalConcluir = document.getElementById("modal-concluir-pleito");
  var modalOverlay = document.getElementById("modal-overlay");

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

  // Para a descrição, preserva o HTML
  modalConcluir.querySelector(".modal-concluir-pleito-desc").innerHTML =
    card.querySelector(".pleitos-medium-card-desc").innerHTML;

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

  // Exibe o overlay e o modal
  modalOverlay.classList.add("active");
  modalConcluir.classList.add("active");
}

// Função para fechar o Modal Concluir
function fecharModalConcluir() {
  var modalConcluir = document.getElementById("modal-concluir-pleito");
  var modalOverlay = document.getElementById("modal-overlay");

  modalConcluir.classList.remove("active");
  modalOverlay.classList.remove("active");
}

// Função para lidar com o envio do formulário de conclusão
function submitFormConcluir(event) {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  // Aqui você pode adicionar a lógica para processar os dados do formulário
  // Por exemplo, validar campos e enviar para o servidor via AJAX

  // Após o processamento, feche o modal
  fecharModalConcluir();

  // Exemplo de feedback para o usuário
  alert("Pleito concluído com sucesso!");
}

// Event Listener para fechar o modal ao clicar no "X"
document.querySelectorAll(".closeModalCardAcao").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    // Verifica qual modal está ativo e fecha adequadamente
    var activeModal = document.querySelector(
      ".modal-card-acao-template.active"
    );
    if (activeModal) {
      activeModal.classList.remove("active");
      document.getElementById("modal-overlay").classList.remove("active");
    }
  });
});

// Event Listener para fechar o modal ao clicar no overlay
document.getElementById("modal-overlay").addEventListener("click", function () {
  var activeModal = document.querySelector(".modal-card-acao-template.active");
  if (activeModal) {
    activeModal.classList.remove("active");
    this.classList.remove("active");
  }
});

// Event Listener para todos os botões "Concluir"
document.querySelectorAll(".btn-concluir").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    // Seleciona o card pai
    var card = button.closest(".pleitos-medium-card");
    if (card) {
      preencherModalConcluir(card);
    }
  });
});

// Event Listener para o botão "Concluir" dentro do modal
document
  .querySelector("#modal-concluir-pleito .btn-principal")
  .addEventListener("click", submitFormConcluir);

// Opcional: Limpar campos do formulário ao fechar o modal
document.querySelectorAll(".closeModalCardAcao").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    var modalConcluir = document.getElementById("modal-concluir-pleito");
    var form = modalConcluir.querySelector("form");
    if (form) {
      form.reset();
    }
  });
});
