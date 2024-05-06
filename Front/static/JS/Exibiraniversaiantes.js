document.addEventListener("DOMContentLoaded", function () {
  var aniversaiantesHeaders = document.querySelectorAll(
    ".area-template-cdf-header.aniversariantes"
  );
  aniversaiantesHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var aniversaiantesContainer = this.nextElementSibling;
      var button = this.querySelector(".btn-recuar-expandir-alt");

      if (aniversaiantesContainer.classList.contains("visible")) {
        aniversaiantesContainer.classList.remove("visible");
        aniversaiantesContainer.classList.add("hidden");
        button.textContent = "Exibir aniversariantes";
        button.classList.remove("up");
      } else {
        aniversaiantesContainer.classList.remove("hidden");
        aniversaiantesContainer.classList.add("visible");
        button.textContent = "Ocultar";
        button.classList.add("up");
      }

      var liElements = aniversaiantesContainer.querySelectorAll("li");
      liElements.forEach(function (li) {
        if (aniversaiantesContainer.classList.contains("visible")) {
          li.classList.add("item-visible");
        } else {
          li.classList.remove("item-visible");
        }
      });
    });
  });
});
