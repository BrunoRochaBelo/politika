// Função para atualizar a variável CSS --vh
function setVhVariable() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Atualizar a variável --vh na inicialização e quando a janela é redimensionada
window.addEventListener("resize", setVhVariable);
document.addEventListener("DOMContentLoaded", setVhVariable);
