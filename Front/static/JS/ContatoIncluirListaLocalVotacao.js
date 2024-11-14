document.addEventListener("DOMContentLoaded", () => {
  const ufFieldVotacao = document.getElementById("ufLocalVotacao");
  const cityFieldVotacao = document.getElementById("cidadeLocalVotacao");
  const localVotacaoField = document.getElementById("localVotacao");
  const suggestionsDivVotacao = document.getElementById(
    "suggestions-localVotacao"
  );
  const loadingIndicatorVotacao = document.getElementById(
    "loading-indicator-localVotacao"
  );

  let selectedIndexVotacao = -1;
  let currentSuggestionsVotacao = [];
  let isSelectingSuggestionVotacao = false;
  let selectedSuggestionNameVotacao = null;

  const debounceVotacao = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const showLoadingVotacao = () => {
    loadingIndicatorVotacao.style.display = "block";
  };

  const hideLoadingVotacao = () => {
    loadingIndicatorVotacao.style.display = "none";
  };

  const showErrorVotacao = (message) => {
    let errorDivVotacao = document.querySelector(".message-error-localVotacao");
    if (!errorDivVotacao) {
      errorDivVotacao = document.createElement("div");
      errorDivVotacao.classList.add(
        "message-error",
        "message-error-localVotacao"
      );
      document.body.appendChild(errorDivVotacao);
    }
    errorDivVotacao.textContent = message;
    errorDivVotacao.classList.add("show");

    setTimeout(() => {
      errorDivVotacao.classList.remove("show");
    }, 3000);
  };

  const fetchLocalSuggestions = async (query) => {
    const uf = ufFieldVotacao.value;
    const city = cityFieldVotacao.value;

    // Obtém a URL base do config.js com base no ambiente atual
    const baseURL = Config.BASE_URL[Config.ENVIRONMENT];

    // Obtém o endpoint para buscar locais de votação
    const endpoint = Config.API_ENDPOINTS.VOTATION_LOCATION_SEARCH_ALL;

    // Monta a URL completa utilizando as variáveis do config.js
    const url = `${baseURL}${endpoint}/${uf}/${city}/${encodeURIComponent(
      query
    )}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar os dados da API");
      const data = await response.json();
      return data.DADOS || [];
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      showErrorVotacao("Erro ao buscar dados. Tente novamente.");
      return [];
    } finally {
      hideLoadingVotacao();
    }
  };

  const displaySuggestionsVotacao = (suggestions) => {
    currentSuggestionsVotacao = suggestions;
    suggestionsDivVotacao.innerHTML = "";

    if (suggestions.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "Nenhum resultado encontrado";
      suggestionsDivVotacao.appendChild(noResultsMessage);
      suggestionsDivVotacao.classList.add("visible");
      return;
    }

    const ul = document.createElement("ul");
    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      li.textContent = suggestion.nome_local;

      li.addEventListener("mousedown", () => {
        isSelectingSuggestionVotacao = true;
      });

      li.addEventListener("click", () => {
        localVotacaoField.value = suggestion.nome_local;
        selectedSuggestionNameVotacao = suggestion.nome_local;
        suggestionsDivVotacao.innerHTML = "";
        suggestionsDivVotacao.classList.remove("visible");
        isSelectingSuggestionVotacao = false;
        validateInputVotacao();
      });
      ul.appendChild(li);
    });
    suggestionsDivVotacao.appendChild(ul);
    suggestionsDivVotacao.classList.add("visible");
  };

  const updateSelectionVotacao = (list) => {
    list.forEach((item, index) => {
      if (index === selectedIndexVotacao) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  };

  const validateInputVotacao = () => {
    const inputValue = localVotacaoField.value.trim();
    if (inputValue === "") {
      localVotacaoField.classList.remove("input-valid");
      return false;
    }

    if (inputValue === selectedSuggestionNameVotacao) {
      localVotacaoField.classList.add("input-valid");
      return true;
    } else {
      localVotacaoField.classList.remove("input-valid");
      return false;
    }
  };

  const handleInputVotacao = debounceVotacao(async () => {
    const query = localVotacaoField.value.trim();
    selectedIndexVotacao = -1;
    selectedSuggestionNameVotacao = null;
    if (query.length > 0) {
      showLoadingVotacao();
      const suggestions = await fetchLocalSuggestions(query);
      displaySuggestionsVotacao(suggestions);
    } else {
      currentSuggestionsVotacao = [];
      suggestionsDivVotacao.innerHTML = "";
      suggestionsDivVotacao.classList.remove("visible");
      hideLoadingVotacao();
    }
    validateInputVotacao();
  }, 300);

  localVotacaoField.addEventListener("input", () => handleInputVotacao());

  localVotacaoField.addEventListener("keydown", (event) => {
    const suggestionsList = suggestionsDivVotacao.querySelectorAll("li");
    if (suggestionsList.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndexVotacao =
          (selectedIndexVotacao + 1) % suggestionsList.length;
        updateSelectionVotacao(suggestionsList);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndexVotacao =
          (selectedIndexVotacao - 1 + suggestionsList.length) %
          suggestionsList.length;
        updateSelectionVotacao(suggestionsList);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndexVotacao > -1) {
          isSelectingSuggestionVotacao = true;
          suggestionsList[selectedIndexVotacao].click();
          isSelectingSuggestionVotacao = false;
        }
      } else if (event.key === "Escape") {
        suggestionsDivVotacao.innerHTML = "";
        suggestionsDivVotacao.classList.remove("visible");
      }
    } else if (event.key === "Escape") {
      suggestionsDivVotacao.innerHTML = "";
      suggestionsDivVotacao.classList.remove("visible");
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !suggestionsDivVotacao.contains(event.target) &&
      event.target !== localVotacaoField
    ) {
      suggestionsDivVotacao.innerHTML = "";
      suggestionsDivVotacao.classList.remove("visible");
    }
  });

  localVotacaoField.addEventListener("blur", () => {
    setTimeout(() => {
      if (isSelectingSuggestionVotacao) {
        isSelectingSuggestionVotacao = false;
        return;
      }

      const isValid = validateInputVotacao();
      const inputValue = localVotacaoField.value.trim();

      if (inputValue === "") {
        localVotacaoField.classList.remove("input-valid");
        return;
      }

      if (!isValid) {
        localVotacaoField.value = "";
        showErrorVotacao("Por favor, selecione uma opção válida da lista.");
      }
    }, 100);
  });
});
