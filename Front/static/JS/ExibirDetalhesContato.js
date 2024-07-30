// Função para iniciar a chamada telefônica e registrar a ligação
function iniciarChamadaTelefonica(card) {
  const num = card.querySelector(".contatos-small-card-num");
  const numero = num.textContent.trim();
  const nomeContato = card
    .querySelector(".contatos-small-card-title")
    .textContent.trim();
  const dataHora = new Date().toISOString();
  window.location.href = "tel:" + numero;
  registrarLigacao(nomeContato, numero, dataHora);
}

// Função para lidar com o clique nos cards
function exibirDetalhesContato(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
  );

  // Verifica se o clique foi no botão de telefone
  if (event.target.classList.contains("contatos-small-card-phone")) {
    iniciarChamadaTelefonica(card);
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
      window.location.href = "view-contato.html"; // Redireciona para a página de visualização
    });
  }
});
