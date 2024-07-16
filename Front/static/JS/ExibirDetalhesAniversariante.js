// Function to initiate a phone call
function iniciarChamadaTelefonicaNiver(card) {
  const phoneElement = card.querySelector(".aniversario-small-card-num");
  const phoneNumber = phoneElement.textContent.trim();
  window.location.href = `tel:${phoneNumber}`;
}

// Function to handle the click on the cards
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
    // Close any expanded card
    fecharTodosOsCardsAniversario();

    // Expand the clicked card
    hiddenFields.forEach((field) => {
      field.classList.add("exibirDetalhesAniversariante");
    });
    card.classList.add("aniversario-small-card-expanded");

    // Check if the card is outside the visible area and adjust the scroll as necessary
    ajustarScrollParaCentralizarCard(card);
  }

  if (event.target.classList.contains("aniversario-small-card-phone")) {
    iniciarChamadaTelefonicaNiver(card);
  }
}

// Function to adjust the scroll to centralize the card
function ajustarScrollParaCentralizarCard(card) {
  const areaTemplateContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const cardOffsetTop = card.offsetTop;
  const cardHeight = card.offsetHeight;
  const areaTemplateContentHeight = areaTemplateContent.offsetHeight;
  const areaTemplateContentScrollTop = areaTemplateContent.scrollTop;

  // Check if the card is fully visible
  const isCardFullyVisible =
    cardOffsetTop >= areaTemplateContentScrollTop &&
    cardOffsetTop + cardHeight <=
      areaTemplateContentScrollTop + areaTemplateContentHeight;

  if (!isCardFullyVisible) {
    // Calculate the new scroll position to make the card fully visible
    let newScrollTop;
    if (cardOffsetTop < areaTemplateContentScrollTop) {
      // If the card is above the visible area, move to the top of the card
      newScrollTop = cardOffsetTop;
    } else if (
      cardOffsetTop + cardHeight >
      areaTemplateContentScrollTop + areaTemplateContentHeight
    ) {
      // If the card is below the visible area, move to the bottom of the card
      newScrollTop = cardOffsetTop + cardHeight - areaTemplateContentHeight;
    }

    // Adjust the scroll position of area-interna-containerContent-template-content if necessary
    if (newScrollTop !== undefined) {
      areaTemplateContent.scrollTop = newScrollTop;
    }
  }
}

// Function to close all expanded birthday cards
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

// Adds a click event listener to the list of birthday cards
document.addEventListener("DOMContentLoaded", function () {
  const listaDeCards = document.querySelectorAll(".aniversario-small-card");
  listaDeCards.forEach((card) => {
    card.addEventListener("click", exibirDetalhesAniversariante);
  });
});
