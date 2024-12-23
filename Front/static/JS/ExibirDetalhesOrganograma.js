document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".container-template-content"
  );

  // Contêiner dos cartões de organograma
  const listaDeCardsOrganogramaContainer =
    document.querySelector("#listaOrganogramas");

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
   * Função para fechar todos os cartões de organograma expandidos
   */
  const fecharTodosOsCardsOrganograma = () => {
    const cardsExpandidos = listaDeCardsOrganogramaContainer
      ? listaDeCardsOrganogramaContainer.querySelectorAll(
          ".organograma-medium-card-expanded"
        )
      : document.querySelectorAll(".organograma-medium-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("organograma-medium-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".organograma-medium-card-info-pub, .organograma-medium-card-nivel-nivel-hierarquia, .organograma-medium-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheOrganograma");
      });
    });
  };

  /**
   * Função para lidar com o clique nos cartões de organograma
   * @param {Event} event
   */
  const exibirDetalhesOrganograma = (event) => {
    const card = event.target.closest(".organograma-medium-card");
    if (!card) return;

    // Verifica se o clique está dentro de '.organograma-medium-card-editar', não faz nada
    if (event.target.closest(".organograma-medium-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão "Alterar", redireciona
    if (event.target.closest(".btn-outline-principal")) {
      // Ação já está definida no onclick do botão
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".organograma-medium-card-info-pub, .organograma-medium-card-nivel-nivel-hierarquia, .organograma-medium-card-editar"
    );

    const isExpanded = card.classList.contains(
      "organograma-medium-card-expanded"
    );

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("organograma-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheOrganograma");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsOrganograma();

      // Expande o cartão clicado
      card.classList.add("organograma-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheOrganograma");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  /**
   * Função para lidar com o clique no botão "Visualizar"
   * @param {Event} event
   * @param {string} tipo - Tipo de organograma ("organograma_medium")
   */
  const lidarComBtnVisualizar = (event, tipo) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    if (tipo === "organograma_medium") {
      window.location.href = "exibir-organograma-medium.html"; // Redireciona para a página de visualização de organograma médio
    }
    // Adicione outros tipos se necessário
  };

  /**
   * Função para adicionar ouvintes de eventos aos cartões de organograma médio
   */
  const adicionarOuvintesOrganogramaMedium = () => {
    if (listaDeCardsOrganogramaContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsOrganogramaContainer.addEventListener(
        "click",
        exibirDetalhesOrganograma
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesOrganograma);
      console.warn(
        "Contêiner '#listaOrganogramas' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades
  adicionarOuvintesOrganogramaMedium();
});

document.addEventListener("DOMContentLoaded", () => {
  // Seleciona o contêiner dos cards largos
  const listaDeCardsOrganogramaLargeContainer = document.querySelector(
    "#listaOrganogramasLarge"
  );

  /**
   * Função para ajustar o scroll e centralizar o card largo expandido
   * @param {HTMLElement} card - O card que deve ser centralizado
   */
  const ajustarScrollParaCentralizarCardLarge = (card) => {
    const areaTemplateContent = document.querySelector(
      ".container-template-content"
    );
    if (!areaTemplateContent) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /**
   * Função para fechar todos os cards largos que estão expandidos
   */
  const fecharTodosOsCardsOrganogramaLarge = () => {
    const cardsExpandidos = listaDeCardsOrganogramaLargeContainer
      ? listaDeCardsOrganogramaLargeContainer.querySelectorAll(
          ".organograma-large-card-expanded"
        )
      : document.querySelectorAll(".organograma-large-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("organograma-large-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".organograma-large-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheOrganogramaCardLarge");
      });
    });
  };

  /**
   * Função para lidar com o clique nos cards largos de organograma
   * @param {Event} event
   */
  const exibirDetalhesOrganogramaLarge = (event) => {
    const card = event.target.closest(".organograma-large-card");
    if (!card) return;

    // Verifica se o clique está dentro de '.organograma-large-card-editar'; se sim, não faz nada
    if (event.target.closest(".organograma-large-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão "Alterar", redireciona
    if (event.target.closest(".btn-outline-principal")) {
      // Ação já está definida no onclick do botão
      return;
    }

    // Previne a ação padrão do link
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".organograma-large-card-editar"
    );

    const isExpanded = card.classList.contains(
      "organograma-large-card-expanded"
    );

    if (isExpanded) {
      // Fecha o card clicado
      card.classList.remove("organograma-large-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheOrganogramaCardLarge");
      });
    } else {
      // Fecha quaisquer cards expandidos
      fecharTodosOsCardsOrganogramaLarge();

      // Expande o card clicado
      card.classList.add("organograma-large-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheOrganogramaCardLarge");
      });

      // Ajusta o scroll para centralizar o card
      ajustarScrollParaCentralizarCardLarge(card);
    }
  };

  /**
   * Função para lidar com o clique no botão "Visualizar" para cards largos
   * @param {Event} event
   * @param {string} tipo - Tipo de organograma ("organograma_large")
   */
  const lidarComBtnVisualizarLarge = (event, tipo) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    if (tipo === "organograma_large") {
      window.location.href = "exibir-organograma-large.html"; // Redireciona para a página de visualização de organograma largo
    }
    // Adicione outros tipos se necessário
  };

  /**
   * Função para adicionar ouvintes de eventos aos cards largos de organograma
   */
  const adicionarOuvintesOrganogramaLarge = () => {
    if (listaDeCardsOrganogramaLargeContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsOrganogramaLargeContainer.addEventListener(
        "click",
        exibirDetalhesOrganogramaLarge
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesOrganogramaLarge);
      console.warn(
        "Contêiner '#listaOrganogramasLarge' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades para os cards largos
  adicionarOuvintesOrganogramaLarge();
});
