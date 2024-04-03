// Adiciona um event listener para o evento beforeunload
window.addEventListener("beforeunload", function () {
  // Substitui o estado atual do histórico de navegação pela página atual
  history.replaceState(null, null, window.location.href);
});
