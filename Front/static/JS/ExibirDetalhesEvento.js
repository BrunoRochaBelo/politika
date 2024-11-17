document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContentSmall = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  const areaTemplateContentLarge = document.querySelector(
    ".container-abas-template-content"
  );

  const listaDeCardsEventoSmallContainer = document.querySelector(
    ".lista-de-cards-evento-small-container"
  );
  const listaDeCardsEventoLargeContainer = document.querySelector(
    ".lista-de-cards-evento-large-container"
  );

  /**
   * Função para ajustar o scroll para centralizar o cartão
   * @param {HTMLElement} card - O cartão que deve ser centralizado
   * @param {HTMLElement} areaTemplateContent - Área de conteúdo relevante para o scroll
   */
  const ajustarScrollParaCentralizarCard = (card, areaTemplateContent) => {
    if (!areaTemplateContent) return;

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

    // **Nova Verificação: Se o clique está dentro de '.calendario-small-card-editar', não faz nada**
    if (event.target.closest(".calendario-small-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, abrir o modal de edição
    if (event.target.closest(".btn-editar-evento-small")) {
      abrirModalEdicaoEventoSmall(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesEventoSmall
      return;
    }

    // Se o clique for no botão visualizar, redirecionar
    if (event.target.closest("#btnVisualizarEventoSmall")) {
      lidarComBtnVisualizar(event, "evento_small");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".calendario-small-card-local, .calendario-small-card-partcipantes, .calendario-small-card-duracao, .calendario-small-card-editar"
    );

    const isExpanded = card.classList.contains(
      "calendario-small-card-expanded"
    );

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("calendario-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheEvento");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsEvento();

      // Expande o cartão clicado
      card.classList.add("calendario-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheEvento");
      });

      // Ajusta o scroll para centralizar o cartão
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

    // **Nova Verificação: Se o clique está dentro de '.calendario-large-card-editar', não faz nada**
    if (event.target.closest(".calendario-large-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, abrir o modal de edição
    if (event.target.closest(".btn-editar-evento-large")) {
      abrirModalEdicaoEventoLarge(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesEventoLarge
      return;
    }

    // Se o clique for no botão visualizar, redirecionar
    if (event.target.closest("#btnVisualizarEventoLarge")) {
      lidarComBtnVisualizar(event, "evento_large");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const editar = card.querySelector(".calendario-large-card-editar");

    if (!editar) return;

    const isExpanded = card.classList.contains(
      "calendario-large-card-expanded"
    );

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("calendario-large-card-expanded");
      editar.classList.remove("exibirDetalheEvento");
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsEvento();

      // Expande o cartão clicado
      card.classList.add("calendario-large-card-expanded");
      editar.classList.add("exibirDetalheEvento");

      // Ajusta o scroll para centralizar o cartão
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

    // Preencher o modal com os dados do evento pequeno
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

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
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

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoEventoSmallComRemocao(modalEdicao);
      }
    };

    window.addEventListener("click", fecharAoClicarFora);
    window.addEventListener("touchstart", fecharAoClicarFora);

    // Remover os ouvintes após fechar para evitar múltiplas chamadas
    const removerOuvintesFechamento = () => {
      window.removeEventListener("click", fecharAoClicarFora);
      window.removeEventListener("touchstart", fecharAoClicarFora);
    };

    // Modificar a função de fechamento para remover os ouvintes
    const fecharModalEdicaoEventoSmallComRemocao = (modal) => {
      fecharModalEdicaoEventoSmall(modal);
      removerOuvintesFechamento();
    };

    // Atualizar os ouvintes para usar a nova função
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
    }, 500); // Tempo igual ao de transição
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

    // Preencher o modal com os dados do evento grande
    // Adicione aqui os campos específicos do evento grande conforme necessário
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

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
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

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoEventoLargeComRemocao(modalEdicao);
      }
    };

    window.addEventListener("click", fecharAoClicarFora);
    window.addEventListener("touchstart", fecharAoClicarFora);

    // Remover os ouvintes após fechar para evitar múltiplas chamadas
    const removerOuvintesFechamento = () => {
      window.removeEventListener("click", fecharAoClicarFora);
      window.removeEventListener("touchstart", fecharAoClicarFora);
    };

    // Modificar a função de fechamento para remover os ouvintes
    const fecharModalEdicaoEventoLargeComRemocao = (modal) => {
      fecharModalEdicaoEventoLarge(modal);
      removerOuvintesFechamento();
    };

    // Atualizar os ouvintes para usar a nova função
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
    }, 500); // Tempo igual ao de transição
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de evento ("evento_small" ou "evento_large")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    if (tipo === "evento_small") {
      window.location.href = "exibir-evento-small.html"; // Redireciona para a página de visualização de evento pequeno
    } else if (tipo === "evento_large") {
      window.location.href = "exibir-evento-large.html"; // Redireciona para a página de visualização de evento grande
    }
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de evento pequeno
   */
  const adicionarOuvintesEventoSmall = () => {
    if (listaDeCardsEventoSmallContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsEventoSmallContainer.addEventListener(
        "click",
        exibirDetalhesEventoSmall
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
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
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsEventoLargeContainer.addEventListener(
        "click",
        exibirDetalhesEventoLarge
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
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
