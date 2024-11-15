document.addEventListener("DOMContentLoaded", () => {
  const areaAniversariantes = document.querySelector(".area-aniversariantes");

  if (!areaAniversariantes) return;

  areaAniversariantes.addEventListener("click", (event) => {
    const header = event.target.closest(".secao-interna-template-header");

    if (!header) return;

    const aniversariantesContainer = header.nextElementSibling;
    const button = header.querySelector(".btn-recuar-expandir-aniver");
    const headerElement = header.closest(
      ".secao-interna-template.area-aniversariantes"
    );
    const iconElement = header.querySelector(".aniversario-icon");
    const isVisible = aniversariantesContainer.classList.contains("visible");

    if (isVisible) {
      // Iniciar a transição de fechamento
      aniversariantesContainer.classList.remove("visible");
      aniversariantesContainer.classList.add("closing");
      button.textContent = "Exibir";
      button.classList.remove("up");
      headerElement.classList.remove("visible");
      headerElement.style.border = "1px solid var(--card-borda)";
      headerElement.style.background = "var(--card-bg)";

      // Remover a classe 'closing' após a transição
      aniversariantesContainer.addEventListener(
        "transitionend",
        function handleTransitionEnd() {
          aniversariantesContainer.classList.remove("closing");
          aniversariantesContainer.style.display = "none";
          aniversariantesContainer.removeEventListener(
            "transitionend",
            handleTransitionEnd
          );
        }
      );

      // Atualiza a visibilidade dos itens da lista
      const liElements = aniversariantesContainer.querySelectorAll("li");
      liElements.forEach((li) => {
        li.classList.remove("item-visible");
      });
    } else {
      // Preparar para a transição de abertura
      aniversariantesContainer.style.display = "block";
      // Forçar o reflow para que a transição seja aplicada
      void aniversariantesContainer.offsetWidth;
      aniversariantesContainer.classList.add("visible");

      button.textContent = "Ocultar";
      button.classList.add("up");
      headerElement.classList.add("visible");
      headerElement.style.border = "1px solid var(--cor-apoio-1)";
      headerElement.style.background = "var(--cor-apoio-2)";

      // Animação de balanço no ícone
      iconElement.classList.add("swing-animation");
      setTimeout(() => {
        iconElement.classList.remove("swing-animation");
      }, 500);

      // Atualiza a visibilidade dos itens da lista
      const liElements = aniversariantesContainer.querySelectorAll("li");
      liElements.forEach((li) => {
        li.classList.add("item-visible");
      });
    }
  });
});
