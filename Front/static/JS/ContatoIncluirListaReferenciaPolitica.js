document.addEventListener("DOMContentLoaded", () => {
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
    loadingIndicatorRefPoli.style.display = "block";
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
      return [];
    }

    // Monta a URL completa utilizando as variáveis do config.js
    const url = `${baseURL}${endpoint}/${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar os dados da API");
      const data = await response.json();
      return data.DADOS || [];
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      showErrorRefPoli("Erro ao buscar dados. Tente novamente.");
      return [];
    } finally {
      hideLoadingRefPoli();
    }
  };

  const displaySuggestionsRefPoli = (suggestions) => {
    currentSuggestionsRefPoli = suggestions;
    suggestionsDivRefPoli.innerHTML = "";

    if (suggestions.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "Nenhum resultado encontrado";
      suggestionsDivRefPoli.appendChild(noResultsMessage);
      suggestionsDivRefPoli.classList.add("visible");
      return;
    }

    const ul = document.createElement("ul");
    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      li.textContent = suggestion.name;

      li.addEventListener("mousedown", () => {
        isSelectingSuggestionRefPoli = true;
      });

      li.addEventListener("click", () => {
        inputFieldRefPoli.value = suggestion.name;
        selectedSuggestionNameRefPoli = suggestion.name;
        suggestionsDivRefPoli.innerHTML = "";
        suggestionsDivRefPoli.classList.remove("visible");
        isSelectingSuggestionRefPoli = false;
        validateInputRefPoli();
      });
      ul.appendChild(li);
    });
    suggestionsDivRefPoli.appendChild(ul);
    suggestionsDivRefPoli.classList.add("visible");
  };

  const updateSelectionRefPoli = (list) => {
    list.forEach((item, index) => {
      if (index === selectedIndexRefPoli) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  };

  const validateInputRefPoli = () => {
    const inputValue = inputFieldRefPoli.value.trim();
    if (inputValue === "") {
      inputFieldRefPoli.classList.remove("input-valid");
      return false;
    }

    if (inputValue === selectedSuggestionNameRefPoli) {
      inputFieldRefPoli.classList.add("input-valid");
      return true;
    } else {
      inputFieldRefPoli.classList.remove("input-valid");
      return false;
    }
  };

  const handleInputRefPoli = debounceRefPoli(async () => {
    const query = inputFieldRefPoli.value.trim();
    selectedIndexRefPoli = -1;
    selectedSuggestionNameRefPoli = null;
    if (query.length > 0) {
      showLoadingRefPoli();
      const suggestions = await fetchSuggestionsRefPoli(query);
      displaySuggestionsRefPoli(suggestions);
    } else {
      currentSuggestionsRefPoli = [];
      suggestionsDivRefPoli.innerHTML = "";
      suggestionsDivRefPoli.classList.remove("visible");
      hideLoadingRefPoli();
    }
    validateInputRefPoli();
  }, 300);

  inputFieldRefPoli.addEventListener("input", () => handleInputRefPoli());

  inputFieldRefPoli.addEventListener("keydown", (event) => {
    const suggestionsList = suggestionsDivRefPoli.querySelectorAll("li");
    if (suggestionsList.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndexRefPoli =
          (selectedIndexRefPoli + 1) % suggestionsList.length;
        updateSelectionRefPoli(suggestionsList);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndexRefPoli =
          (selectedIndexRefPoli - 1 + suggestionsList.length) %
          suggestionsList.length;
        updateSelectionRefPoli(suggestionsList);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndexRefPoli > -1) {
          isSelectingSuggestionRefPoli = true;
          suggestionsList[selectedIndexRefPoli].click();
          isSelectingSuggestionRefPoli = false;
        }
      } else if (event.key === "Escape") {
        suggestionsDivRefPoli.innerHTML = "";
        suggestionsDivRefPoli.classList.remove("visible");
      }
    } else if (event.key === "Escape") {
      suggestionsDivRefPoli.innerHTML = "";
      suggestionsDivRefPoli.classList.remove("visible");
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !suggestionsDivRefPoli.contains(event.target) &&
      event.target !== inputFieldRefPoli
    ) {
      suggestionsDivRefPoli.innerHTML = "";
      suggestionsDivRefPoli.classList.remove("visible");
    }
  });

  inputFieldRefPoli.addEventListener("blur", () => {
    setTimeout(() => {
      if (isSelectingSuggestionRefPoli) {
        isSelectingSuggestionRefPoli = false;
        return;
      }

      const isValid = validateInputRefPoli();
      const inputValue = inputFieldRefPoli.value.trim();

      if (inputValue === "") {
        inputFieldRefPoli.classList.remove("input-valid");
        return;
      }

      if (!isValid) {
        inputFieldRefPoli.value = "";
        showErrorRefPoli("Por favor, selecione uma opção válida da lista.");
      }
    }, 100);
  });
});
