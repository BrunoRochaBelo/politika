document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsContainer = document.querySelector(
    ".lista-de-cards-despesas-container"
  ); // Substitua pelo seletor correto do contêiner dos cartões de despesas

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
   * Função para fechar todos os cartões de despesas expandidos
   */
  const fecharTodosOsCardsDespesa = () => {
    const cardsExpandidos = listaDeCardsContainer
      ? listaDeCardsContainer.querySelectorAll(".despesas-medium-card-expanded")
      : document.querySelectorAll(".despesas-medium-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("despesas-medium-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".despesas-medium-card-cnpj_cpf_for, .despesas-medium-card-nome_fornecedor, .despesas-medium-card-ordenador_despesa, .despesas-medium-card-autor, .despesas-medium-card-data_criacao, .despesas-medium-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheDespesa");
      });
    });
  };

  /**
   * Função para lidar com o clique nos cartões de despesas usando delegação de eventos
   * @param {Event} event
   */
  const exibirDetalhesDespesa = (event) => {
    const card = event.target.closest(".despesas-medium-card");
    if (!card) return;

    // **Nova Verificação: Se o clique está dentro de '.despesas-medium-card-editar', não faz nada**
    if (event.target.closest(".despesas-medium-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, abrir o modal de edição
    if (event.target.closest(".btn-editar-despesa")) {
      abrirModalEdicaoDespesa(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesDespesa
      return;
    }

    // Se o clique for no botão visualizar, redirecionar
    if (event.target.closest("#btnVisualizarDespesa")) {
      lidarComBtnVisualizar(event, "despesa");
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".despesas-medium-card-cnpj_cpf_for, .despesas-medium-card-nome_fornecedor, .despesas-medium-card-ordenador_despesa, .despesas-medium-card-autor, .despesas-medium-card-data_criacao, .despesas-medium-card-editar"
    );

    const isExpanded = card.classList.contains("despesas-medium-card-expanded");

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("despesas-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheDespesa");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsDespesa();

      // Expande o cartão clicado
      card.classList.add("despesas-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheDespesa");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  /**
   * Função para abrir o modal de edição de despesa
   * @param {HTMLElement} card
   */
  const abrirModalEdicaoDespesa = (card) => {
    const modalEdicao = document.getElementById("modalEdicaoDespesa");
    if (!modalEdicao) {
      console.warn("Modal de edição de despesa não encontrado.");
      return;
    }

    // Preencher o modal com os dados da despesa
    const cnpjCpfFor =
      card
        .querySelector(".despesas-medium-card-cnpj_cpf_for")
        ?.textContent.trim() || "";
    const nomeFornecedor =
      card
        .querySelector(".despesas-medium-card-nome_fornecedor")
        ?.textContent.trim() || "";
    const ordenadorDespesa =
      card
        .querySelector(".despesas-medium-card-ordenador_despesa")
        ?.textContent.trim() || "";
    const autor =
      card.querySelector(".despesas-medium-card-autor")?.textContent.trim() ||
      "";
    const dataCriacao =
      card
        .querySelector(".despesas-medium-card-data_criacao")
        ?.textContent.trim() || "";

    modalEdicao.querySelector("#inputCnpjCpfForDespesa").value = cnpjCpfFor;
    modalEdicao.querySelector("#inputNomeFornecedorDespesa").value =
      nomeFornecedor;
    modalEdicao.querySelector("#inputOrdenadorDespesa").value =
      ordenadorDespesa;
    modalEdicao.querySelector("#inputAutorDespesa").value = autor;
    modalEdicao.querySelector("#inputDataCriacaoDespesa").value = dataCriacao;

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-despesa-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoDespesaComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoDespesaComRemocao(modalEdicao)
      );
    }

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoDespesaComRemocao(modalEdicao);
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
    const fecharModalEdicaoDespesaComRemocao = (modal) => {
      fecharModalEdicaoDespesa(modal);
      removerOuvintesFechamento();
    };
  };

  /**
   * Função para fechar o modal de edição de despesa
   * @param {HTMLElement} modal
   */
  const fecharModalEdicaoDespesa = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Tempo igual ao de transição
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de despesa ("despesa")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    if (tipo === "despesa") {
      window.location.href = "exibir-despesa.html"; // Redireciona para a página de visualização de despesa
    }
    // Adicione mais condições se houver outros tipos de despesas
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de despesas
   */
  const adicionarOuvintesDespesa = () => {
    if (listaDeCardsContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsContainer.addEventListener("click", (event) => {
        // **Nova Verificação: Se o clique está dentro de '.despesas-medium-card-editar', não faz nada adicional**
        const btnEditar = event.target.closest(".despesas-medium-card-editar");
        if (btnEditar) {
          // Adicione aqui a lógica para editar a despesa
          // Por exemplo, abrir o modal de edição
          const card = btnEditar.closest(".despesas-medium-card");
          if (card) {
            abrirModalEdicaoDespesa(card);
          }
          event.stopPropagation(); // Evita a execução de exibirDetalhesDespesa
          return;
        }

        // Se o clique for em outros elementos, chama a função para exibir detalhes da despesa
        exibirDetalhesDespesa(event);
      });
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", (event) => {
        const btnEditar = event.target.closest(".despesas-medium-card-editar");
        if (btnEditar) {
          // Adicione aqui a lógica para editar a despesa
          // Por exemplo, abrir o modal de edição
          const card = btnEditar.closest(".despesas-medium-card");
          if (card) {
            abrirModalEdicaoDespesa(card);
          }
          event.stopPropagation(); // Evita a execução de exibirDetalhesDespesa
          return;
        }

        // Se o clique for em outros elementos, chama a função para exibir detalhes da despesa
        exibirDetalhesDespesa(event);
      });
      console.warn(
        "Contêiner '.lista-de-cards-despesas-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades
  adicionarOuvintesDespesa();
});
