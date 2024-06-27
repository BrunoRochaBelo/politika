document.addEventListener("DOMContentLoaded", function () {
  var aniversariantesHeaders = document.querySelectorAll(
    ".area-template-sessao-int-header.aniversariantes"
  );

  aniversariantesHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var aniversariantesContainer = this.nextElementSibling;
      var button = this.querySelector(".btn-recuar-expandir-aniver");

      // Alterna a visibilidade do contêiner
      if (aniversariantesContainer.classList.contains("visible")) {
        aniversariantesContainer.classList.remove("visible");
        aniversariantesContainer.classList.add("hidden");
        button.textContent = "Exibir aniversariantes";
        button.classList.remove("up");
        this.classList.remove("visible");
      } else {
        aniversariantesContainer.classList.remove("hidden");
        aniversariantesContainer.classList.add("visible");
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
      }

      // Alterna o background do cabeçalho
      var headerBackgroundClass = aniversariantesContainer.classList.contains(
        "visible"
      )
        ? "--cor-s3"
        : "--card-fundo";
      var headerElement = document.querySelector(
        ".area-template-sessao-int.aniversariantes"
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
