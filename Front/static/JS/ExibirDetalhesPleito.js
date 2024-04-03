// Função para lidar com o clique nos cards
function exibirDetalhesPleito(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".pleitos-medium-card-beneficiario, .pleitos-medium-card-uf, .pleitos-medium-card-cidade, .pleitos-medium-card-bairro, .pleitos-medium-card-rua, .pleitos-medium-card-autor, .pleitos-medium-card-dataCriacao, .pleitos-medium-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalhePleito")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalhePleito");
    });
    card.classList.remove("pleitos-medium-card-expanded");
  } else {
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalhePleito");
    });
    card.classList.add("pleitos-medium-card-expanded");

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

// Adiciona um ouvinte de evento de clique para a lista de cards
const listaDeCards = document.querySelectorAll(".pleitos-medium-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", exibirDetalhesPleito);

  // Adiciona um ouvinte de evento de clique aos botões dentro do div pleitos-medium-card-editar para cada card
  const botoesEditar = card.querySelectorAll(
    ".pleitos-medium-card-editar button"
  );
  botoesEditar.forEach((botao) => {
    botao.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento de clique
    });
  });
});
