document
  .getElementById("mostrarCalendario")
  .addEventListener("click", function () {
    var modalOverlayCalendario = document.getElementById(
      "modalOverlayCalendario"
    );
    var modalcalendario = document.getElementById("modalcalendario");
    var fecharModal = document.getElementById("fecharModal");

    modalOverlayCalendario.style.display = "flex";
    modalcalendario.style.display = "block";

    fecharModal.addEventListener("click", function () {
      modalOverlayCalendario.style.display = "none";
      modalcalendario.style.display = "none";
    });

    modalOverlayCalendario.addEventListener("click", function (event) {
      if (event.target === modalOverlayCalendario) {
        modalOverlayCalendario.style.display = "none";
        modalcalendario.style.display = "none";
      }
    });
  });
