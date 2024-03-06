// Função para lidar com o clique nos cards
function handleCardClick(event) {
  event.preventDefault();

  // Encontrar os campos ocultos
  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".pleitos-medium-card-beneficiario, .pleitos-medium-card-uf, .pleitos-medium-card-cidade, .pleitos-medium-card-bairro, .pleitos-medium-card-rua, .pleitos-medium-card-autor, .pleitos-medium-card-dataCriacao, .pleitos-medium-card-editar"
  );

  // Verificar se os campos estão visíveis
  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalhePleito")
  );

  // Se algum campo estiver visível, ocultar todos os campos
  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalhePleito");
    });
    card.classList.remove("pleitos-medium-card-expanded"); // Remover a classe do grid expandido
  } else {
    // Se nenhum campo estiver visível, exibir todos os campos e centralizar o card
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalhePleito");
    });
    card.classList.add("pleitos-medium-card-expanded"); // Adicionar a classe do grid expandido
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Adiciona um ouvinte de evento de clique para a lista de cards
const listaDeCards = document.querySelectorAll(".pleitos-medium-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", handleCardClick);
});
