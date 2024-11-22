// Função para preencher o modal com os dados do card clicado
function preencherModalDespachar(card) {
  // Seleciona o modal e o overlay
  var modalDespachar = document.getElementById("modal-despachar-pleito");
  var modalOverlay = document.getElementById("modal-overlay");

  // Preenche os campos do modal com os dados do card
  modalDespachar.querySelector(
    ".modal-despachar-pleito-tiposolici"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-tiposolici"
  ).textContent;
  modalDespachar.querySelector(
    ".modal-despachar-pleito-dataSolici"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-dataSolici"
  ).textContent;
  modalDespachar.querySelector(
    ".modal-despachar-pleito-solicitante"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-solicitante"
  ).textContent;

  // Para a descrição, preserva o HTML
  modalDespachar.querySelector(".modal-despachar-pleito-desc").innerHTML =
    card.querySelector(".pleitos-medium-card-desc").innerHTML;

  modalDespachar.querySelector(
    ".modal-despachar-pleito-beneficiario"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-beneficiario"
  ).textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-uf").textContent =
    card.querySelector(".pleitos-medium-card-uf").textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-cidade").textContent =
    card.querySelector(".pleitos-medium-card-cidade").textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-bairro").textContent =
    card.querySelector(".pleitos-medium-card-bairro").textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-rua").textContent =
    card.querySelector(".pleitos-medium-card-rua").textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-autor").textContent =
    card.querySelector(".pleitos-medium-card-autor").textContent;
  modalDespachar.querySelector(
    ".modal-despachar-pleito-dataCriacao"
  ).textContent = card.querySelector(
    ".pleitos-medium-card-dataCriacao"
  ).textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-status").textContent =
    card.querySelector(".pleitos-medium-card-status").textContent;
  modalDespachar.querySelector(".modal-despachar-pleito-id").textContent =
    card.querySelector(".pleitos-medium-card-id").textContent;

  // Exibe o overlay e o modal
  modalOverlay.classList.add("active");
  modalDespachar.classList.add("active");
}

// Função para fechar o modal
function fecharModalDespachar() {
  var modalDespachar = document.getElementById("modal-despachar-pleito");
  var modalOverlay = document.getElementById("modal-overlay");

  modalDespachar.classList.remove("active");
  modalOverlay.classList.remove("active");
}

// Função para lidar com o envio do formulário
function submitForm() {
  // Aqui você pode adicionar a lógica para processar os dados do formulário
  // Por exemplo, enviar para o servidor via AJAX

  // Após o processamento, feche o modal
  fecharModalDespachar();

  // Exemplo de feedback para o usuário
  alert("Pleito despachado com sucesso!");
}

// Event Listener para fechar o modal ao clicar no "X"
document.querySelectorAll(".closeModalCardAcao").forEach((closeBtn) => {
  closeBtn.addEventListener("click", fecharModalDespachar);
});

// Event Listener para fechar o modal ao clicar no overlay
document
  .getElementById("modal-overlay")
  .addEventListener("click", fecharModalDespachar);

// Event Listener para todos os botões "Despachar"
document.querySelectorAll(".btn-despachar").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    // Seleciona o card pai
    var card = button.closest(".pleitos-medium-card");
    if (card) {
      preencherModalDespachar(card);
    }
  });
});

// Event Listener para o botão "Despachar" dentro do modal
document
  .querySelector(".despachar-button")
  .addEventListener("click", submitForm);
