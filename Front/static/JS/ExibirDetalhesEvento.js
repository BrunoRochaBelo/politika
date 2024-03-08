// Função para card SMALL
// Função para lidar com o clique nos cards
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
    ".area-template-tmf-alt-content"
  );
  const cardOffsetTop = cardEventoSmall.offsetTop;
  const cardHeight = cardEventoSmall.offsetHeight;
  const areaTemplateContentHeight = areaTemplateContent.offsetHeight;
  const areaTemplateContentScrollTop = areaTemplateContent.scrollTop;

  // Verificar se o card já está totalmente visível
  const isCardFullyVisible =
    cardOffsetTop >= areaTemplateContentScrollTop &&
    cardOffsetTop + cardHeight <=
      areaTemplateContentScrollTop + areaTemplateContentHeight;

  if (!isCardFullyVisible) {
    // Calcular a nova posição de scroll para tornar o card totalmente visível
    let newScrollTop;
    if (cardOffsetTop < areaTemplateContentScrollTop) {
      // Se o card está acima da área visível, mover para o topo do card
      newScrollTop = cardOffsetTop;
    } else if (
      cardOffsetTop + cardHeight >
      areaTemplateContentScrollTop + areaTemplateContentHeight
    ) {
      // Se o card está abaixo da área visível, mover para o fundo do card
      newScrollTop = cardOffsetTop + cardHeight - areaTemplateContentHeight;
    }

    // Ajustar a posição de scroll do area-template-content, se necessário
    if (newScrollTop !== undefined) {
      areaTemplateContent.scrollTop = newScrollTop;
    }
  }
}
// Adiciona um ouvinte de evento de clique para a lista de cards
const listaDeCardsEventoSmall = document.querySelectorAll(
  ".calendario-small-card"
);
listaDeCardsEventoSmall.forEach((cardEventoSmall) => {
  cardEventoSmall.addEventListener("click", exibirDetalhesEvento);
});

// Função para card LARGE
function exibirEditar(event) {
  event.preventDefault();

  const cardEventoLarge = event.currentTarget;
  const editar = cardEventoLarge.querySelector(".calendario-large-card-editar");

  const algumCampoVisivel = editar.classList.contains("exibirDetalheEvento");

  if (algumCampoVisivel) {
    editar.classList.remove("exibirDetalheEvento");
    cardEventoLarge.classList.remove("calendario-large-card-expanded");
  } else {
    editar.classList.add("exibirDetalheEvento");
    cardEventoLarge.classList.add("calendario-large-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCardEventoLarge(cardEventoLarge);
  }
}
function ajustarScrollParaCentralizarCardEventoLarge(cardEventoLarge) {
  const areaTemplateContent = document.querySelector(
    ".area-abas-template-content"
  );
  const cardOffsetTop = cardEventoLarge.offsetTop;
  const cardHeight = cardEventoLarge.offsetHeight;
  const areaTemplateContentHeight = areaTemplateContent.offsetHeight;
  const areaTemplateContentScrollTop = areaTemplateContent.scrollTop;

  const isCardFullyVisible =
    cardOffsetTop >= areaTemplateContentScrollTop &&
    cardOffsetTop + cardHeight <=
      areaTemplateContentScrollTop + areaTemplateContentHeight;

  if (!isCardFullyVisible) {
    let newScrollTop;
    if (cardOffsetTop < areaTemplateContentScrollTop) {
      newScrollTop = cardOffsetTop;
    } else if (
      cardOffsetTop + cardHeight >
      areaTemplateContentScrollTop + areaTemplateContentHeight
    ) {
      newScrollTop = cardOffsetTop + cardHeight - areaTemplateContentHeight;
    }

    if (newScrollTop !== undefined) {
      areaTemplateContent.scrollTop = newScrollTop;
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const listaDeCards = document.querySelectorAll(".calendario-large-card");
  listaDeCards.forEach((cardEventoLarge) => {
    cardEventoLarge.addEventListener("click", exibirEditar);
  });
});
