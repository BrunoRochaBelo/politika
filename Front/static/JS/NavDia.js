function selecionarDia(dia) {
  // Remover a classe "dia-visualize" de todos os dias
  var dias = document.querySelectorAll(".dia-semana");
  dias.forEach(function (diaElement) {
    diaElement.classList.remove("dia-visualize");
  });

  // Adicionar a classe "dia-visualize" ao dia selecionado
  var diaSelecionado = document.querySelector(
    '.dia-semana[data-dia="' + dia + '"]'
  );
  diaSelecionado.classList.add("dia-visualize");

  // Alterar as classes "dia-hidden" e "dia-visible" das áreas de conteúdo
  var conteudoSelecionado = document.getElementById(dia + "-feira");
  if (conteudoSelecionado) {
    conteudoSelecionado.classList.remove("dia-hidden");
    conteudoSelecionado.classList.add("dia-visible");
    // Definir o scroll do conteúdo selecionado para o topo
    conteudoSelecionado.scrollTo(0, 0);
  }

  // Hide all other content sections
  var diasOcultos = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ];
  diasOcultos.forEach(function (diaOculto) {
    if (diaOculto !== dia) {
      var conteudoOculto = document.getElementById(diaOculto + "-feira");
      if (conteudoOculto) {
        conteudoOculto.classList.remove("dia-visible");
        conteudoOculto.classList.add("dia-hidden");
      }
    }
  });
}
