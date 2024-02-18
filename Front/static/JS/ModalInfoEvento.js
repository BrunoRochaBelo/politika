// Variável global para armazenar o eventoId do card clicado
let currentEventoId;

// Seleciona todos os cardsEvento
let cardsEvento = document.querySelectorAll(".evento");

// Função para preencher o modal com os dados do card clicado
function fillModal(card) {
  document.querySelector("#modalEventoName").textContent = card.querySelector(
    '[data-filter="tituloEvento"]'
  ).innerText;
  document.querySelector("#modalEventoCategoria").textContent =
    card.querySelector('[data-filter="tagEvento"]').innerText;
  document.querySelector("#modalEventoParticipantes").textContent =
    card.querySelector('[data-filter="participantesEvento"]').innerText;
  document.querySelector("#modalEventoDuracao").textContent =
    card.querySelector('[data-filter="duracaoEvento"]').innerText;
}

// Função para fazer uma solicitação ao backend e obter os dados restantes do evento
function fetchEventData(eventoId) {
  fetch(`https://backend-url.com/eventos/${eventoId}`)
    .then((response) => response.json())
    .then((data) => {
      // Preenche os campos restantes do modal com os dados obtidos
      document.querySelector("#modalEventoTipo").textContent = data.tipo;
      document.querySelector("#modalEventoDataInicio").textContent =
        data.dataInicio;
      document.querySelector("#modalEventoDataFim").textContent = data.dataFim;
      document.querySelector("#modalEventoResponsavel").textContent =
        data.responsavel;
      document.querySelector("#modalEventoAssunto").textContent = data.assunto;
      document.querySelector("#modalEventoEndereco").textContent =
        data.endereco;
      document.querySelector("#modalEventoSala").textContent = data.sala;
      document.querySelector("#modalEventoRecursos").textContent =
        data.recursos;
      document.querySelector("#modalEventoAnotacoes").textContent =
        data.anotacoes;
    })
    .catch((error) => {
      // Exibe um erro no modal se a solicitação falhar
      document.querySelector("#modalEventoError").textContent =
        "Erro ao obter restante dos dados do evento";
    });
}

// Adiciona um evento de clique a cada card
cardsEvento.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.stopPropagation(); // Adiciona esta linha para parar a propagação do evento
    event.preventDefault();

    // Abre o modal
    let modal = document.querySelector("#modal-info-evento");
    modal.classList.add("show_evento_modal");

    // Preenche os campos do modal com os dados do card
    fillModal(card);

    // Faz uma solicitação ao backend para obter os dados restantes
    currentEventoId = card.getAttribute("data-idEvento");
    fetchEventData(currentEventoId);
  });
});

// Função para fechar o modal
function closeModal() {
  let modal = document.querySelector("#modal-info-evento");
  if (modal.classList.contains("show_evento_modal")) {
    // Adiciona esta linha para verificar se o modal está sendo exibido
    modal.classList.remove("show_evento_modal");
  }
}

// Adiciona um evento de clique ao botão de fechar do modal
document
  .querySelector("#modal-info-evento .close_evento_modal")
  .addEventListener("click", closeModal);

// Adiciona um evento de clique ao fundo do modal para fechá-lo
document
  .querySelector("#modal-info-evento")
  .addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  });

// Adiciona um evento de tecla ao document para fechar o modal ao pressionar ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Adiciona um evento de clique ao botão "Editar" que redireciona para a URL de edição
document
  .querySelector("#modalEventoEditButton")
  .addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/evento/put/${currentEventoId}`;
  });
