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

function exibirEditar(event) {
  event.preventDefault();

  // Encontrar o campo oculto
  const card = event.currentTarget;
  const editar = card.querySelector(".calendario-large-card-editar");

  // Verificar se o campo está visível
  const campoVisivel = editar.classList.contains("exibirDetalheEvento");

  // Se o campo estiver visível, ocultá-lo
  if (campoVisivel) {
    editar.classList.remove("exibirDetalheEvento");
  } else {
    // Se o campo não estiver visível, exibi-lo e centralizar o card
    editar.classList.add("exibirDetalheEvento");
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Adiciona um ouvinte de evento de clique para a lista de cards
document.addEventListener("DOMContentLoaded", function () {
  const listaDeCards = document.querySelectorAll(".calendario-large-card");
  listaDeCards.forEach((card) => {
    card.addEventListener("click", exibirEditar);
  });
});
