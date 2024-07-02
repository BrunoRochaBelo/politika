document.addEventListener("DOMContentLoaded", function () {
  var aniversariantesHeaders = document.querySelectorAll(
    ".sessao-interna-template-header"
  );

  aniversariantesHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var aniversariantesContainer = this.nextElementSibling;
      var button = this.querySelector(".btn-recuar-expandir-aniver");
      var headerElement = this.closest(
        ".sessao-interna-template.area-aniversariantes"
      );

      // Alterna a visibilidade do contêiner
      if (aniversariantesContainer.classList.contains("visible")) {
        aniversariantesContainer.classList.remove("visible");
        aniversariantesContainer.classList.add("hidden");
        aniversariantesContainer.classList.remove("fade-in");
        aniversariantesContainer.classList.add("fade-out");
        button.textContent = "Exibir";
        button.classList.remove("up");
        headerElement.classList.remove("visible");

        // Remove a borda quando o contêiner estiver oculto
        headerElement.style.border = "none";
      } else {
        aniversariantesContainer.classList.remove("hidden");
        aniversariantesContainer.classList.add("visible");
        aniversariantesContainer.classList.remove("fade-out");
        aniversariantesContainer.classList.add("fade-in");
        button.textContent = "Ocultar";
        button.classList.add("up");
        headerElement.classList.add("visible");

        // Adiciona a animação de balanço ao ícone
        var iconElement = this.querySelector(".aniversario-icon");
        iconElement.classList.add("swing-animation");

        // Remove a animação após um curto período para permitir reativação futura
        setTimeout(function () {
          iconElement.classList.remove("swing-animation");
        }, 500);

        // Adiciona a borda quando o contêiner estiver visível
        headerElement.style.border = "1px solid var(--cor-ap1)";
      }

      // Alterna o background do cabeçalho
      var headerBackgroundClass = aniversariantesContainer.classList.contains(
        "visible"
      )
        ? "--cor-ap2"
        : "--card-fundo";
      headerElement.style.background = `var(${headerBackgroundClass})`;

      var liElements = aniversariantesContainer.querySelectorAll("li");
      liElements.forEach(function (li) {
        if (aniversariantesContainer.classList.contains("visible")) {
          li.classList.add("item-visible");
        } else {
          li.classList.remove("item-visible");
        }
      });
    });
  });
});
