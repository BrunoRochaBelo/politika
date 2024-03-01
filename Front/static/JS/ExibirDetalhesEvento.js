function exibirDetalhesEvento(event) {
  // Encontra os elementos dentro do card clicado
  var local = event.currentTarget.querySelector(".calendario-small-card-local");
  var participantes = event.currentTarget.querySelector(
    ".calendario-small-card-partcipantes"
  );
  var editar = event.currentTarget.querySelector(
    ".calendario-small-card-editar"
  ); // Adicionado

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
  editar.classList.toggle("exibirDetalheEvento"); // Adicionado
}

// Adiciona o evento de clique a todos os cards do evento
document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".calendario-small-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", exibirDetalhesEvento);
  }
});
