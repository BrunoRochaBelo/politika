// Encapsula todo o código para evitar poluição do escopo global
document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );

  // Se existir um contêiner específico para os cartões, selecione-o.
  // Substitua '.lista-de-cards-container' pelo seletor correto do seu HTML.
  const listaDeCardsContainer = document.querySelector(
    ".lista-de-cards-container"
  );

  // Função para iniciar uma chamada telefônica
  const iniciarChamadaTelefonicaNiver = (card) => {
    const callElement = card.querySelector(".aniversario-small-card-num");
    if (callElement) {
      const callNumber = callElement.textContent.trim();
      if (callNumber) {
        window.location.href = `tel:${callNumber}`;
      } else {
        console.warn("Número de telefone não encontrado.");
      }
    } else {
      console.warn(
        "Elemento com a classe '.aniversario-small-card-num' não encontrado."
      );
    }
  };

  // Função para fechar todos os cartões de aniversário expandidos
  const fecharTodosOsCardsAniversario = () => {
    const expandedCards = document.querySelectorAll(
      ".aniversario-small-card-expanded"
    );
    expandedCards.forEach((card) => {
      card.classList.remove("aniversario-small-card-expanded");
      const hiddenFields = card.querySelectorAll(
        ".aniversario-small-card-num, .aniversario-small-card-email, .aniversario-small-card-tipopessoa, .aniversario-small-card-editar"
      );
      hiddenFields.forEach((field) => {
        field.classList.remove("exibirDetalhesAniversariante");
      });
    });
  };

  // Função para ajustar o scroll para centralizar o cartão
  const ajustarScrollParaCentralizarCard = (card) => {
    if (!areaTemplateContent) return;

    const cardRect = card.getBoundingClientRect();
    const containerRect = areaTemplateContent.getBoundingClientRect();

    if (
      cardRect.top < containerRect.top ||
      cardRect.bottom > containerRect.bottom
    ) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Função para lidar com o clique nos cartões usando delegação de eventos
  const exibirDetalhesAniversariante = (event) => {
    const card = event.target.closest(".aniversario-small-card");
    if (!card) return;

    // Se o clique for no botão de chamada, inicie a chamada
    if (event.target.classList.contains("aniversario-small-card-call")) {
      iniciarChamadaTelefonicaNiver(card);
      return;
    }

    event.preventDefault();

    const hiddenFields = card.querySelectorAll(
      ".aniversario-small-card-num, .aniversario-small-card-email, .aniversario-small-card-tipopessoa, .aniversario-small-card-editar"
    );

    const isExpanded = card.classList.contains(
      "aniversario-small-card-expanded"
    );

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("aniversario-small-card-expanded");
      hiddenFields.forEach((field) => {
        field.classList.remove("exibirDetalhesAniversariante");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsAniversario();

      // Expande o cartão clicado
      card.classList.add("aniversario-small-card-expanded");
      hiddenFields.forEach((field) => {
        field.classList.add("exibirDetalhesAniversariante");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  // Função para adicionar ouvintes de eventos
  const adicionarOuvintes = () => {
    if (listaDeCardsContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsContainer.addEventListener(
        "click",
        exibirDetalhesAniversariante
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesAniversariante);
      console.warn(
        "Contêiner '.lista-de-cards-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Adiciona os ouvintes de eventos
  adicionarOuvintes();
});
