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
  const currentVh = getComputedStyle(document.documentElement).getPropertyValue(
    "--vh"
  );

  if (currentVh !== `${vh}px`) {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
}

// Função debounced
const setVhVariableDebounced = debounce(setVhVariable, 100);

// Verifica se a API VisualViewport está disponível
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setVhVariableDebounced);
  // Remover o listener de 'scroll' se não for necessário
  // window.visualViewport.addEventListener("scroll", setVhVariableDebounced);
} else {
  // Fallback para o evento de redimensionamento da janela
  window.addEventListener("resize", setVhVariableDebounced);
}

// Usa ResizeObserver se disponível
if ("ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(setVhVariableDebounced);
  resizeObserver.observe(document.documentElement);
}

// Atualiza a variável na inicialização após o carregamento do DOM
document.addEventListener("DOMContentLoaded", setVhVariable);
