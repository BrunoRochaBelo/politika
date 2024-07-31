// Função para atualizar a variável CSS --vh
function setVhVariable() {
  if (window.innerHeight && document.documentElement.style.setProperty) {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
}

// Debounce para otimizar o evento de redimensionamento
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Verificar se addEventListener está disponível
if (window.addEventListener && document.addEventListener) {
  // Atualizar a variável --vh na inicialização e quando a janela é redimensionada
  const setVhVariableDebounced = debounce(setVhVariable, 100);
  window.addEventListener("resize", setVhVariableDebounced);
  document.addEventListener("DOMContentLoaded", setVhVariable);
} else if (window.attachEvent) {
  // Fallback para navegadores mais antigos que usam attachEvent
  window.attachEvent("onresize", setVhVariable);
  document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") {
      setVhVariable();
    }
  });
}

// Chamar a função imediatamente na inicialização
setVhVariable();
