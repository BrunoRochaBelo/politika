function getModalElements() {
  var modalOverlay = document.getElementById("modalOverlay");
  var modalContent = document.getElementById("modalContent");

  return { modalOverlay, modalContent };
}

function mostrarModal() {
  var { modalOverlay, modalContent } = getModalElements();

  modalOverlay.style.display = "flex";
  modalContent.style.display = "grid";
}

function fecharModal() {
  var { modalOverlay, modalContent } = getModalElements();

  modalOverlay.style.display = "none";
  modalContent.style.display = "none";
}
