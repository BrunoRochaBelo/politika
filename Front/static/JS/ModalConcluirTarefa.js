// Função para preencher o Modal Concluir com os dados do card clicado
function preencherModalConcluirTarefa(card) {
  // Seleciona o modal e o overlay
  var modalConcluir = document.getElementById("modal-concluir-tarefa");
  var modalOverlay = document.getElementById("modal-overlay");

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

  // Para a descrição, preserva o HTML
  modalConcluir.querySelector(".modal-concluir-tarefa-desc").innerHTML =
    card.querySelector(".tarefa-medium-card-desc").innerHTML;

  modalConcluir.querySelector(".modal-concluir-tarefa-id").textContent =
    card.querySelector(".tarefa-medium-card-id").textContent;

  // Exibe o overlay e o modal
  modalOverlay.classList.add("active");
  modalConcluir.classList.add("active");
}

// Função para fechar o Modal Concluir
function fecharModalConcluirTarefa() {
  var modalConcluir = document.getElementById("modal-concluir-tarefa");
  var modalOverlay = document.getElementById("modal-overlay");

  modalConcluir.classList.remove("active");
  modalOverlay.classList.remove("active");
}

// Função para lidar com o envio do formulário de conclusão da tarefa
function submitFormConcluirTarefa(event) {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  // Aqui você pode adicionar a lógica para processar os dados do formulário
  // Por exemplo, validar campos e enviar para o servidor via AJAX

  // Após o processamento, feche o modal
  fecharModalConcluirTarefa();

  // Exemplo de feedback para o usuário
  alert("Tarefa concluída com sucesso!");
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

// Event Listener para todos os botões "Concluir" nas tarefas
document.querySelectorAll(".btn-concluir").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    // Seleciona o card pai
    var card = button.closest(".tarefa-medium-card");
    if (card) {
      preencherModalConcluirTarefa(card);
    }
  });
});

// Event Listener para o botão "Concluir" dentro do modal de tarefa
document
  .querySelector("#modal-concluir-tarefa .btn-principal")
  .addEventListener("click", submitFormConcluirTarefa);

// Opcional: Limpar campos do formulário ao fechar o modal
document.querySelectorAll(".closeModalCardAcao").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    var modalConcluir = document.getElementById("modal-concluir-tarefa");
    var form = modalConcluir.querySelector("form");
    if (form) {
      form.reset();
    }
  });
});
