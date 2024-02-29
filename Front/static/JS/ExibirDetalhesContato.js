function ExibirDetalhesContato(event) {
  // Verifica se o clique foi no elemento 'contatos-small-card-phone'
  if (event.target.classList.contains("contatos-small-card-phone")) {
    var num = event.currentTarget.querySelector(".contatos-small-card-num");
    window.location.href = "tel:" + num.textContent.trim(); // Inicia uma chamada telefônica
  } else {
    // Rola a página para o card
    event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" });

    // Encontra os elementos dentro do card clicado
    var num = event.currentTarget.querySelector(".contatos-small-card-num");
    var tipoPessoa = event.currentTarget.querySelector(
      ".contatos-small-card-tipopessoa"
    );
    var email = event.currentTarget.querySelector(".contatos-small-card-email");
    var editar = event.currentTarget.querySelector(
      ".contatos-small-card-editar"
    );

    // Alterna a classe 'exibirDetalheContato' nos elementos
    num.classList.toggle("exibirDetalheContato");
    tipoPessoa.classList.toggle("exibirDetalheContato");
    email.classList.toggle("exibirDetalheContato");
    editar.classList.toggle("exibirDetalheContato");
  }
}

// Adiciona o evento de clique a todos os cards do evento
document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".contatos-small-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", ExibirDetalhesContato);
  }
});
