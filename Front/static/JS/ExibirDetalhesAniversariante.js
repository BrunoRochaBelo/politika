// Encapsula todo o código para evitar poluição do escopo global
document.addEventListener("DOMContentLoaded", () => {
  // Cache de seletores
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const listaDeCardsContainer = document.querySelector(
    ".lista-de-cards-container"
  );

  // Seletores do modal
  const modal = document.getElementById("modalEscolhaChamada");
  const btnChamadaNativa = document.getElementById("btnChamadaNativa");
  const btnChamadaWhatsApp = document.getElementById("btnChamadaWhatsApp");
  const closeModalElement = document.querySelector(
    ".modal-escolha-chamada-close"
  );

  let currentContato = {
    numero: "",
    nome: "",
  };

  // Função para iniciar a chamada telefônica nativa
  const iniciarChamadaTelefonica = (numero, nomeContato) => {
    const dataHora = new Date().toISOString();
    window.location.href = `tel:${numero}`;
    // registrarLigacao(nomeContato, numero, dataHora); // Descomente se necessário
  };

  // Função para iniciar uma chamada via WhatsApp
  const iniciarChamadaWhatsApp = (numero, nomeContato) => {
    const dataHora = new Date().toISOString();
    const numeroWhatsApp = numero.replace(/[^\d]/g, "");
    window.location.href = `https://wa.me/${numeroWhatsApp}`;
    // registrarLigacao(nomeContato, numero, dataHora); // Descomente se necessário
  };

  // Função para exibir o modal de escolha de chamada
  const exibirModalEscolhaChamada = (numero, nomeContato) => {
    currentContato.numero = numero;
    currentContato.nome = nomeContato;

    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.add("show");
      }, 10);
    } else {
      console.warn("Modal não encontrado!");
    }
  };

  // Função para fechar o modal
  const fecharModal = () => {
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        currentContato = { numero: "", nome: "" }; // Resetar contato atual
      }, 500); // Tempo igual ao de transição
    }
  };

  // Configuração inicial dos ouvintes de eventos do modal
  const configurarOuvintesModal = () => {
    if (btnChamadaNativa) {
      btnChamadaNativa.addEventListener("click", () => {
        if (currentContato.numero && currentContato.nome) {
          iniciarChamadaTelefonica(currentContato.numero, currentContato.nome);
          fecharModal();
        }
      });
    } else {
      console.warn("btnChamadaNativa não encontrado!");
    }

    if (btnChamadaWhatsApp) {
      btnChamadaWhatsApp.addEventListener("click", () => {
        if (currentContato.numero && currentContato.nome) {
          iniciarChamadaWhatsApp(currentContato.numero, currentContato.nome);
          fecharModal();
        }
      });
    } else {
      console.warn("btnChamadaWhatsApp não encontrado!");
    }

    if (closeModalElement) {
      closeModalElement.addEventListener("click", fecharModal);
      closeModalElement.addEventListener("touchstart", fecharModal);
    } else {
      console.warn("Elemento de fechar modal não encontrado!");
    }

    // Fechar o modal ao clicar ou tocar fora dele
    window.addEventListener("click", (event) => {
      if (modal && event.target === modal) {
        fecharModal();
      }
    });

    window.addEventListener("touchstart", (event) => {
      if (modal && event.target === modal) {
        fecharModal();
      }
    });
  };

  // Função para fechar todos os cartões de aniversário expandidos
  const fecharTodosOsCardsAniversario = () => {
    const expandedCards = document.querySelectorAll(
      ".aniversario-small-card-expanded"
    );
    expandedCards.forEach((card) => {
      card.classList.remove("aniversario-small-card-expanded");
      const hiddenFields = card.querySelectorAll(
        ".aniversario-small-card-num, .aniversario-small-card-email, .aniversario-small-card-tipopessoa, .aniversario-small-card-editar"
      );
      hiddenFields.forEach((field) => {
        field.classList.remove("exibirDetalhesAniversariante");
      });
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

  // Função para lidar com o clique nos cartões usando delegação de eventos
  const exibirDetalhesAniversariante = (event) => {
    const card = event.target.closest(".aniversario-small-card");
    if (!card) return;

    // Verifica se o clique está dentro de '.aniversario-small-card-editar'
    if (event.target.closest(".aniversario-small-card-editar")) {
      // Não faz nada, impede o fechamento do cartão
      return;
    }

    // Se o clique for no botão de chamada, exibe o modal
    if (event.target.classList.contains("aniversario-small-card-call")) {
      const numElement = card.querySelector(".aniversario-small-card-num");
      const nomeElement = card.querySelector(".aniversario-small-card-title");

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

    const hiddenFields = card.querySelectorAll(
      ".aniversario-small-card-num, .aniversario-small-card-email, .aniversario-small-card-editar, .aniversario-small-card-tipopessoa"
    );

    const isExpanded = card.classList.contains(
      "aniversario-small-card-expanded"
    );

    if (isExpanded) {
      // Fecha o cartão clicado
      card.classList.remove("aniversario-small-card-expanded");
      hiddenFields.forEach((field) => {
        field.classList.remove("exibirDetalhesAniversariante");
      });
    } else {
      // Fecha quaisquer cartões expandidos
      fecharTodosOsCardsAniversario();

      // Expande o cartão clicado
      card.classList.add("aniversario-small-card-expanded");
      hiddenFields.forEach((field) => {
        field.classList.add("exibirDetalhesAniversariante");
      });

      // Ajusta o scroll para centralizar o cartão
      ajustarScrollParaCentralizarCard(card);
    }
  };

  // Função para adicionar ouvintes de eventos
  const adicionarOuvintes = () => {
    if (listaDeCardsContainer) {
      // Delegação de eventos a partir do contêiner específico
      listaDeCardsContainer.addEventListener(
        "click",
        exibirDetalhesAniversariante
      );
    } else {
      // Se não houver um contêiner específico, delega a partir do documento
      document.addEventListener("click", exibirDetalhesAniversariante);
      console.warn(
        "Contêiner '.lista-de-cards-container' não encontrado. Delegando eventos a partir do documento."
      );
    }
  };

  // Adiciona os ouvintes de eventos
  adicionarOuvintes();

  // Configura os ouvintes de eventos do modal
  configurarOuvintesModal();
});
