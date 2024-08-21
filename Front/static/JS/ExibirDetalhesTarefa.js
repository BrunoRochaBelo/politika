// Função para lidar com o clique nos cards de tarefa pequenos
function exibirDetalhesTarefaPequena(event) {
  event.preventDefault();

  const cardTarefaSmall = event.currentTarget.closest(".tarefa-small-card");
  const camposOcultos = cardTarefaSmall.querySelectorAll(
    ".tarefa-small-card-desc, .tarefa-small-card-resp, .tarefa-small-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheTarefa")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheTarefa");
    });
    cardTarefaSmall.classList.remove("tarefa-small-card-expanded");
  } else {
    // Fecha qualquer card que esteja atualmente expandido
    fecharTodosOsCardsTarefaPequena();

    // Expande o card clicado
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheTarefa");
    });
    cardTarefaSmall.classList.add("tarefa-small-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCardTarefaSmall(cardTarefaSmall);
  }
}

// Função para ajustar o scroll para centralizar o card de tarefa pequeno
function ajustarScrollParaCentralizarCardTarefaSmall(cardTarefaSmall) {
  const areaTemplateContent = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  if (!areaTemplateContent) return;

  const cardOffsetTop = cardTarefaSmall.offsetTop;
  const cardHeight = cardTarefaSmall.offsetHeight;
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

// Função para fechar todos os cards de tarefa pequenos expandidos
function fecharTodosOsCardsTarefaPequena() {
  const cardsExpandidos = document.querySelectorAll(
    ".tarefa-small-card-expanded"
  );
  cardsExpandidos.forEach((card) => {
    const camposOcultos = card.querySelectorAll(
      ".tarefa-small-card-desc, .tarefa-small-card-resp, .tarefa-small-card-editar"
    );
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheTarefa");
    });
    card.classList.remove("tarefa-small-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cards de tarefa pequenos
const listaDeCardsTarefaSmall = document.querySelectorAll(".tarefa-small-card");
listaDeCardsTarefaSmall.forEach((cardTarefaSmall) => {
  cardTarefaSmall.addEventListener("click", exibirDetalhesTarefaPequena);

  // Adiciona um ouvinte de evento de clique ao botão btnVisualizar para cada card
  const btnVisualizar = cardTarefaSmall.querySelector("#btnVisualizar");
  if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento de clique
      window.location.href = "exibir-tarefa.html"; // Redireciona para a página de visualização
    });
  }
});

// Função para lidar com o clique nos cards de tarefa médios
function exibirDetalhesTarefa(event) {
  event.preventDefault();

  const cardTarefaMedium = event.currentTarget.closest(".tarefa-medium-card");
  const camposOcultos = cardTarefaMedium.querySelectorAll(
    ".tarefa-medium-card-resp, .tarefa-medium-card-editar"
  );

  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheTarefa")
  );

  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheTarefa");
    });
    cardTarefaMedium.classList.remove("tarefa-medium-card-expanded");
  } else {
    // Fecha qualquer card que esteja atualmente expandido
    fecharTodosOsCardsTarefa();

    // Expande o card clicado
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheTarefa");
    });
    cardTarefaMedium.classList.add("tarefa-medium-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCardTarefaMedium(cardTarefaMedium);
  }
}

// Função para ajustar o scroll para centralizar o card de tarefa médio
function ajustarScrollParaCentralizarCardTarefaMedium(cardTarefaMedium) {
  const areaTemplateContent = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  if (!areaTemplateContent) return;

  const cardOffsetTop = cardTarefaMedium.offsetTop;
  const cardHeight = cardTarefaMedium.offsetHeight;
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

// Função para fechar todos os cards de tarefa médios expandidos
function fecharTodosOsCardsTarefa() {
  const cardsExpandidos = document.querySelectorAll(
    ".tarefa-medium-card-expanded"
  );
  cardsExpandidos.forEach((card) => {
    const camposOcultos = card.querySelectorAll(
      ".tarefa-medium-card-resp, .tarefa-medium-card-editar"
    );
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheTarefa");
    });
    card.classList.remove("tarefa-medium-card-expanded");
  });
}

// Adiciona um ouvinte de evento de clique para a lista de cards de tarefa médios
const listaDeCardsTarefaMedium = document.querySelectorAll(
  ".tarefa-medium-card"
);
listaDeCardsTarefaMedium.forEach((cardTarefaMedium) => {
  cardTarefaMedium.addEventListener("click", exibirDetalhesTarefa);

  // Adiciona um ouvinte de evento de clique ao botão btnVisualizar para cada card
  const btnVisualizar = cardTarefaMedium.querySelector("#btnVisualizar");
  if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento de clique
      window.location.href = "exibir-tarefa.html"; // Redireciona para a página de visualização
    });
  }
});
