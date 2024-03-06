// Função para lidar com o clique nos cartões de despesas
function exibirDetalhesDespesa(event) {
  event.preventDefault();

  // Encontrar os campos ocultos
  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".despesas-medium-card-cnpj_cpf_for, .despesas-medium-card-nome_fornecedor, .despesas-medium-card-ordenador_despesa, .despesas-medium-card-autor, .despesas-medium-card-data_criacao, .despesas-medium-card-editar"
  );

  // Verificar se os campos estão visíveis
  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheDespesa")
  );

  // Se algum campo estiver visível, ocultar todos os campos
  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheDespesa");
    });
    card.classList.remove("despesas-medium-card-expanded"); // Remover a classe do grid expandido
  } else {
    // Se nenhum campo estiver visível, exibir todos os campos e centralizar o card
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheDespesa");
    });
    card.classList.add("despesas-medium-card-expanded"); // Adicionar a classe do grid expandido
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Adiciona um ouvinte de evento de clique para a lista de cartões de despesas
const listaDeCards = document.querySelectorAll(".despesas-medium-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", exibirDetalhesDespesa);
});
