document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores do template original
  const areaTemplateContentSmall = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  const areaTemplateContentLarge = document.querySelector(
    ".container-abas-template-content"
  );
  // Cache do container do template solo (fallback)
  const areaTemplateContentSolo = document.querySelector(
    ".area-interna-containerContent-template-content"
  );

  // Cache dos containers dos cards, se existirem
  const listaDeCardsEventoSmallContainer = document.querySelector(
    ".lista-de-cards-evento-small-container"
  );
  const listaDeCardsEventoLargeContainer = document.querySelector(
    ".lista-de-cards-evento-large-container"
  );

  /**
   * Função para ajustar o scroll para centralizar o cartão.
   * Se não for informado um container específico, usa o container do template solo.
   * @param {HTMLElement} card - O cartão que deve ser centralizado
   * @param {HTMLElement} areaTemplateContent - Área de conteúdo para o scroll
   */
  const ajustarScrollParaCentralizarCard = (card, areaTemplateContent) => {
    // Usa o container específico ou o fallback do template solo
    const container = areaTemplateContent || areaTemplateContentSolo;
    if (!container) return;
    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /**
   * Função para fechar todos os cartões de evento expandidos
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
   * Função para lidar com o clique nos cartões de evento pequeno usando delegação de eventos
   * @param {Event} event
   */
  const exibirDetalhesEventoSmall = (event) => {
    const card = event.target.closest(".calendario-small-card");
    if (!card) return;

    // Se o clique estiver dentro do elemento de edição, não faz nada
    if (event.target.closest(".calendario-small-card-editar")) {
      return;
    }

    // Se for o botão de edição, abre o modal de edição
    if (event.target.closest(".btn-editar-evento-small")) {
      abrirModalEdicaoEventoSmall(card);
      event.stopPropagation();
      return;
    }

    // Se for o botão de visualizar, redireciona
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
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheEvento");
      });
    } else {
      fecharTodosOsCardsEvento();
      card.classList.add("calendario-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheEvento");
      });
      // Usa o container do template original ou, se não existir, o solo
      ajustarScrollParaCentralizarCard(card, areaTemplateContentSmall);
    }
  };

  /**
   * Função para lidar com o clique nos cartões de evento grande usando delegação de eventos
   * @param {Event} event
   */
  const exibirDetalhesEventoLarge = (event) => {
    const card = event.target.closest(".calendario-large-card");
    if (!card) return;

    if (event.target.closest(".calendario-large-card-editar")) {
      return;
    }

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
      ajustarScrollParaCentralizarCard(card, areaTemplateContentLarge);
    }
  };

  /**
   * Função para abrir o modal de edição de evento pequeno
   * @param {HTMLElement} card
   */
  const abrirModalEdicaoEventoSmall = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoEventoSmall");
    if (!modalEdicao) {
      console.warn("Modal de edição de evento pequeno não encontrado.");
      return;
    }

    // Preenche os campos do modal com os dados do cartão
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
      btnFecharModal.onclick = () =>
        fecharModalEdicaoEventoSmallComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoEventoSmallComRemocao(modalEdicao)
      );
    }

    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoEventoSmallComRemocao(modalEdicao);
      }
    };

    window.addEventListener("click", fecharAoClicarFora);
    window.addEventListener("touchstart", fecharAoClicarFora);

    const removerOuvintesFechamento = () => {
      window.removeEventListener("click", fecharAoClicarFora);
      window.removeEventListener("touchstart", fecharAoClicarFora);
    };

    const fecharModalEdicaoEventoSmallComRemocao = (modal) => {
      fecharModalEdicaoEventoSmall(modal);
      removerOuvintesFechamento();
    };

    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoEventoSmallComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoEventoSmallComRemocao(modalEdicao)
      );
    }
  };

  /**
   * Função para fechar o modal de edição de evento pequeno
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoEventoSmall = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  };

  /**
   * Função para abrir o modal de edição de evento grande
   * @param {HTMLElement} card
   */
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
      btnFecharModal.onclick = () =>
        fecharModalEdicaoEventoLargeComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoEventoLargeComRemocao(modalEdicao)
      );
    }

    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoEventoLargeComRemocao(modalEdicao);
      }
    };

    window.addEventListener("click", fecharAoClicarFora);
    window.addEventListener("touchstart", fecharAoClicarFora);

    const removerOuvintesFechamento = () => {
      window.removeEventListener("click", fecharAoClicarFora);
      window.removeEventListener("touchstart", fecharAoClicarFora);
    };

    const fecharModalEdicaoEventoLargeComRemocao = (modal) => {
      fecharModalEdicaoEventoLarge(modal);
      removerOuvintesFechamento();
    };

    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoEventoLargeComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoEventoLargeComRemocao(modalEdicao)
      );
    }
  };

  /**
   * Função para fechar o modal de edição de evento grande
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoEventoLarge = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de evento ("evento_small" ou "evento_large")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation();
    if (tipo === "evento_small") {
      window.location.href = "exibir-evento-small.html";
    } else if (tipo === "evento_large") {
      window.location.href = "exibir-evento-large.html";
    }
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de evento pequeno
   */
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

  /**
   * Função para adicionar ouvintes de eventos aos cartões de evento grande
   */
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

  // Inicialização das funcionalidades
  adicionarOuvintesEventoSmall();
  adicionarOuvintesEventoLarge();
});
