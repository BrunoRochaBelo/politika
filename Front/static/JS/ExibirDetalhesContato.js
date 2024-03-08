// Função para iniciar a chamada telefônica
function iniciarChamadaTelefonica(card) {
  const num = card.querySelector(".contatos-small-card-num");
  window.location.href = "tel:" + num.textContent.trim();
}

// Função para lidar com o clique nos cards
function exibirDetalhesContato(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheContato")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheContato");
    });
    card.classList.remove("contatos-small-card-expanded");
  } else {
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheContato");
    });
    card.classList.add("contatos-small-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCard(card);
  }

  if (event.target.classList.contains("contatos-small-card-phone")) {
    iniciarChamadaTelefonica(card);
  }
}

function ajustarScrollParaCentralizarCard(card) {
  const areaTemplateContent = document.querySelector(".area-template-content");
  const cardOffsetTop = card.offsetTop;
  const cardHeight = card.offsetHeight;
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
const listaDeCards = document.querySelectorAll(".contatos-small-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", exibirDetalhesContato);
});
