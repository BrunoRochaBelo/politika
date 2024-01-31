function mostrarModal() {
  var modalOverlay = document.getElementById("modalOverlay");
  var modalContent = document.getElementById("modalContent");

  modalOverlay.style.display = "flex";
  modalContent.style.display = "block";
}

function fecharModal() {
  var modalOverlay = document.getElementById("modalOverlay");
  var modalContent = document.getElementById("modalContent");

  modalOverlay.style.display = "none";
  modalContent.style.display = "none";
}
