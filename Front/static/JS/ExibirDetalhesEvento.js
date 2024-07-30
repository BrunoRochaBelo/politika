// Função para lidar com o clique nos cards SMALL
function exibirDetalhesEvento(event) {
  event.preventDefault();

  const cardEventoSmall = event.currentTarget;
  const camposOcultos = cardEventoSmall.querySelectorAll(
    ".calendario-small-card-local, .calendario-small-card-partcipantes, .calendario-small-card-duracao, .calendario-small-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheEvento")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheEvento");
    });
    cardEventoSmall.classList.remove("calendario-small-card-expanded");
  } else {
    fecharTodosOsCardsEvento();

    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheEvento");
    });
    cardEventoSmall.classList.add("calendario-small-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCardEventoSmall(cardEventoSmall);
  }
}

function ajustarScrollParaCentralizarCardEventoSmall(cardEventoSmall) {
  const areaTemplateContent = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  if (!areaTemplateContent) return;

  const cardOffsetTop = cardEventoSmall.offsetTop;
  const cardHeight = cardEventoSmall.offsetHeight;
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

// Função para fechar todos os cartões de evento SMALL e LARGE
function fecharTodosOsCardsEvento() {
  const expandedSmallCards = document.querySelectorAll(
    ".calendario-small-card-expanded"
  );
  expandedSmallCards.forEach((card) => {
    const camposOcultos = card.querySelectorAll(
      ".calendario-small-card-local, .calendario-small-card-partcipantes, .calendario-small-card-duracao, .calendario-small-card-editar"
    );
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheEvento");
    });
    card.classList.remove("calendario-small-card-expanded");
  });

  const expandedLargeCards = document.querySelectorAll(
    ".calendario-large-card-expanded"
  );
  expandedLargeCards.forEach((card) => {
    const editar = card.querySelector(".calendario-large-card-editar");
    editar.classList.remove("exibirDetalheEvento");
    card.classList.remove("calendario-large-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cards SMALL
const listaDeCardsEventoSmall = document.querySelectorAll(
  ".calendario-small-card"
);
listaDeCardsEventoSmall.forEach((cardEventoSmall) => {
  cardEventoSmall.addEventListener("click", exibirDetalhesEvento);
});

// Função para lidar com o clique nos cards LARGE
function exibirEditar(event) {
  event.preventDefault();

  const cardEventoLarge = event.currentTarget;
  const editar = cardEventoLarge.querySelector(".calendario-large-card-editar");

  const algumCampoVisivel = editar.classList.contains("exibirDetalheEvento");

  if (algumCampoVisivel) {
    editar.classList.remove("exibirDetalheEvento");
    cardEventoLarge.classList.remove("calendario-large-card-expanded");
  } else {
    fecharTodosOsCardsEvento();

    editar.classList.add("exibirDetalheEvento");
    cardEventoLarge.classList.add("calendario-large-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCardEventoLarge(cardEventoLarge);
  }
}

function ajustarScrollParaCentralizarCardEventoLarge(cardEventoLarge) {
  const areaTemplateContent = document.querySelector(
    ".container-abas-template-content"
  );
  if (!areaTemplateContent) return;

  const cardOffsetTop = cardEventoLarge.offsetTop;
  const cardHeight = cardEventoLarge.offsetHeight;
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

// Adiciona um ouvinte de evento de clique para a lista de cards LARGE
document.addEventListener("DOMContentLoaded", function () {
  const listaDeCards = document.querySelectorAll(".calendario-large-card");
  listaDeCards.forEach((cardEventoLarge) => {
    cardEventoLarge.addEventListener("click", exibirEditar);
  });
});
