function exibirDetalhesEvento(event) {
  // Encontra os elementos dentro do card clicado
  var local = event.currentTarget.querySelector(".calendario-small-card-local");
  var participantes = event.currentTarget.querySelector(
    ".calendario-small-card-partcipantes"
  );
  var editar = event.currentTarget.querySelector(
    ".calendario-small-card-editar"
  );

  // Verifica a altura da área
  var area = document.querySelector(".area-template-tmf-alt-content");
  var areaHeight = area.offsetHeight;

  // Verifica a altura do card
  var cardHeight = event.currentTarget.offsetHeight;

  // Se a altura da área for menor que a altura do card, ajusta a altura da área
  if (areaHeight < cardHeight) {
    area.style.height = `${cardHeight}px`;
  }

  // Rola a página até que o card clicado esteja no centro da área visível
  event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" });

  // Alterna a classe 'exibirDetalheEvento' nos elementos
  local.classList.toggle("exibirDetalheEvento");
  participantes.classList.toggle("exibirDetalheEvento");
  editar.classList.toggle("exibirDetalheEvento");

  // Alterna a classe 'calendario-small-card-expanded' no card clicado
  event.currentTarget.classList.toggle("calendario-small-card-expanded");
}
// Adiciona o evento de clique a todos os cards do evento
document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".calendario-small-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", exibirDetalhesEvento);
  }
});

// Função para card LARGE
function exibirEditar(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const editar = card.querySelector(".calendario-large-card-editar");

  const algumCampoVisivel = editar.classList.contains("exibirDetalheEvento");

  if (algumCampoVisivel) {
    editar.classList.remove("exibirDetalheEvento");
    card.classList.remove("calendario-large-card-expanded");
  } else {
    editar.classList.add("exibirDetalheEvento");
    card.classList.add("calendario-large-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCard(card);
  }
}

function ajustarScrollParaCentralizarCard(card) {
  const areaTemplateContent = document.querySelector(
    ".area-abas-template-content"
  );
  const cardOffsetTop = card.offsetTop;
  const cardHeight = card.offsetHeight;
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
  listaDeCards.forEach((card) => {
    card.addEventListener("click", exibirEditar);
  });
});
