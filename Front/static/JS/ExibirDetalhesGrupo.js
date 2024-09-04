// Função para lidar com o clique nos cartões do grupo
function exibirDetalhesGrupo(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".grupo-small-card-title, .grupo-small-card-func, grupo-small-card-situacao, .grupo-small-card-desc, .grupo-small-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheGrupo")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheGrupo");
    });
    card.classList.remove("grupo-small-card-expanded");
  } else {
    // Fecha qualquer card que esteja atualmente expandido
    fecharTodosOsCardsGrupo();

    // Expande o card clicado
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheGrupo");
    });
    card.classList.add("grupo-small-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCard(card);
  }
}

function ajustarScrollParaCentralizarCard(card) {
  const areaTemplateContent = document.querySelector(
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

// Função para fechar todos os cartões de grupo expandidos
function fecharTodosOsCardsGrupo() {
  const cardsExpandidos = document.querySelectorAll(
    ".grupo-small-card-expanded"
  );
  cardsExpandidos.forEach((card) => {
    const camposOcultos = card.querySelectorAll(
      ".grupo-small-card-id, .grupo-small-card-editar"
    );
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheGrupo");
    });
    card.classList.remove("grupo-small-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cartões de grupo
const listaDeCardsGrupo = document.querySelectorAll(".grupo-small-card");
listaDeCardsGrupo.forEach((card) => {
  card.addEventListener("click", exibirDetalhesGrupo);
});
