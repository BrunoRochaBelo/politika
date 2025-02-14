// Função para fechar manualmente o alerta
function closeAlert(botao) {
  const alerta = botao.parentElement;
  alerta.classList.remove("show");
  alerta.classList.add("fade");
  setTimeout(() => {
    alerta.remove();
  }, 150); // Tempo para o fade-out
}

// Fecha automaticamente os alertas após 5 segundos
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll(".alert").forEach((alerta) => {
      alerta.classList.remove("show");
      alerta.classList.add("fade");
      setTimeout(() => {
        alerta.remove();
      }, 150);
    });
  }, 5000);
});
