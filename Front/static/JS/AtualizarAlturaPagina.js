// Função debounce para limitar a taxa de execução de uma função
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Função para atualizar a variável CSS --vh
function setVhVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Verifica se a API VisualViewport está disponível
if (window.visualViewport) {
  const setVhVariableDebounced = debounce(setVhVariable, 50);
  window.visualViewport.addEventListener("resize", setVhVariableDebounced);
  window.visualViewport.addEventListener("scroll", setVhVariableDebounced);
} else {
  // Fallback para o evento de redimensionamento da janela
  const setVhVariableDebounced = debounce(setVhVariable, 50);
  window.addEventListener("resize", setVhVariableDebounced);
}

// Atualiza a variável na inicialização
document.addEventListener("DOMContentLoaded", setVhVariable);
setVhVariable();
