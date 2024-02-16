function search() {
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    alert("Por favor, insira um termo de pesquisa.");
    return;
  }

  fetch(`/api/search?query=${encodeURIComponent(searchValue)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro na resposta do servidor: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const resultsContainer = document.getElementById("resultsContainer");
      const contatosList = document.getElementById("contatosList");
      const totalResults = document.getElementById("totalResults");

      // Limpa a lista de contatos existente
      contatosList.innerHTML = "";

      // Atualiza o total de resultados
      totalResults.textContent = data.length;

      // Cria e adiciona novos itens de contato à lista
      data.forEach((contact) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <a class="card-s contatos-small-card" href="#">
            <p class="contatos-small-card-title">${contact.name}</p>
            <div class="contatos-small-card-num">${contact.phone}</div>
            <div class="contatos-small-card-star"><img src="imagens/icones/tres-estrelas.svg" alt="Perfil influencia Icon"></div>
            <div class="contatos-small-card-phone"><img src="imagens/icones/phone.svg" alt="Ligar Icon"></div>
          </a>
        `;
        contatosList.appendChild(listItem);
      });

      // Mostra o contêiner de resultados
      resultsContainer.style.display = "block";
    })
    .catch((error) => {
      console.error("Erro na pesquisa:", error);
      alert(
        "Ocorreu um erro ao realizar a pesquisa. Por favor, tente novamente mais tarde."
      );
    });
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search();
  }
});
