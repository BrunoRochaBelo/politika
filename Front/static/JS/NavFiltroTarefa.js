document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todos os itens da lista
  var filtroTarefaItems = document.querySelectorAll(".filtro-tarefa");

  // Adiciona um evento de clique a cada item
  filtroTarefaItems.forEach(function (item) {
    item.addEventListener("click", function () {
      // Remove a classe "filtro-visualize" de todos os itens
      filtroTarefaItems.forEach(function (item) {
        item.classList.remove("filtro-visualize");
      });

      // Adiciona a classe "filtro-visualize" ao item clicado
      this.classList.add("filtro-visualize");
    });
  });
});
