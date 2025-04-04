document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const modal = document.getElementById("modalEscolhaChamada");
  const btnChamadaNativa = document.getElementById("btnChamadaNativa");
  const btnChamadaWhatsApp = document.getElementById("btnChamadaWhatsApp");
  const closeModalElement = document.querySelector(
    ".modal-escolha-chamada-close"
  );
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsContainer = document.querySelector(
    ".lista-de-cards-container"
  ); // Substitua pelo seletor correto do contêiner dos cartões

  let currentContato = {
    numero: "",
    nome: "",
  };

  // Variáveis para controle do pressionar e segurar (long press)
  let longPressTimer;
  const longPressDuration = 500;
  let isLongPress = false;
  let touchStartTarget = null;

  // Função para iniciar a chamada telefônica nativa e registrar a ligação
  const iniciarChamadaTelefonica = (numero, nomeContato) => {
    const dataHora = new Date().toISOString();
    window.location.href = `tel:${numero}`;
    registrarLigacao(nomeContato, numero, dataHora);
  };

  // Função para iniciar uma chamada via WhatsApp e registrar a ligação
  const iniciarChamadaWhatsApp = (numero, nomeContato) => {
    const dataHora = new Date().toISOString();
    const numeroWhatsApp = numero.replace(/[^\d]/g, "");
    window.location.href = `https://wa.me/${numeroWhatsApp}`;
    registrarLigacao(nomeContato, numero, dataHora);
  };

  // Função para exibir o modal e permitir a escolha do tipo de chamada
  const exibirModalEscolhaChamada = (numero, nomeContato) => {
    currentContato.numero = numero;
    currentContato.nome = nomeContato;

    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      currentContato = { numero: "", nome: "" }; // Resetar contato atual
    }, 500); // Tempo igual ao de transição
  };

  // Função para redirecionar para a página de exibição de contato
  const redirecionarParaExibicaoContato = () => {
    window.location.href = "contato_exibir.html";
  };

  // Função para iniciar o temporizador de pressionar e segurar
  const iniciarLongPress = (event) => {
    // Evitar long press em elementos específicos
    if (
      event.target.closest(".contatos-small-card-call") ||
      event.target.closest(".contatos-small-card-editar") ||
      event.target.closest("#btnVisualizar")
    ) {
      return;
    }

    touchStartTarget = event.target.closest(".contatos-small-card");
    if (!touchStartTarget) return;

    isLongPress = false;

    longPressTimer = setTimeout(() => {
      isLongPress = true;
      // Fornece feedback visual (opcional)
      touchStartTarget.classList.add("long-press-active");
      setTimeout(() => {
        touchStartTarget.classList.remove("long-press-active");
        // Redireciona para a página de exibição do contato
        redirecionarParaExibicaoContato();
      }, 200);
    }, longPressDuration);
  };

  // Função para cancelar o temporizador de pressionar e segurar
  const cancelarLongPress = () => {
    clearTimeout(longPressTimer);
    if (touchStartTarget) {
      touchStartTarget.classList.remove("long-press-active");
    }
    touchStartTarget = null;
  };

  // Configuração inicial dos ouvintes de eventos do modal
  const configurarOuvintesModal = () => {
    // Ouvintes para os botões de chamada no modal
    btnChamadaNativa.addEventListener("click", () => {
      if (currentContato.numero && currentContato.nome) {
        iniciarChamadaTelefonica(currentContato.numero, currentContato.nome);
        fecharModal();
      }
    });

    btnChamadaWhatsApp.addEventListener("click", () => {
      if (currentContato.numero && currentContato.nome) {
        iniciarChamadaWhatsApp(currentContato.numero, currentContato.nome);
        fecharModal();
      }
    });

    // Ouvintes para fechar o modal
    closeModalElement.addEventListener("click", fecharModal);
    closeModalElement.addEventListener("touchstart", fecharModal);

    // Fechar o modal ao clicar ou tocar fora dele
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        fecharModal();
      }
    });

    window.addEventListener("touchstart", (event) => {
      if (event.target === modal) {
        fecharModal();
      }
    });
  };

  // Função para ajustar o scroll para centralizar o cartão
  const ajustarScrollParaCentralizarCard = (card) => {
    if (!areaTemplateContent) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Função para fechar todos os cards
  const fecharTodosOsCards = () => {
    const cardsExpandidos = listaDeCardsContainer
      ? listaDeCardsContainer.querySelectorAll(".contatos-small-card-expanded")
      : document.querySelectorAll(".contatos-small-card-expanded");

    cardsExpandidos.forEach((card) => {
      card.classList.remove("contatos-small-card-expanded");
      const camposOcultos = card.querySelectorAll(
        ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
      );
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheContato");
      });
    });
  };

  // Função para lidar com o clique nos cards usando delegação de eventos
  const exibirDetalhesContato = (event) => {
    // Se foi um long press, não executa a lógica de expansão
    if (isLongPress) return;

    const card = event.target.closest(".contatos-small-card");
    if (!card) return;

    // Se o clique está dentro de '.contatos-small-card-editar', não faz nada
    if (event.target.closest(".contatos-small-card-editar")) {
      return;
    }

    // Se o clique for no botão de telefone
    if (event.target.classList.contains("contatos-small-card-call")) {
      const numElement = card.querySelector(".contatos-small-card-num");
      const nomeElement = card.querySelector(".contatos-small-card-title");

      const num = numElement ? numElement.textContent.trim() : "";
      const nomeContato = nomeElement ? nomeElement.textContent.trim() : "";

      if (num && nomeContato) {
        exibirModalEscolhaChamada(num, nomeContato);
      } else {
        console.warn("Número ou nome do contato não encontrado.");
      }
      return; // Evita a execução do restante da função
    }

    event.preventDefault();

    const camposOcultos = card.querySelectorAll(
      ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
    );

    const isExpanded = card.classList.contains("contatos-small-card-expanded");

    if (isExpanded) {
      // Fecha o card clicado
      card.classList.remove("contatos-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.remove("exibirDetalheContato");
      });
    } else {
      // Fecha quaisquer cards expandidos
      fecharTodosOsCards();

      // Expande o card clicado
      card.classList.add("contatos-small-card-expanded");
      camposOcultos.forEach((campo) => {
        campo.classList.add("exibirDetalheContato");
      });

      // Ajusta o scroll para centralizar o card
      ajustarScrollParaCentralizarCard(card);
    }
  };

  // Função para lidar com o clique no botão "Visualizar"
  const lidarComBtnVisualizar = (event) => {
    event.stopPropagation(); // Impede a propagação do evento de clique
    redirecionarParaExibicaoContato(); // Redireciona para a página de visualização
  };

  // Adiciona estilo CSS para feedback visual do long press
  const adicionarEstiloLongPress = () => {
    const style = document.createElement("style");
    style.textContent = `
      .long-press-active {
        transform: scale(0.98);
        opacity: 0.8;
        transition: transform 0.2s, opacity 0.2s;
      }
    `;
    document.head.appendChild(style);
  };

  // Função para adicionar ouvintes de eventos aos cards
  const adicionarOuvintes = () => {
    // Adiciona estilo para feedback visual
    adicionarEstiloLongPress();

    const container = listaDeCardsContainer || document;

    // Adiciona eventos para pressionar e segurar
    container.addEventListener("touchstart", iniciarLongPress, {
      passive: true,
    });
    container.addEventListener("mousedown", iniciarLongPress);

    // Cancela o pressionar e segurar se o usuário mover o dedo/cursor
    container.addEventListener("touchmove", cancelarLongPress, {
      passive: true,
    });
    container.addEventListener("mousemove", cancelarLongPress);

    // Cancela o pressionar e segurar se o usuário soltar o dedo/cursor
    container.addEventListener("touchend", cancelarLongPress);
    container.addEventListener("mouseup", cancelarLongPress);

    if (listaDeCardsContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsContainer.addEventListener("click", (event) => {
        const card = event.target.closest(".contatos-small-card");
        if (!card) return;

        exibirDetalhesContato(event);

        // Verifica se o botão "Visualizar" foi clicado
        const btnVisualizar = event.target.closest("#btnVisualizar");
        if (btnVisualizar) {
          lidarComBtnVisualizar(event);
        }

        // Se o clique está dentro de '.contatos-small-card-editar', não faz nada adicional
        if (event.target.closest(".contatos-small-card-editar")) {
          return;
        }
      });
    } else {
      // Se não houver um contêiner específico, delegue a partir do documento
      document.addEventListener("click", (event) => {
        const card = event.target.closest(".contatos-small-card");
        if (!card) return;

        exibirDetalhesContato(event);

        // Verifica se o botão "Visualizar" foi clicado
        const btnVisualizar = event.target.closest("#btnVisualizar");
        if (btnVisualizar) {
          lidarComBtnVisualizar(event);
        }

        // Se o clique está dentro de '.contatos-small-card-editar', não faz nada adicional
        if (event.target.closest(".contatos-small-card-editar")) {
          return;
        }
      });
      console.warn(
        "Contêiner '.lista-de-cards-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Inicialização das funcionalidades
  configurarOuvintesModal();
  adicionarOuvintes();
});
