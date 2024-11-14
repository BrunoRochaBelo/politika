document.addEventListener("DOMContentLoaded", function () {
  const inputFieldRefPoli = document.getElementById("indicacao");
  const suggestionsDivRefPoli = document.getElementById("suggestions-ref-poli");
  const loadingIndicatorRefPoli = document.getElementById("loading-indicator");

  let selectedIndexRefPoli = -1;
  let currentSuggestionsRefPoli = [];
  let isSelectingSuggestionRefPoli = false;
  let selectedSuggestionNameRefPoli = null;

  const debounceRefPoli = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const showLoadingRefPoli = () => {
    loadingIndicatorRefPoli.style.display = "inline-block";
  };

  const hideLoadingRefPoli = () => {
    loadingIndicatorRefPoli.style.display = "none";
  };

  const showErrorRefPoli = (message) => {
    let errorDivRefPoli = document.querySelector(".message-error-refpoli");
    if (!errorDivRefPoli) {
      errorDivRefPoli = document.createElement("div");
      errorDivRefPoli.classList.add("message-error", "message-error-refpoli");
      document.body.appendChild(errorDivRefPoli);
    }
    errorDivRefPoli.textContent = message;
    errorDivRefPoli.classList.add("show");

    setTimeout(() => {
      errorDivRefPoli.classList.remove("show");
    }, 3000);
  };

  const fetchSuggestionsRefPoli = async (query) => {
    // Obtém a URL base do config.js com base no ambiente atual
    const baseURL = Config.BASE_URL[Config.ENVIRONMENT];

    // Obtém o endpoint para buscar contatos
    const endpoint = Config.API_ENDPOINTS.CONTACT_SEARCH_ALL;

    // Verifica se baseURL e endpoint estão definidos
    if (!baseURL || !endpoint) {
      console.error("Configuração de URL base ou endpoint não encontrada.");
      showErrorRefPoli("Erro de configuração. Tente novamente mais tarde.");
      return {
        error: true,
        message: "Configuração de URL base ou endpoint não encontrada.",
      };
    }

    // Define o parâmetro `tp` como 2 fixo
    const tp = 2;

    // Monta a URL completa utilizando as variáveis do config.js
    const url = `${baseURL}${endpoint}/${encodeURIComponent(
      query
    )}?tp=${tp}&fs=${fieldSearch || ""}`;

    // Exibe o indicador de carregamento
    showLoadingRefPoli();

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Falha na comunicação com a API.");
      }

      const results = await response.json();
      return results.DADOS || [];
    } catch (error) {
      console.error("Erro na busca:", error.message);
      showErrorRefPoli("Erro ao buscar dados. Tente novamente.");
      return { error: true, message: error.message };
    } finally {
      // Esconde o indicador de carregamento
      hideLoadingRefPoli();
    }
  };

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
        const suggestions = await fetchSuggestionsRefPoli(query, 2, "cnpj");
        showSuggestions(suggestions, "cnpj");
      } else {
        document.getElementById("suggestions-cnpj").innerHTML = "";
        document.getElementById("suggestions-cnpj").classList.remove("visible");
      }
    }, 300)
  );

  // Adiciona o evento de input para o campo Nome
  document.getElementById("nome_fornecedor").addEventListener(
    "input",
    debounce(async function () {
      const query = this.value;
      if (query.length >= 3) {
        const suggestions = await fetchSuggestionsRefPoli(query, 1, "nome");
        showSuggestions(suggestions, "nome");
      } else {
        document.getElementById("suggestions-nome").innerHTML = "";
        document.getElementById("suggestions-nome").classList.remove("visible");
      }
    }, 300)
  );
});
