// Função para iniciar a chamada telefônica nativa e registrar a ligação
function iniciarChamadaTelefonica(numero, nomeContato) {
  const dataHora = new Date().toISOString();
  window.location.href = "tel:" + numero;
  registrarLigacao(nomeContato, numero, dataHora);
}

// Função para iniciar uma chamada via WhatsApp e registrar a ligação
function iniciarChamadaWhatsApp(numero, nomeContato) {
  const dataHora = new Date().toISOString();
  window.location.href = "https://wa.me/" + numero.replace(/[^\d]/g, "");
  registrarLigacao(nomeContato, numero, dataHora);
}

// Função para exibir o modal e permitir a escolha do tipo de chamada
function exibirModalEscolhaChamada(card) {
  const modal = document.getElementById("modalEscolhaChamada");
  const num = card.querySelector(".contatos-small-card-num").textContent.trim();
  const nomeContato = card
    .querySelector(".contatos-small-card-title")
    .textContent.trim();

  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);

  // Atribuir funções aos botões do modal
  document.getElementById("btnChamadaNativa").onclick = function () {
    iniciarChamadaTelefonica(num, nomeContato);
    fecharModal(modal);
  };

  document.getElementById("btnChamadaWhatsApp").onclick = function () {
    iniciarChamadaWhatsApp(num, nomeContato);
    fecharModal(modal);
  };

  // Fechar o modal quando o usuário clicar no "X" ou tocar no "X"
  const closeModal = document.querySelector(".modal-escolha-chamada-close");
  closeModal.onclick = function () {
    fecharModal(modal);
  };
  closeModal.addEventListener("touchstart", function () {
    fecharModal(modal);
  });

  // Fechar o modal quando o usuário clicar ou tocar fora do modal
  window.onclick = function (event) {
    if (event.target === modal) {
      fecharModal(modal);
    }
  };
  window.addEventListener("touchstart", function (event) {
    if (event.target === modal) {
      fecharModal(modal);
    }
  });
}

function fecharModal(modal) {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 500); // Tempo igual ao de transição
}

// Função para lidar com o clique nos cards
function exibirDetalhesContato(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
  );

  // Verifica se o clique foi no botão de telefone
  if (event.target.classList.contains("contatos-small-card-call")) {
    exibirModalEscolhaChamada(card);
    return; // Retorna imediatamente para evitar a execução do código abaixo
  }

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheContato")
  );

  if (algumCampoVisivel) {
    // Se algum campo já está visível, recolhe o card
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheContato");
    });
    card.classList.remove("contatos-small-card-expanded");
  } else {
    // Fecha qualquer card que esteja atualmente expandido
    fecharTodosOsCards();

    // Expande o card clicado
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheContato");
    });
    card.classList.add("contatos-small-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCard(card);
  }
}

function ajustarScrollParaCentralizarCard(card) {
  const areaTemplateContent = card.closest(
    ".area-interna-containerContent-template-content"
  );

  if (!areaTemplateContent) return;

  const cardOffsetTop = card.offsetTop;
  const cardHeight = card.offsetHeight;
  const areaTemplateContentHeight = areaTemplateContent.offsetHeight;
  const areaTemplateContentScrollTop = areaTemplateContent.scrollTop;

  const cardTopVisible = cardOffsetTop >= areaTemplateContentScrollTop;
  const cardBottomVisible =
    cardOffsetTop + cardHeight <=
    areaTemplateContentScrollTop + areaTemplateContentHeight;

  if (!cardTopVisible) {
    areaTemplateContent.scrollTo({
      top: cardOffsetTop,
      behavior: "smooth",
    });
  } else if (!cardBottomVisible) {
    areaTemplateContent.scrollTo({
      top: cardOffsetTop + cardHeight - areaTemplateContentHeight,
      behavior: "smooth",
    });
  }
}

// Função para fechar todos os cards
function fecharTodosOsCards() {
  const cardsExpandidos = document.querySelectorAll(
    ".contatos-small-card-expanded"
  );
  cardsExpandidos.forEach((card) => {
    const camposOcultos = card.querySelectorAll(
      ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
    );
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheContato");
    });
    card.classList.remove("contatos-small-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cards
const listaDeCards = document.querySelectorAll(".contatos-small-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", exibirDetalhesContato);

  // Adiciona um ouvinte de evento de clique ao botão btnVisualizar para cada card
  const btnVisualizar = card.querySelector("#btnVisualizar");
  if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento de clique
      window.location.href = "contato_exibir.html"; // Redireciona para a página de visualização
    });
  }
});
