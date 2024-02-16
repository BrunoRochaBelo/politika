// Função de pesquisa
function search() {
  // Obter o valor do campo de entrada
  var searchInput = document.getElementById("searchInput").value.trim();

  // Verificar se o valor está vazio
  if (searchInput === "") {
    document.getElementById("searcherrorMessage").textContent =
      "Por favor, insira um termo de pesquisa.";
    return;
  }

  // Fazer a solicitação GET para a API de pesquisa do servidor
  fetch(
    "https://api.doseuservidor.com/search?query=" +
      encodeURIComponent(searchInput)
  )
    .then((response) => {
      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro: " + response.status);
      }

      // Converter a resposta em JSON
      return response.json();
    })
    .then((data) => {
      // Atualizar o total de resultados
      document.getElementById("totalResults").textContent = data.length;

      // Limpar a lista de contatos
      while (contatosList.firstChild) {
        contatosList.removeChild(contatosList.firstChild);
      }

      // Criar novos itens de lista para cada contato
      data.forEach((contact) => {
        var li = document.createElement("li");
        li.textContent = contact.name;
        contatosList.appendChild(li);
      });

      // Limpar a mensagem de erro
      document.getElementById("searcherrorMessage").textContent = "";
    })
    .catch((error) => {
      // Exibir a mensagem de erro
      document.getElementById("searcherrorMessage").textContent =
        "Ocorreu um erro: " + error.message;
    });
}

// Adicionar um evento de escuta ao campo de entrada
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Impede a ação padrão do Enter
      search();
    }
  });
