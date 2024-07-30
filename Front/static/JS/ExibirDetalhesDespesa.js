// Função para lidar com o clique nos cartões de despesas
function exibirDetalhesDespesa(event) {
  event.preventDefault();

  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".despesas-medium-card-cnpj_cpf_for, .despesas-medium-card-nome_fornecedor, .despesas-medium-card-ordenador_despesa, .despesas-medium-card-autor, .despesas-medium-card-data_criacao, .despesas-medium-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheDespesa")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheDespesa");
    });
    card.classList.remove("despesas-medium-card-expanded");
  } else {
    // Fecha qualquer card que esteja atualmente expandido
    fecharTodosOsCardsDespesa();

    // Expande o card clicado
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheDespesa");
    });
    card.classList.add("despesas-medium-card-expanded");

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

// Função para fechar todos os cartões de despesas expandidos
function fecharTodosOsCardsDespesa() {
  const cardsExpandidos = document.querySelectorAll(
    ".despesas-medium-card-expanded"
  );
  cardsExpandidos.forEach((card) => {
    const camposOcultos = card.querySelectorAll(
      ".despesas-medium-card-cnpj_cpf_for, .despesas-medium-card-nome_fornecedor, .despesas-medium-card-ordenador_despesa, .despesas-medium-card-autor, .despesas-medium-card-data_criacao, .despesas-medium-card-editar"
    );
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheDespesa");
    });
    card.classList.remove("despesas-medium-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cartões de despesas
const listaDeCards = document.querySelectorAll(".despesas-medium-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", exibirDetalhesDespesa);
});
