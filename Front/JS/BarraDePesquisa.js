async function search() {
  const searchTerm = document.getElementById("searchInput").value;
  const searchButton = document.getElementById("searchButton");

  if (!searchTerm.trim()) {
    alert("Por favor, digite um termo de pesquisa.");
    return;
  }

  try {
    // Desabilita o botão de pesquisa e mostra o indicador de carregamento
    disableSearchButton();
    showLoadingIndicator();

    const response = await fetch("url-do-backend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm }),
    });

    if (response.ok) {
      const data = await response.json();
      displayResults(data);
    } else {
      console.error("Erro na resposta do backend:", response.status);
      // Mostra mensagem de erro na interface
      showErrorMessage(
        "Erro ao buscar resultados. Por favor, tente novamente."
      );
    }
  } catch (error) {
    console.error("Erro ao realizar a solicitação:", error);
    // Mostra mensagem de erro na interface
    showErrorMessage("Erro ao buscar resultados. Por favor, tente novamente.");
  } finally {
    // Habilita o botão de pesquisa e esconde o indicador de carregamento
    enableSearchButton();
    hideLoadingIndicator();
  }
}

function displayResults(results) {
  const resultsContainer = document.getElementById("resultsContainer");
  const contatosList = document.getElementById("contatosList");
  const totalResultsElement = document.getElementById("totalResults");

  contatosList.innerHTML = ""; // Limpa a lista existente

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    totalResultsElement.textContent = "0";
    return;
  }

  totalResultsElement.textContent = results.length; // Atualiza o número total de resultados

  results.forEach((result) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="card-s contatos-small-card" href="#">
        <p class="contatos-small-card-title">${result.nome}</p>
        <div class="contatos-small-card-num">${result.telefone}</div>
        <div class="contatos-small-card-star" data-filter="marcador3">
          <img src="imagens/icones/tres-estrelas.svg" alt="Perfil influencia Icon">
        </div>
        <div class="contatos-small-card-phone" data-filter="marcador3">
          <img src="imagens/icones/phone.svg" alt="Ligar Icon">
        </div>
      </a>
    `;
    li.classList.add("result-item");
    contatosList.appendChild(li);
  });

  // Limpa a mensagem de nenhum resultado encontrado
  resultsContainer.innerHTML = "";
}

// Funções de indicador de carregamento e mensagem de erro
function showLoadingIndicator() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.style.display = "block";
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.style.display = "none";
}

function disableSearchButton() {
  const searchButton = document.getElementById("searchButton");
  searchButton.disabled = true;
}

function enableSearchButton() {
  const searchButton = document.getElementById("searchButton");
  searchButton.disabled = false;
}

function showErrorMessage(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
}
