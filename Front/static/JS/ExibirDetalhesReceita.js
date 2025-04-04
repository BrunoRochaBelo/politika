document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsContainer = document.querySelector("#lista-receitas");

  /**
   * Função para ajustar o scroll e centralizar o cartão
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
   * Função para fechar todos os cartões de receita expandidos
   */
  const fecharTodosOsCardsReceita = () => {
    const cardsExpandidos = listaDeCardsContainer
      ? listaDeCardsContainer.querySelectorAll(".receitas-medium-card-expanded")
      : document.querySelectorAll(".receitas-medium-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("receitas-medium-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".receitas-medium-card-desc, .receitas-medium-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheReceita");
      });
    });
  };

  /**
   * Função para lidar com o clique nos cartões de receita usando delegação de eventos
   * @param {Event} event
   */
  const exibirDetalhesReceita = (event) => {
    const card = event.target.closest(".receitas-medium-card");
    if (!card) return;

    // Se o clique está dentro da área de edição, não faz nada
    if (event.target.closest(".receitas-medium-card-editar")) {
      return;
    }

    // Se o clique for no botão de edição (caso haja)
    if (event.target.closest(".btn-editar-receita")) {
      abrirModalEdicaoReceita(card);
      event.stopPropagation();
      return;
    }

    // Se o clique for no botão visualizar, redireciona
    if (event.target.closest("#btnVisualizarReceita")) {
      lidarComBtnVisualizar(event, "receita");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".receitas-medium-card-desc, .receitas-medium-card-editar"
    );

    const isExpanded = card.classList.contains("receitas-medium-card-expanded");

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("receitas-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheReceita");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsReceita();

      // Expande o cartão clicado
      card.classList.add("receitas-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheReceita");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  /**
   * Função para abrir o modal de edição de receita
   * @param {HTMLElement} card
   */
  const abrirModalEdicaoReceita = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoReceita");
    if (!modalEdicao) {
      console.warn("Modal de edição de receita não encontrado.");
      return;
    }

    // Preencher o modal com os dados da receita
    const nomeCredor =
      card
        .querySelector(".receitas-medium-card-nomeCredor")
        ?.textContent.trim() || "";
    const docIdCredor =
      card
        .querySelector(".receitas-medium-card-docIdCredor")
        ?.textContent.trim() || "";
    const anoEleitoral =
      card
        .querySelector(".receitas-medium-card-anoEleitoral")
        ?.textContent.trim() || "";
    const fonte =
      card.querySelector(".receitas-medium-card-fonte")?.textContent.trim() ||
      "";

    modalEdicao.querySelector("#inputNomeCredorReceita").value = nomeCredor;
    modalEdicao.querySelector("#inputDocIdCredorReceita").value = docIdCredor;
    modalEdicao.querySelector("#inputAnoEleitoralReceita").value = anoEleitoral;
    modalEdicao.querySelector("#inputFonteReceita").value = fonte;

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes para fechar o modal
    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-receita-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoReceitaComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoReceitaComRemocao(modalEdicao)
      );
    }

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoReceitaComRemocao(modalEdicao);
      }
    };

    window.addEventListener("click", fecharAoClicarFora);
    window.addEventListener("touchstart", fecharAoClicarFora);

    const removerOuvintesFechamento = () => {
      window.removeEventListener("click", fecharAoClicarFora);
      window.removeEventListener("touchstart", fecharAoClicarFora);
    };

    const fecharModalEdicaoReceitaComRemocao = (modal) => {
      fecharModalEdicaoReceita(modal);
      removerOuvintesFechamento();
    };
  };

  /**
   * Função para fechar o modal de edição de receita
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoReceita = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Tempo de transição
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de receita ("receita")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation(); // Evita a propagação do evento de clique
    if (tipo === "receita") {
      window.location.href = "exibir-receita.html"; // Redireciona para a página de visualização de receita
    }
    // Adicione mais condições se houver outros tipos
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de receita
   */
  const adicionarOuvintesReceita = () => {
    if (listaDeCardsContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsContainer.addEventListener("click", (event) => {
        // Se o clique estiver dentro da área de edição, trata como edição
        const btnEditar = event.target.closest(".receitas-medium-card-editar");
        if (btnEditar) {
          const card = btnEditar.closest(".receitas-medium-card");
          if (card) {
            abrirModalEdicaoReceita(card);
          }
          event.stopPropagation();
          return;
        }

        // Para outros cliques, exibe ou recolhe os detalhes
        exibirDetalhesReceita(event);
      });
    } else {
      // Se não encontrar o contêiner, delega a partir do documento
      document.addEventListener("click", (event) => {
        const btnEditar = event.target.closest(".receitas-medium-card-editar");
        if (btnEditar) {
          const card = btnEditar.closest(".receitas-medium-card");
          if (card) {
            abrirModalEdicaoReceita(card);
          }
          event.stopPropagation();
          return;
        }
        exibirDetalhesReceita(event);
      });
      console.warn(
        "Contêiner 'lista-receitas' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicializa as funcionalidades
  adicionarOuvintesReceita();
});
