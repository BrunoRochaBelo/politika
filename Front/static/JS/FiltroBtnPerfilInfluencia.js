// Seleciona todos os botões com a classe 'btn-filter-leaked'
var buttons = document.querySelectorAll(".btn-filter-leaked");

// Adiciona um ouvinte de evento 'click' para cada botão
buttons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    // Pega o valor do atributo 'data-filter' do botão clicado
    var filterValue = event.currentTarget.getAttribute("data-filter");

    // Altera a URL da página para incluir o valor do filtro
    window.location.href = `/api/contato/filtro/${filterValue}`;
  });
});

// Seleciona todos os botões com a classe 'btn-filter-leaked'
// var buttons = document.querySelectorAll(".btn-filter-leaked");
// var searchErrorMessage = document.getElementById("searcherrorMessage");
// var errorMessageTimeout; // Variável para armazenar o ID do temporizador

// Adiciona um ouvinte de evento 'click' para cada botão
// buttons.forEach(function (button) {
//   button.addEventListener("click", function (event) {
//     // Pega o valor do atributo 'data-filter' do botão clicado
//     // var filterValue = event.currentTarget.getAttribute("data-filter");

//     // Limpar a mensagem de erro
//     // clearTimeout(errorMessageTimeout); // Cancelar o temporizador anterior
//     // searchErrorMessage.textContent = "";

//     // Aqui você pode enviar 'filterValue' para o backend
//     // fetch(`/api/contato/filtro/${filterValue}`, {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify({ filter: filterValue }), // enviar o valor do filtro como JSON
//     // })
//     //   .then((response) => {
//     //     if (!response.ok) {
//     //       throw new Error("Erro na solicitação");
//     //     }
//     //     return response.json();
//     //   })
//     //   .then((data) => console.log(data))
//     //   .catch((error) => {
//     //     console.error("Error:", error);
//     //     searchErrorMessage.textContent =
//     //       "Ocorreu um erro durante a pesquisa. Por favor, tente novamente.";
//     //     // Limpar a mensagem de erro após 3 segundos
//     //     clearTimeout(errorMessageTimeout); // Cancelar o temporizador anterior
//     //     errorMessageTimeout = setTimeout(function () {
//     //       searchErrorMessage.textContent = "";
//     //     }, 3000);
//     //   });
//   });
// });
