// Função para abrir o modal e preencher os campos
function openModalAndFillFields(event) {
  event.preventDefault(); // Prevent the default action
  var modal = document.getElementById("modal-pleito-concluir");
  modal.style.display = "block";

  // Preencha os campos do modal com os dados do card clicado
  var card = event.target.closest(".pleitos-medium-card");
  document.getElementById("tipoSolici").value = card.querySelector(
    ".pleitos-medium-card-tiposolici"
  ).textContent;
  document.getElementById("dataSoliciPleito").value = card.querySelector(
    ".pleitos-medium-card-dataSolici"
  ).textContent;
  document.getElementById("solicitante").value = card.querySelector(
    ".pleitos-medium-card-solicitante"
  ).textContent;
  document.getElementById("descPleito").value = card.querySelector(
    ".pleitos-medium-card-desc p"
  ).textContent;
  document.getElementById("beneficiario").value = card.querySelector(
    ".pleitos-medium-card-beneficiario"
  ).textContent;
  document.getElementById("ufPleito").value = card.querySelector(
    ".pleitos-medium-card-uf"
  ).textContent;
  document.getElementById("cidadePleito").value = card.querySelector(
    ".pleitos-medium-card-cidade"
  ).textContent;
  document.getElementById("bairroPleito").value = card.querySelector(
    ".pleitos-medium-card-bairro"
  ).textContent;
  document.getElementById("ruaPleito").value = card.querySelector(
    ".pleitos-medium-card-rua"
  ).textContent;
  document.getElementById("autorPleito").value = card.querySelector(
    ".pleitos-medium-card-autor"
  ).textContent;
  document.getElementById("dataCriacaoPleito").value = card.querySelector(
    ".pleitos-medium-card-dataCriacao"
  ).textContent;
  document.getElementById("statusPleito").value = card.querySelector(
    ".pleitos-medium-card-status"
  ).textContent;
}

// Adicione o manipulador de eventos ao botão "Concluir"
document
  .querySelectorAll(".pleitos-medium-card-editar .btn-leaked")
  .forEach(function (button) {
    button.onclick = openModalAndFillFields;
  });
