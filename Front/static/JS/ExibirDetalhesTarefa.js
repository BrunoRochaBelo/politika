// Função para lidar com o clique nos cards de tarefa
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
  const cardOffsetTop = cardTarefaSmall.offsetTop;
  const cardHeight = cardTarefaSmall.offsetHeight;
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

    // Ajustar a posição de scroll do container-template-content, se necessário
    if (newScrollTop !== undefined) {
      areaTemplateContent.scrollTop = newScrollTop;
    }
  }
}

// Função para fechar todos os cards de tarefa expandidos
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

// Adiciona um ouvinte de evento de clique para a lista de cards de tarefa
const listaDeCardsTarefaSmall = document.querySelectorAll(".tarefa-small-card");
listaDeCardsTarefaSmall.forEach((cardTarefaSmall) => {
  cardTarefaSmall.addEventListener("click", exibirDetalhesTarefaPequena);

  // Adiciona um ouvinte de evento de clique ao botão btnVisualizar para cada card
  const btnVisualizar = cardTarefaSmall.querySelector("#btnVisualizar");
  if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento de clique
      window.location.href = "view-tarefa.html"; // Redireciona para a página de visualização
    });
  }
});

// Função para lidar com o clique nos cards de tarefa
// Média
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

// Função para ajustar o scroll para centralizar o card de tarefa medio
function ajustarScrollParaCentralizarCardTarefaMedium(cardTarefaMedium) {
  const areaTemplateContent = document.querySelector(
    ".container-compromisso-hoje-template-content"
  );
  const cardOffsetTop = cardTarefaMedium.offsetTop;
  const cardHeight = cardTarefaMedium.offsetHeight;
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

    // Ajustar a posição de scroll do container-template-content, se necessário
    if (newScrollTop !== undefined) {
      areaTemplateContent.scrollTop = newScrollTop;
    }
  }
}

// Função para fechar todos os cards de tarefa expandidos
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

// Adiciona um ouvinte de evento de clique para a lista de cards de tarefa
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
      window.location.href = "view-tarefa.html"; // Redireciona para a página de visualização
    });
  }
});
