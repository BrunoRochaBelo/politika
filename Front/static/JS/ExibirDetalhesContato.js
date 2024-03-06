// Função para iniciar a chamada telefônica
function iniciarChamadaTelefonica(card) {
  const num = card.querySelector(".contatos-small-card-num");
  window.location.href = "tel:" + num.textContent.trim();
}

// Função para lidar com o clique nos cards
function exibirDetalhesContato(event) {
  event.preventDefault();

  // Encontrar os campos ocultos
  const card = event.currentTarget;
  const camposOcultos = card.querySelectorAll(
    ".contatos-small-card-num, .contatos-small-card-email, .contatos-small-card-tipopessoa, .contatos-small-card-editar"
  );

  // Verificar se os campos estão visíveis
  const algumCampoVisivel = Array.from(camposOcultos).some((campo) =>
    campo.classList.contains("exibirDetalheContato")
  );

  // Se algum campo estiver visível, ocultar todos os campos
  if (algumCampoVisivel) {
    camposOcultos.forEach((campo) => {
      campo.classList.remove("exibirDetalheContato");
    });
    card.classList.remove("contatos-small-card-expanded"); // Remover a classe do grid expandido
  } else {
    // Se nenhum campo estiver visível, exibir todos os campos e centralizar o card
    camposOcultos.forEach((campo) => {
      campo.classList.add("exibirDetalheContato");
    });
    card.classList.add("contatos-small-card-expanded"); // Adicionar a classe do grid expandido
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Verificar se o clique foi no elemento 'contatos-small-card-phone'
  if (event.target.classList.contains("contatos-small-card-phone")) {
    iniciarChamadaTelefonica(card);
  }
}

// Adiciona um ouvinte de evento de clique para a lista de cards
const listaDeCards = document.querySelectorAll(".contatos-small-card");
listaDeCards.forEach((card) => {
  card.addEventListener("click", exibirDetalhesContato);
});
