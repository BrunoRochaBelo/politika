document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsGrupoContainer = document.querySelector(
    ".lista-de-cards-grupo-container"
  ); // Substitua pelo seletor correto do contêiner dos cartões de grupo

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
   * Função para fechar todos os cartões de grupo expandidos
   */
  const fecharTodosOsCardsGrupo = () => {
    const cardsExpandidos = listaDeCardsGrupoContainer
      ? listaDeCardsGrupoContainer.querySelectorAll(
          ".grupo-small-card-expanded"
        )
      : document.querySelectorAll(".grupo-small-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("grupo-small-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".grupo-small-card-title, .grupo-small-card-func, .grupo-small-card-situacao, .grupo-small-card-desc, .grupo-small-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheGrupo");
      });
    });
  };

  /**
   * Função para lidar com o clique nos cartões de grupo usando delegação de eventos
   * @param {Event} event
   */
  const exibirDetalhesGrupo = (event) => {
    const card = event.target.closest(".grupo-small-card");
    if (!card) return;

    // **Nova Verificação: Se o clique está dentro de '.grupo-small-card-editar', não faz nada**
    if (event.target.closest(".grupo-small-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, abrir o modal de edição
    if (event.target.closest(".btn-editar-grupo")) {
      abrirModalEdicaoGrupo(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesGrupo
      return;
    }

    // Se o clique for no botão visualizar, redirecionar
    if (event.target.closest("#btnVisualizar")) {
      lidarComBtnVisualizar(event, "grupo");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".grupo-small-card-title, .grupo-small-card-func, .grupo-small-card-situacao, .grupo-small-card-desc, .grupo-small-card-editar"
    );

    const isExpanded = card.classList.contains("grupo-small-card-expanded");

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("grupo-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheGrupo");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsGrupo();

      // Expande o cartão clicado
      card.classList.add("grupo-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheGrupo");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  /**
   * Função para abrir o modal de edição do grupo
   * @param {HTMLElement} card
   */
  const abrirModalEdicaoGrupo = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoGrupo");
    if (!modalEdicao) {
      console.warn("Modal de edição do grupo não encontrado.");
      return;
    }

    // Preencher o modal com os dados do grupo
    const titulo =
      card.querySelector(".grupo-small-card-title")?.textContent.trim() || "";
    const funcao =
      card.querySelector(".grupo-small-card-func")?.textContent.trim() || "";
    const situacao =
      card.querySelector(".grupo-small-card-situacao")?.textContent.trim() ||
      "";
    const descricao =
      card.querySelector(".grupo-small-card-desc")?.textContent.trim() || "";

    modalEdicao.querySelector("#inputTituloGrupo").value = titulo;
    modalEdicao.querySelector("#inputFuncaoGrupo").value = funcao;
    modalEdicao.querySelector("#inputSituacaoGrupo").value = situacao;
    modalEdicao.querySelector("#inputDescricaoGrupo").value = descricao;

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-grupo-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoGrupoComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoGrupoComRemocao(modalEdicao)
      );
    }

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoGrupoComRemocao(modalEdicao);
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
    const fecharModalEdicaoGrupoComRemocao = (modal) => {
      fecharModalEdicaoGrupo(modal);
      removerOuvintesFechamento();
    };
  };

  /**
   * Função para fechar o modal de edição do grupo
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoGrupo = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Tempo igual ao de transição
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de grupo ("grupo")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    if (tipo === "grupo") {
      window.location.href = "exibir-grupo.html"; // Redireciona para a página de visualização de grupo
    }
    // Adicione mais condições se houver outros tipos de grupos
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de grupo
   */
  const adicionarOuvintesGrupo = () => {
    if (listaDeCardsGrupoContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsGrupoContainer.addEventListener("click", exibirDetalhesGrupo);
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesGrupo);
      console.warn(
        "Contêiner '.lista-de-cards-grupo-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades
  adicionarOuvintesGrupo();
});
