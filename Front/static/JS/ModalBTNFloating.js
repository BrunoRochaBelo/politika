// Seleciona o botão e o modal
var botao = document.querySelector(".floatingButton");
var modal = document.querySelector(".modal-btn-floating-Overlay");

// Função para abrir o modal
function abrirModalBtnFloating() {
  modal.style.display = "flex";
  botao.innerHTML = "&times;"; // Altera o conteúdo do botão para "×"
}

// Função para fechar o modal
function fecharModal() {
  modal.style.display = "none";
  botao.textContent = "+"; // Altera o conteúdo do botão para "+"
}

// Adiciona um ouvinte de eventos ao botão para abrir o modal
botao.addEventListener("click", function (event) {
  event.stopPropagation(); // Impede que o evento se propague para o window
  if (modal.style.display === "none" || modal.style.display === "") {
    abrirModalBtnFloating();
  } else {
    fecharModal();
  }
});

// Adiciona um ouvinte de eventos ao modal para fechar quando clicado fora do conteúdo do modal
window.addEventListener("click", function (event) {
  // Verifica se o evento de clique não foi originado no botão antes de fechar o modal
  if (event.target !== botao) {
    fecharModal();
  }
});
