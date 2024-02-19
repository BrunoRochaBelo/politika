document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // para prevenir o comportamento padrão do formulário
    var searchInput = document.getElementById("searchInput").value; // pegar o valor do input
    var contatosList = document.getElementById("contatosList");
    var loadingMessage = document.getElementById("loadingMessage");
    var searchErrorMessage = document.getElementById("searcherrorMessage");
    var errorMessageTimeout; // Variável para armazenar o ID do temporizador

    // Limpar a mensagem de erro
    clearTimeout(errorMessageTimeout); // Cancelar o temporizador anterior
    searchErrorMessage.textContent = "";

    // Verificar se o campo de entrada está vazio
    if (!searchInput.trim()) {
      searchErrorMessage.textContent =
        "Por favor, insira um valor de pesquisa.";
      // Limpar a mensagem de erro após 3 segundos
      errorMessageTimeout = setTimeout(function () {
        searchErrorMessage.textContent = "";
      }, 3000);
      return;
    }

    // Antes de iniciar a solicitação
    contatosList.style.display = "none";
    loadingMessage.style.display = "block";

    // aqui você pode enviar 'searchInput' para o backend
    fetch("/backend-url-de-pesquisa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: searchInput }), // enviar o valor do input como JSON
    })
      .then((response) => {
        // Depois que a solicitação for concluída
        contatosList.style.display = "block";
        loadingMessage.style.display = "none";

        if (!response.ok) {
          throw new Error("Erro na solicitação");
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
        searchErrorMessage.textContent =
          "Ocorreu um erro durante a pesquisa. Por favor, tente novamente.";
        // Limpar a mensagem de erro após 3 segundos
        clearTimeout(errorMessageTimeout); // Cancelar o temporizador anterior
        errorMessageTimeout = setTimeout(function () {
          searchErrorMessage.textContent = "";
        }, 3000);
      });
  });

var searchInput = document.getElementById("searchInput");

// Adicionar um evento de escuta para o evento 'input'
searchInput.addEventListener("input", function (event) {
  console.log("Valor do campo de entrada alterado:", event.target.value);
});
