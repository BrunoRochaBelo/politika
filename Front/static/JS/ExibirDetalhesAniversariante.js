// Função para iniciar uma chamada telefônica
function iniciarChamadaTelefonicaNiver(card) {
  const phoneElement = card.querySelector(".aniversario-small-card-num");
  const phoneNumber = phoneElement.textContent.trim();
  window.location.href = `tel:${phoneNumber}`;
}

// Função para lidar com o clique nos cartões
function exibirDetalhesAniversariante(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const hiddenFields = card.querySelectorAll(
    ".aniversario-small-card-num, .aniversario-small-card-email, .aniversario-small-card-tipopessoa, .aniversario-small-card-editar"
  );

  const isAnyFieldVisible = Array.from(hiddenFields).some((field) =>
    field.classList.contains("exibirDetalhesAniversariante")
  );

  if (isAnyFieldVisible) {
    hiddenFields.forEach((field) => {
      field.classList.remove("exibirDetalhesAniversariante");
    });
    card.classList.remove("aniversario-small-card-expanded");
  } else {
    // Fecha qualquer cartão expandido
    fecharTodosOsCardsAniversario();

    // Expande o cartão clicado
    hiddenFields.forEach((field) => {
      field.classList.add("exibirDetalhesAniversariante");
    });
    card.classList.add("aniversario-small-card-expanded");

    // Verificar se o cartão está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCard(card);
  }

  if (event.target.classList.contains("aniversario-small-card-phone")) {
    iniciarChamadaTelefonicaNiver(card);
  }
}

// Função para ajustar o scroll para centralizar o cartão
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

// Função para fechar todos os cartões de aniversário expandidos
function fecharTodosOsCardsAniversario() {
  const expandedCards = document.querySelectorAll(
    ".aniversario-small-card-expanded"
  );
  expandedCards.forEach((card) => {
    const hiddenFields = card.querySelectorAll(
      ".aniversario-small-card-num, .aniversario-small-card-email, .aniversario-small-card-tipopessoa, .aniversario-small-card-editar"
    );
    hiddenFields.forEach((field) => {
      field.classList.remove("exibirDetalhesAniversariante");
    });
    card.classList.remove("aniversario-small-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cartões de aniversário
document.addEventListener("DOMContentLoaded", function () {
  const listaDeCards = document.querySelectorAll(".aniversario-small-card");
  listaDeCards.forEach((card) => {
    card.addEventListener("click", exibirDetalhesAniversariante);
  });
});
