document.addEventListener("DOMContentLoaded", function () {
  const apiBaseUrl = "http://192.168.1.19:5000/api/contato/searchall";

  // Função para buscar sugestões da API
  async function fetchSuggestions(query, fieldSearch, target) {
    // Define o parâmetro `tp` como 2 fixo
    const tp = 2;

    // Constrói a URL com os parâmetros de consulta
    const url = `${apiBaseUrl}/${query}?tp=${tp}&fs=${fieldSearch || ""}`;

    // Exibe o indicador de carregamento
    const loadingIndicator = document.getElementById(
      `loading-indicator-${target}`
    );
    loadingIndicator.style.display = "inline-block";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Falha na comunicação com a API.");
      }

      const results = await response.json();
      return results.DADOS; // Retorna a lista de dados
    } catch (error) {
      console.error("Erro na busca:", error.message);
      return { error: true, message: error.message };
    } finally {
      // Esconde o indicador de carregamento
      loadingIndicator.style.display = "none";
    }
  }

  // Função para exibir as sugestões
  function showSuggestions(suggestions, target) {
    const suggestionsList = document.getElementById(`suggestions-${target}`);
    suggestionsList.innerHTML = "";

    if (suggestions.error) {
      suggestionsList.innerHTML = `<li class="error">${suggestions.message}</li>`;
      setTimeout(() => {
        suggestionsList.innerHTML = "";
      }, 3000); // Fecha a lista após 3 segundos
    } else if (suggestions.length === 0) {
      suggestionsList.innerHTML = "<li>Nenhuma correspondência encontrada</li>";
      setTimeout(() => {
        suggestionsList.innerHTML = "";
      }, 3000); // Fecha a lista após 3 segundos
    } else {
      suggestions.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.cnpj_cpf}`;
        li.addEventListener("click", () => fillForm(item));
        suggestionsList.appendChild(li);
      });
    }
  }

  // Função para preencher o formulário ao selecionar uma sugestão
  function fillForm(item) {
    document.getElementById("cnpj_cpf_fornecedor").value = item.cnpj_cpf;
    document.getElementById("nome_fornecedor").value = item.name;

    // Limpa as sugestões após a seleção
    document.getElementById("suggestions-cnpj").innerHTML = "";
    document.getElementById("suggestions-nome").innerHTML = "";
  }

  // Função debounce para limitar a quantidade de requisições
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Adiciona o evento de input para o campo CNPJ/CPF
  document.getElementById("cnpj_cpf_fornecedor").addEventListener(
    "input",
    debounce(async function () {
      const query = this.value;
      if (query.length >= 3) {
        const suggestions = await fetchSuggestions(query, 2, "cnpj");
        showSuggestions(suggestions, "cnpj");
      }
    }, 300)
  );

  // Adiciona o evento de input para o campo Nome
  document.getElementById("nome_fornecedor").addEventListener(
    "input",
    debounce(async function () {
      const query = this.value;
      if (query.length >= 3) {
        const suggestions = await fetchSuggestions(query, 1, "nome");
        showSuggestions(suggestions, "nome");
      }
    }, 300)
  );
});
