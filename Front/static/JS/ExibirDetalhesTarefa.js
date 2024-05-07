function exibirDetalhesTarefa(event) {
  event.preventDefault();

  const cardTarefaSmall = event.currentTarget.closest(".tarefa-small-card");
  const camposOcultos = cardTarefaSmall.querySelectorAll(
    ".tarefa-small-card-resp, .tarefa-small-card-editar"
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
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheTarefa");
    });
    cardTarefaSmall.classList.add("tarefa-small-card-expanded");

    // Verificar se o card está fora da área visível e ajustar o scroll conforme necessário
    ajustarScrollParaCentralizarCardTarefaSmall(cardTarefaSmall);
  }
}

function ajustarScrollParaCentralizarCardTarefaSmall(cardTarefaSmall) {
  const areaTemplateContent = document.querySelector(
    ".area-template-fil-alt-content"
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

    // Ajustar a posição de scroll do area-template-content, se necessário
    if (newScrollTop !== undefined) {
      areaTemplateContent.scrollTop = newScrollTop;
    }
  }
}

// Adiciona um ouvinte de evento de clique para a lista de cards
const listaDeCardsTarefaSmall = document.querySelectorAll(".tarefa-small-card");
listaDeCardsTarefaSmall.forEach((cardTarefaSmall) => {
  cardTarefaSmall.addEventListener("click", exibirDetalhesTarefa);

  // Adiciona um ouvinte de evento de clique ao botão btnVisualizar para cada card
  const btnVisualizar = cardTarefaSmall.querySelector("#btnVisualizar");
  if (btnVisualizar) {
    btnVisualizar.addEventListener("click", function (event) {
      event.stopPropagation(); // Impede a propagação do evento de clique
      window.location.href = "view-tarefa.html"; // Redireciona para a página de visualização
    });
  }
});
