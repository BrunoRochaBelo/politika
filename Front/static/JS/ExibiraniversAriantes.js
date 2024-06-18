document.addEventListener("DOMContentLoaded", function () {
  var aniversaiantesHeaders = document.querySelectorAll(
    ".area-template-sessao-int-header.aniversariantes"
  );
  aniversaiantesHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var aniversaiantesContainer = this.nextElementSibling;
      var button = this.querySelector(".btn-recuar-expandir-alt");

      // Alterna a visibilidade do contêiner
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

      // Alterna o background do cabeçalho
      var headerBackgroundClass = aniversaiantesContainer.classList.contains(
        "visible"
      )
        ? "--card-aberto-fundo"
        : "--card-fundo";
      var headerElement = document.querySelector(
        ".area-template-sessao-int.aniversariantes"
      );
      headerElement.style.background = `var(${headerBackgroundClass})`;

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
