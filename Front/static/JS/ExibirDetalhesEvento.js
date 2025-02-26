document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContentSmall = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  const areaTemplateContentLarge = document.querySelector(
    ".container-abas-template-content"
  );
  // Container do calendário para scroll interno
  const areaTemplateContentCalendar = document.querySelector(
    ".area-interna-containerContent-template-content"
  );

  const listaDeCardsEventoSmallContainer = document.querySelector(
    ".lista-de-cards-evento-small-container"
  );
  const listaDeCardsEventoLargeContainer = document.querySelector(
    ".lista-de-cards-evento-large-container"
  );

  /**
   * Função para ajustar o scroll e centralizar o cartão.
   * Se o container for a área do calendário, realiza scroll interno.
   * @param {HTMLElement} card - O cartão a centralizar.
   * @param {HTMLElement} container - Container onde ocorrerá o scroll.
   */
  const ajustarScrollParaCentralizarCard = (card, container) => {
    if (!container) return;

    // Se for o container do calendário, faz o scroll interno customizado
    if (
      container.classList.contains(
        "area-interna-containerContent-template-content"
      )
    ) {
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const offset = cardRect.top - containerRect.top;
      const targetScrollTop =
        scrollTop + offset - containerRect.height / 2 + cardRect.height / 2;
      container.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    } else {
      // Para outros containers, utiliza scrollIntoView padrão
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  /**
   * Função para fechar todos os cartões de evento expandidos.
   */
  const fecharTodosOsCardsEvento = () => {
    // Fechar cartões pequenos
    const expandedSmallCards = listaDeCardsEventoSmallContainer
      ? listaDeCardsEventoSmallContainer.querySelectorAll(
          ".calendario-small-card-expanded"
        )
      : document.querySelectorAll(".calendario-small-card-expanded");

    expandedSmallCards.forEach((card) => {
      card.classList.remove("calendario-small-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".calendario-small-card-local, .calendario-small-card-partcipantes, .calendario-small-card-duracao, .calendario-small-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheEvento");
      });
    });

    // Fechar cartões grandes
    const expandedLargeCards = listaDeCardsEventoLargeContainer
      ? listaDeCardsEventoLargeContainer.querySelectorAll(
          ".calendario-large-card-expanded"
        )
      : document.querySelectorAll(".calendario-large-card-expanded");

    expandedLargeCards.forEach((card) => {
      card.classList.remove("calendario-large-card-expanded");
      const editar = card.querySelector(".calendario-large-card-editar");
      if (editar) {
        editar.classList.remove("exibirDetalheEvento");
      }
    });
  };

  /**
   * Função para lidar com o clique nos cartões de evento pequeno.
   * Mantém a lógica original e adiciona o scroll interno se o cartão estiver no calendário.
   * @param {Event} event
   */
  const exibirDetalhesEventoSmall = (event) => {
    const card = event.target.closest(".calendario-small-card");
    if (!card) return;

    if (event.target.closest(".calendario-small-card-editar")) return;

    if (event.target.closest(".btn-editar-evento-small")) {
      abrirModalEdicaoEventoSmall(card);
      event.stopPropagation();
      return;
    }

    if (event.target.closest("#btnVisualizarEventoSmall")) {
      lidarComBtnVisualizar(event, "evento_small");
      return;
    }

    event.preventDefault();
    const camposOcultos = card.querySelectorAll(
      ".calendario-small-card-local, .calendario-small-card-partcipantes, .calendario-small-card-duracao, .calendario-small-card-editar"
    );
    const isExpanded = card.classList.contains(
      "calendario-small-card-expanded"
    );

    if (isExpanded) {
      card.classList.remove("calendario-small-card-expanded");
      camposOcultos.forEach((campo) =>
        campo.classList.remove("exibirDetalheEvento")
      );
    } else {
      fecharTodosOsCardsEvento();
      card.classList.add("calendario-small-card-expanded");
      camposOcultos.forEach((campo) =>
        campo.classList.add("exibirDetalheEvento")
      );
      // Se o cartão estiver dentro do container do calendário, usa ele; senão, usa o padrão.
      const container =
        card.closest(".area-interna-containerContent-template-content") ||
        areaTemplateContentSmall;
      ajustarScrollParaCentralizarCard(card, container);
    }
  };

  /**
   * Função para lidar com o clique nos cartões de evento grande.
   * Mantém a lógica original e adiciona o scroll interno se o cartão estiver no calendário.
   * @param {Event} event
   */
  const exibirDetalhesEventoLarge = (event) => {
    const card = event.target.closest(".calendario-large-card");
    if (!card) return;

    if (event.target.closest(".calendario-large-card-editar")) return;

    if (event.target.closest(".btn-editar-evento-large")) {
      abrirModalEdicaoEventoLarge(card);
      event.stopPropagation();
      return;
    }

    if (event.target.closest("#btnVisualizarEventoLarge")) {
      lidarComBtnVisualizar(event, "evento_large");
      return;
    }

    event.preventDefault();
    const editar = card.querySelector(".calendario-large-card-editar");
    if (!editar) return;
    const isExpanded = card.classList.contains(
      "calendario-large-card-expanded"
    );

    if (isExpanded) {
      card.classList.remove("calendario-large-card-expanded");
      editar.classList.remove("exibirDetalheEvento");
    } else {
      fecharTodosOsCardsEvento();
      card.classList.add("calendario-large-card-expanded");
      editar.classList.add("exibirDetalheEvento");
      // Verifica se o cartão tá dentro do container do calendário; se sim, faz scroll interno.
      const container =
        card.closest(".area-interna-containerContent-template-content") ||
        areaTemplateContentLarge;
      ajustarScrollParaCentralizarCard(card, container);
    }
  };

  // Funções de modal e demais lógicas permanecem inalteradas...
  const abrirModalEdicaoEventoSmall = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoEventoSmall");
    if (!modalEdicao) {
      console.warn("Modal de edição de evento pequeno não encontrado.");
      return;
    }
    const local =
      card.querySelector(".calendario-small-card-local")?.textContent.trim() ||
      "";
    const participantes =
      card
        .querySelector(".calendario-small-card-partcipantes")
        ?.textContent.trim() || "";
    const duracao =
      card
        .querySelector(".calendario-small-card-duracao")
        ?.textContent.trim() || "";

    modalEdicao.querySelector("#inputLocalEventoSmall").value = local;
    modalEdicao.querySelector("#inputParticipantesEventoSmall").value =
      participantes;
    modalEdicao.querySelector("#inputDuracaoEventoSmall").value = duracao;

    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-evento-small-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () => fecharModalEdicaoEventoSmall(modalEdicao);
    }
  };

  const fecharModalEdicaoEventoSmall = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  };

  const abrirModalEdicaoEventoLarge = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoEventoLarge");
    if (!modalEdicao) {
      console.warn("Modal de edição de evento grande não encontrado.");
      return;
    }
    const titulo =
      card.querySelector(".calendario-large-card-titulo")?.textContent.trim() ||
      "";
    const descricao =
      card
        .querySelector(".calendario-large-card-descricao")
        ?.textContent.trim() || "";
    const data =
      card.querySelector(".calendario-large-card-data")?.textContent.trim() ||
      "";

    modalEdicao.querySelector("#inputTituloEventoLarge").value = titulo;
    modalEdicao.querySelector("#inputDescricaoEventoLarge").value = descricao;
    modalEdicao.querySelector("#inputDataEventoLarge").value = data;

    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-evento-large-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () => fecharModalEdicaoEventoLarge(modalEdicao);
    }
  };

  const fecharModalEdicaoEventoLarge = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  };

  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation();
    if (tipo === "evento_small") {
      window.location.href = "exibir-evento-small.html";
    } else if (tipo === "evento_large") {
      window.location.href = "exibir-evento-large.html";
    }
  };

  const adicionarOuvintesEventoSmall = () => {
    if (listaDeCardsEventoSmallContainer) {
      listaDeCardsEventoSmallContainer.addEventListener(
        "click",
        exibirDetalhesEventoSmall
      );
    } else {
      document.addEventListener("click", exibirDetalhesEventoSmall);
      console.warn(
        "Contêiner '.lista-de-cards-evento-small-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  const adicionarOuvintesEventoLarge = () => {
    if (listaDeCardsEventoLargeContainer) {
      listaDeCardsEventoLargeContainer.addEventListener(
        "click",
        exibirDetalhesEventoLarge
      );
    } else {
      document.addEventListener("click", exibirDetalhesEventoLarge);
      console.warn(
        "Contêiner '.lista-de-cards-evento-large-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicializa os ouvintes de eventos
  adicionarOuvintesEventoSmall();
  adicionarOuvintesEventoLarge();
});
