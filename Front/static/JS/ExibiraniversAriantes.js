document.addEventListener("click", (event) => {
  // Verifica se o clique foi em um elemento que pertence à área de aniversariantes
  const areaAniversariantes = event.target.closest(".area-aniversariantes");
  if (!areaAniversariantes) return;

  // Procura pelo header dentro da área de aniversariantes
  const header = event.target.closest(".secao-interna-template-header");
  if (!header || !areaAniversariantes.contains(header)) return;

  // Usamos uma flag para evitar cliques enquanto a transição estiver ocorrendo
  if (header.dataset.isTransitioning === "true") return;
  header.dataset.isTransitioning = "true";

  const aniversariantesContainer = header.nextElementSibling;
  const button = header.querySelector(".btn-recuar-expandir-aniver");
  const headerElement = header.closest(
    ".secao-interna-template.area-aniversariantes"
  );
  const iconElement = header.querySelector(".aniversario-icon");
  const isVisible = aniversariantesContainer.classList.contains("visible");

  if (isVisible) {
    // Fechamento
    aniversariantesContainer.classList.remove("visible");
    aniversariantesContainer.classList.add("closing");
    button.textContent = "Exibir";
    button.classList.remove("up");
    headerElement.classList.remove("visible");
    headerElement.style.border = "1px solid var(--card-borda)";
    headerElement.style.background = "var(--card-bg)";

    const onTransitionEnd = () => {
      aniversariantesContainer.classList.remove("closing");
      aniversariantesContainer.style.display = "none";
      aniversariantesContainer.removeEventListener(
        "transitionend",
        onTransitionEnd
      );
      // Libera a flag
      header.dataset.isTransitioning = "false";
    };

    aniversariantesContainer.addEventListener("transitionend", onTransitionEnd);

    // Remove a visibilidade dos itens
    aniversariantesContainer.querySelectorAll("li").forEach((li) => {
      li.classList.remove("item-visible");
    });
  } else {
    // Abertura
    aniversariantesContainer.style.display = "block";
    // Força o reflow para que a transição seja aplicada
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

    // Exibe os itens da lista
    aniversariantesContainer.querySelectorAll("li").forEach((li) => {
      li.classList.add("item-visible");
    });

    // Libera a flag após um fallback, caso o transitionend não dispare
    setTimeout(() => {
      header.dataset.isTransitioning = "false";
    }, 600);
  }
});
