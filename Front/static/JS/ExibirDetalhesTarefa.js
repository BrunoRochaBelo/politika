document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );

  // Contêineres dos cartões de tarefa
  const listaDeCardsTarefaPequenaContainer = document.querySelector(
    ".lista-de-cards-tarefa-pequena-container"
  );
  const listaDeCardsTarefaMediumContainer = document.querySelector(
    ".lista-de-cards-tarefa-medium-container"
  );

  /**
   * Função para ajustar o scroll para centralizar o cartão
   * @param {HTMLElement} card - O cartão que deve ser centralizado
   */
  const ajustarScrollParaCentralizarCard = (card) => {
    if (!areaTemplateContent) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /**
   * Função para fechar todos os cartões de tarefa pequena expandidos
   */
  const fecharTodosOsCardsTarefaPequena = () => {
    const cardsExpandidos = listaDeCardsTarefaPequenaContainer
      ? listaDeCardsTarefaPequenaContainer.querySelectorAll(
          ".tarefa-small-card-expanded"
        )
      : document.querySelectorAll(".tarefa-small-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("tarefa-small-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".tarefa-small-card-desc, .tarefa-small-card-resp, .tarefa-small-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheTarefa");
      });
    });
  };

  /**
   * Função para fechar todos os cartões de tarefa médio expandidos
   */
  const fecharTodosOsCardsTarefaMedium = () => {
    const cardsExpandidos = listaDeCardsTarefaMediumContainer
      ? listaDeCardsTarefaMediumContainer.querySelectorAll(
          ".tarefa-medium-card-expanded"
        )
      : document.querySelectorAll(".tarefa-medium-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("tarefa-medium-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".tarefa-medium-card-resp, .tarefa-medium-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheTarefa");
      });
    });
  };

  /**
   * Função para lidar com o clique nos cartões de tarefa pequena
   * @param {Event} event
   */
  const exibirDetalhesTarefaPequena = (event) => {
    const card = event.target.closest(".tarefa-small-card");
    if (!card) return;

    // **Nova Verificação: Se o clique está dentro de '.tarefa-small-card-editar' ou '.tarefa-medium-card-desc-pleito-link', não faz nada**
    if (
      event.target.closest(".tarefa-small-card-editar") ||
      event.target.closest(".tarefa-medium-card-desc-pleito-link")
    ) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, abrir o modal de edição
    if (event.target.closest(".btn-editar-tarefa-pequena")) {
      abrirModalEdicaoTarefaPequena(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesTarefaPequena
      return;
    }

    // Se o clique for no botão visualizar, redirecionar
    if (event.target.closest("#btnVisualizar")) {
      lidarComBtnVisualizar(event, "tarefa_pequena");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".tarefa-small-card-desc, .tarefa-small-card-resp, .tarefa-small-card-editar"
    );

    const isExpanded = card.classList.contains("tarefa-small-card-expanded");

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("tarefa-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheTarefa");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsTarefaPequena();

      // Expande o cartão clicado
      card.classList.add("tarefa-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheTarefa");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  /**
   * Função para lidar com o clique nos cartões de tarefa médio
   * @param {Event} event
   */
  const exibirDetalhesTarefaMedium = (event) => {
    const card = event.target.closest(".tarefa-medium-card");
    if (!card) return;

    // **Nova Verificação: Se o clique está dentro de '.tarefa-medium-card-editar' ou '.tarefa-medium-card-desc-pleito-link', não faz nada**
    if (
      event.target.closest(".tarefa-medium-card-editar") ||
      event.target.closest(".tarefa-medium-card-desc-pleito-link")
    ) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, abrir o modal de edição
    if (event.target.closest(".btn-editar-tarefa-medium")) {
      abrirModalEdicaoTarefaMedium(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesTarefaMedium
      return;
    }

    // Se o clique for no botão visualizar, redirecionar
    if (event.target.closest("#btnVisualizar")) {
      lidarComBtnVisualizar(event, "tarefa_medium");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".tarefa-medium-card-resp, .tarefa-medium-card-editar"
    );

    const isExpanded = card.classList.contains("tarefa-medium-card-expanded");

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("tarefa-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheTarefa");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsTarefaMedium();

      // Expande o cartão clicado
      card.classList.add("tarefa-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheTarefa");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  /**
   * Função para abrir o modal de edição de tarefa pequena
   * @param {HTMLElement} card
   */
  const abrirModalEdicaoTarefaPequena = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoTarefaPequena");
    if (!modalEdicao) {
      console.warn("Modal de edição de tarefa pequena não encontrado.");
      return;
    }

    // Preencher o modal com os dados da tarefa pequena
    const desc =
      card.querySelector(".tarefa-small-card-desc")?.textContent.trim() || "";
    const resp =
      card.querySelector(".tarefa-small-card-resp")?.textContent.trim() || "";

    modalEdicao.querySelector("#inputDescTarefaPequena").value = desc;
    modalEdicao.querySelector("#inputRespTarefaPequena").value = resp;

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-tarefa-pequena-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoTarefaPequenaComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoTarefaPequenaComRemocao(modalEdicao)
      );
    }

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoTarefaPequena(modalEdicao);
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
    const fecharModalEdicaoTarefaPequenaComRemocao = (modal) => {
      fecharModalEdicaoTarefaPequena(modal);
      removerOuvintesFechamento();
    };
  };

  /**
   * Função para fechar o modal de edição de tarefa pequena
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoTarefaPequena = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Tempo igual ao de transição
  };

  /**
   * Função para abrir o modal de edição de tarefa média
   * @param {HTMLElement} card
   */
  const abrirModalEdicaoTarefaMedium = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoTarefaMedium");
    if (!modalEdicao) {
      console.warn("Modal de edição de tarefa média não encontrado.");
      return;
    }

    // Preencher o modal com os dados da tarefa média
    const resp =
      card.querySelector(".tarefa-medium-card-resp")?.textContent.trim() || "";

    modalEdicao.querySelector("#inputRespTarefaMedium").value = resp;

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-tarefa-medium-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoTarefaMediumComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoTarefaMediumComRemocao(modalEdicao)
      );
    }

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoTarefaMedium(modalEdicao);
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
    const fecharModalEdicaoTarefaMediumComRemocao = (modal) => {
      fecharModalEdicaoTarefaMedium(modal);
      removerOuvintesFechamento();
    };
  };

  /**
   * Função para fechar o modal de edição de tarefa média
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoTarefaMedium = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Tempo igual ao de transição
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de tarefa ("tarefa_pequena" ou "tarefa_medium")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    if (tipo === "tarefa_pequena") {
      window.location.href = "exibir-tarefa-pequena.html"; // Redireciona para a página de visualização de tarefa pequena
    } else if (tipo === "tarefa_medium") {
      window.location.href = "exibir-tarefa-medium.html"; // Redireciona para a página de visualização de tarefa média
    }
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de tarefa pequena
   */
  const adicionarOuvintesTarefaPequena = () => {
    if (listaDeCardsTarefaPequenaContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsTarefaPequenaContainer.addEventListener(
        "click",
        exibirDetalhesTarefaPequena
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesTarefaPequena);
      console.warn(
        "Contêiner '.lista-de-cards-tarefa-pequena-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de tarefa média
   */
  const adicionarOuvintesTarefaMedium = () => {
    if (listaDeCardsTarefaMediumContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsTarefaMediumContainer.addEventListener(
        "click",
        exibirDetalhesTarefaMedium
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesTarefaMedium);
      console.warn(
        "Contêiner '.lista-de-cards-tarefa-medium-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades
  adicionarOuvintesTarefaPequena();
  adicionarOuvintesTarefaMedium();
});
