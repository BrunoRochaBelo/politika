document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsPleitoContainer = document.querySelector(
    ".lista-de-cards-pleito-container"
  ); // Substitua pelo seletor correto do contêiner dos cartões de pleitos

  // Função para ajustar o scroll para centralizar o cartão
  const ajustarScrollParaCentralizarCard = (card) => {
    if (!areaTemplateContent) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Função para fechar todos os cartões de pleito expandidos
  const fecharTodosOsCardsPleito = () => {
    const cardsExpandidos = listaDeCardsPleitoContainer
      ? listaDeCardsPleitoContainer.querySelectorAll(
          ".pleitos-medium-card-expanded"
        )
      : document.querySelectorAll(".pleitos-medium-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("pleitos-medium-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".pleitos-medium-card-beneficiario, .pleitos-medium-card-uf, .pleitos-medium-card-cidade, .pleitos-medium-card-bairro, .pleitos-medium-card-rua, .pleitos-medium-card-autor, .pleitos-medium-card-dataCriacao, .pleitos-medium-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalhePleito");
      });
    });
  };

  // Função para lidar com o clique nos cartões de pleito usando delegação de eventos
  const exibirDetalhesPleito = (event) => {
    const card = event.target.closest(".pleitos-medium-card");
    if (!card) return;

    // **Nova Verificação: Se o clique está dentro de '.pleitos-medium-card-editar', não faz nada**
    if (event.target.closest(".pleitos-medium-card-editar")) {
      // Não executa a lógica de expansão/recolhimento
      return;
    }

    // Se o clique for no botão de edição, adicione a lógica correspondente aqui
    if (event.target.closest(".btn-editar-pleito")) {
      // Adicione aqui a lógica para editar o pleito
      // Por exemplo, abrir um modal de edição
      abrirModalEdicaoPleito(card);
      event.stopPropagation(); // Impede a execução de exibirDetalhesPleito
      return;
    }

    // Previne a ação padrão
    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".pleitos-medium-card-beneficiario, .pleitos-medium-card-uf, .pleitos-medium-card-cidade, .pleitos-medium-card-bairro, .pleitos-medium-card-rua, .pleitos-medium-card-autor, .pleitos-medium-card-dataCriacao, .pleitos-medium-card-editar"
    );

    const isExpanded = card.classList.contains("pleitos-medium-card-expanded");

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("pleitos-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalhePleito");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsPleito();

      // Expande o cartão clicado
      card.classList.add("pleitos-medium-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalhePleito");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  // Função para abrir o modal de edição do pleito (Exemplo)
  const abrirModalEdicaoPleito = (card) => {
    // Implementar a lógica para abrir o modal de edição
    // Por exemplo:
    const modalEdicao = document.getElementById("modalEdicaoPleito");
    if (!modalEdicao) {
      console.warn("Modal de edição do pleito não encontrado.");
      return;
    }

    // Preencher o modal com os dados do pleito
    const beneficiario =
      card
        .querySelector(".pleitos-medium-card-beneficiario")
        ?.textContent.trim() || "";
    const uf =
      card.querySelector(".pleitos-medium-card-uf")?.textContent.trim() || "";
    const cidade =
      card.querySelector(".pleitos-medium-card-cidade")?.textContent.trim() ||
      "";
    const bairro =
      card.querySelector(".pleitos-medium-card-bairro")?.textContent.trim() ||
      "";
    const rua =
      card.querySelector(".pleitos-medium-card-rua")?.textContent.trim() || "";
    const autor =
      card.querySelector(".pleitos-medium-card-autor")?.textContent.trim() ||
      "";
    const dataCriacao =
      card
        .querySelector(".pleitos-medium-card-dataCriacao")
        ?.textContent.trim() || "";

    modalEdicao.querySelector("#inputBeneficiarioPleito").value = beneficiario;
    modalEdicao.querySelector("#inputUFPleito").value = uf;
    modalEdicao.querySelector("#inputCidadePleito").value = cidade;
    modalEdicao.querySelector("#inputBairroPleito").value = bairro;
    modalEdicao.querySelector("#inputRuaPleito").value = rua;
    modalEdicao.querySelector("#inputAutorPleito").value = autor;
    modalEdicao.querySelector("#inputDataCriacaoPleito").value = dataCriacao;

    // Exibir o modal
    modalEdicao.style.display = "flex";
    setTimeout(() => {
      modalEdicao.classList.add("show");
    }, 10);

    // Adicionar ouvintes de eventos para fechar o modal
    const btnFecharModal = modalEdicao.querySelector(
      ".modal-edicao-pleito-close"
    );
    if (btnFecharModal) {
      btnFecharModal.onclick = () => fecharModalEdicaoPleito(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoPleito(modalEdicao)
      );
    }

    // Fechar o modal ao clicar fora dele
    const fecharAoClicarFora = (event) => {
      if (event.target === modalEdicao) {
        fecharModalEdicaoPleito(modalEdicao);
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
    const fecharModalEdicaoPleitoComRemocao = (modal) => {
      fecharModalEdicaoPleito(modal);
      removerOuvintesFechamento();
    };

    // Atualizar os ouvintes para usar a nova função
    if (btnFecharModal) {
      btnFecharModal.onclick = () =>
        fecharModalEdicaoPleitoComRemocao(modalEdicao);
      btnFecharModal.addEventListener("touchstart", () =>
        fecharModalEdicaoPleitoComRemocao(modalEdicao)
      );
    }
  };

  // Função para fechar o modal de edição do pleito
  const fecharModalEdicaoPleito = (modal) => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Tempo igual ao de transição
  };

  // Função para adicionar ouvintes de eventos aos cartões de pleito
  const adicionarOuvintesPleito = () => {
    if (listaDeCardsPleitoContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsPleitoContainer.addEventListener(
        "click",
        exibirDetalhesPleito
      );
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", exibirDetalhesPleito);
      console.warn(
        "Contêiner '.lista-de-cards-pleito-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades
  adicionarOuvintesPleito();
});
