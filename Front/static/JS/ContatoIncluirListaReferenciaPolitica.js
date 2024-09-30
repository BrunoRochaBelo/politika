document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("indicacao");
  const suggestionsDiv = document.getElementById("suggestions");
  const loadingIndicator = document.getElementById("loading-indicator");

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  let selectedIndex = -1;
  let currentSuggestions = [];
  let isSelectingSuggestion = false;
  let selectedSuggestionName = null;

  const showError = (message) => {
    let errorDiv = document.querySelector(".message-error");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.classList.add("message-error");
      document.body.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add("show");

    setTimeout(() => {
      errorDiv.classList.remove("show");
    }, 3000);
  };

  const showLoading = () => {
    loadingIndicator.style.display = "block";
  };

  const hideLoading = () => {
    loadingIndicator.style.display = "none";
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `http://dev.inforvia.com.br/api/contato/searchall/${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados da API");
      }
      const data = await response.json();
      return data.DADOS || [];
    } catch (error) {
      showError("Erro ao buscar dados. Tente novamente.");
      return [];
    } finally {
      hideLoading();
    }
  };

  const validateInput = () => {
    const inputValue = inputField.value.trim();
    if (inputValue === "") {
      inputField.classList.remove("input-valid");
      return false;
    }

    if (inputValue === selectedSuggestionName) {
      inputField.classList.add("input-valid");
      return true;
    } else {
      inputField.classList.remove("input-valid");
      return false;
    }
  };

  const displaySuggestions = (suggestions) => {
    currentSuggestions = suggestions;
    suggestionsDiv.innerHTML = "";

    if (suggestions.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "Nenhum resultado encontrado";
      suggestionsDiv.appendChild(noResultsMessage);
      suggestionsDiv.classList.add("visible");
      return;
    }

    const ul = document.createElement("ul");
    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      li.textContent = suggestion.name;

      li.addEventListener("mousedown", () => {
        isSelectingSuggestion = true;
      });

      li.addEventListener("click", () => {
        inputField.value = suggestion.name;
        selectedSuggestionName = suggestion.name;
        suggestionsDiv.innerHTML = "";
        suggestionsDiv.classList.remove("visible");
        isSelectingSuggestion = false;
        validateInput();
      });
      ul.appendChild(li);
    });
    suggestionsDiv.appendChild(ul);
    suggestionsDiv.classList.add("visible");
  };

  const updateSelection = (list) => {
    list.forEach((item, index) => {
      if (index === selectedIndex) {
        item.classList.add("selected");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("selected");
      }
    });
  };

  const handleInput = debounce(async () => {
    const query = inputField.value.trim();
    selectedIndex = -1;
    selectedSuggestionName = null;
    if (query.length > 0) {
      showLoading();
      const suggestions = await fetchSuggestions(query);
      displaySuggestions(suggestions);
    } else {
      currentSuggestions = [];
      suggestionsDiv.innerHTML = "";
      suggestionsDiv.classList.remove("visible");
      hideLoading();
    }
    validateInput();
  }, 300);

  inputField.addEventListener("input", () => {
    handleInput();
  });

  inputField.addEventListener("keydown", (event) => {
    const suggestionsList = suggestionsDiv.querySelectorAll("li");
    if (suggestionsList.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % suggestionsList.length;
        updateSelection(suggestionsList);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectedIndex =
          (selectedIndex - 1 + suggestionsList.length) % suggestionsList.length;
        updateSelection(suggestionsList);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndex > -1) {
          isSelectingSuggestion = true;
          suggestionsList[selectedIndex].click();
          isSelectingSuggestion = false;
        }
      } else if (event.key === "Escape") {
        suggestionsDiv.innerHTML = "";
        suggestionsDiv.classList.remove("visible");
      }
    } else if (event.key === "Escape") {
      suggestionsDiv.innerHTML = "";
      suggestionsDiv.classList.remove("visible");
    }
  });

  document.addEventListener("click", (event) => {
    if (!suggestionsDiv.contains(event.target) && event.target !== inputField) {
      suggestionsDiv.innerHTML = "";
      suggestionsDiv.classList.remove("visible");
    }
  });

  inputField.addEventListener("blur", () => {
    setTimeout(() => {
      if (isSelectingSuggestion) {
        isSelectingSuggestion = false;
        return;
      }

      const isValid = validateInput();

      const inputValue = inputField.value.trim();
      if (inputValue === "") {
        inputField.classList.remove("input-valid");
        return;
      }

      if (!isValid) {
        inputField.value = "";
        showError("Por favor, selecione uma opção válida da lista.");
      }
    }, 100);
  });
});
