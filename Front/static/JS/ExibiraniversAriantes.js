document.addEventListener("DOMContentLoaded", function () {
  var aniversariantesHeaders = document.querySelectorAll(
    ".area-template-sessao-int-header.area-aniversariantes"
  );

  aniversariantesHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var aniversariantesContainer = this.nextElementSibling;
      var button = this.querySelector(".btn-recuar-expandir-aniver");

      // Alterna a visibilidade do contêiner
      if (aniversariantesContainer.classList.contains("visible")) {
        aniversariantesContainer.classList.remove("visible");
        aniversariantesContainer.classList.add("hidden");
        aniversariantesContainer.classList.remove("fade-in");
        aniversariantesContainer.classList.add("fade-out");
        button.textContent = "Exibir";
        button.classList.remove("up");
        this.classList.remove("visible");

        // Remove a borda quando o contêiner estiver oculto
        var headerElement = this.closest(
          ".area-template-sessao-int.area-aniversariantes"
        );
        headerElement.style.border = "none";
      } else {
        aniversariantesContainer.classList.remove("hidden");
        aniversariantesContainer.classList.add("visible");
        aniversariantesContainer.classList.remove("fade-out");
        aniversariantesContainer.classList.add("fade-in");
        button.textContent = "Ocultar";
        button.classList.add("up");
        this.classList.add("visible");

        // Adiciona a animação de balanço ao ícone
        var iconElement = this.querySelector(".aniversario-icon");
        iconElement.classList.add("swing-animation");

        // Remove a animação após um curto período para permitir reativação futura
        setTimeout(function () {
          iconElement.classList.remove("swing-animation");
        }, 500);

        // Adiciona a borda quando o contêiner estiver visível
        var headerElement = this.closest(
          ".area-template-sessao-int.area-aniversariantes"
        );
        headerElement.style.border = "1px solid var(--cor-s3)";
      }

      // Alterna o background do cabeçalho
      var headerBackgroundClass = aniversariantesContainer.classList.contains(
        "visible"
      )
        ? "--cor-s4"
        : "--card-fundo";
      var headerElement = this.closest(
        ".area-template-sessao-int.area-aniversariantes"
      );
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
