document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsContainer = document.querySelector(
    ".lista-de-cards-despesas-container"
  ); // Substitua pelo seletor correto do contêiner dos cartões de despesas

  // Função para ajustar o scroll para centralizar o cartão
  const ajustarScrollParaCentralizarCard = (card) => {
    if (!areaTemplateContent) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Função para fechar todos os cartões de despesas expandidos
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

  // Função para lidar com o clique nos cartões de despesas usando delegação de eventos
  const exibirDetalhesDespesa = (event) => {
    const card = event.target.closest(".despesas-medium-card");
    if (!card) return;

    // Se o clique for no botão de edição, adicione a lógica correspondente aqui
    // Por exemplo:
    // if (event.target.classList.contains("despesas-medium-card-editar")) {
    //   abrirModalEdicao(card);
    //   return;
    // }

    // Previne a ação padrão apenas se o clique não for em um botão específico
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

  // Função para adicionar ouvintes de eventos aos cartões de despesas
  const adicionarOuvintesDespesa = () => {
    if (listaDeCardsContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsContainer.addEventListener("click", (event) => {
        // Evita que cliques em botões dentro do cartão acionem a expansão
        const btnEditar = event.target.closest(".despesas-medium-card-editar");
        if (btnEditar) {
          // Adicione aqui a lógica para editar a despesa
          // Por exemplo:
          // abrirModalEdicao(btnEditar.closest(".despesas-medium-card"));
          event.stopPropagation(); // Evita a execução de exibirDetalhesDespesa
          return;
        }

        // Chama a função para exibir detalhes da despesa
        exibirDetalhesDespesa(event);
      });
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", (event) => {
        const btnEditar = event.target.closest(".despesas-medium-card-editar");
        if (btnEditar) {
          // Adicione aqui a lógica para editar a despesa
          // Por exemplo:
          // abrirModalEdicao(btnEditar.closest(".despesas-medium-card"));
          event.stopPropagation(); // Evita a execução de exibirDetalhesDespesa
          return;
        }

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
