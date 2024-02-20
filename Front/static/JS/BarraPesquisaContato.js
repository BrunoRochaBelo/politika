class SearchForm {
  constructor() {
    this.searchForm = document.getElementById("searchForm");
    this.searchInput = document.getElementById("searchInput");
    this.contatosList = document.getElementById("contatosList");
    this.loadingMessage = document.getElementById("loadingMessage");
    this.searchErrorMessage = document.getElementById("searcherrorMessage");
    this.errorMessageTimeout = null;
    this.init();
  }

  fetchSearchData(searchInput) {
    this.contatosList.style.display = "none";
    this.loadingMessage.style.display = "block";

    fetch("/contato/listcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: searchInput }),
    })
      .then((response) => {
        this.contatosList.style.display = "block";
        this.loadingMessage.style.display = "none";

        if (!response.ok) {
          throw new Error("Erro na solicitação");
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
        this.searchErrorMessage.textContent =
          "Ocorreu um erro durante a pesquisa. Por favor, tente novamente.";
        clearTimeout(this.errorMessageTimeout);
        this.errorMessageTimeout = setTimeout(() => {
          this.searchErrorMessage.textContent = "";
        }, 3000);
      });
  }

  init() {
    this.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      var searchInputValue = this.searchInput.value;

      clearTimeout(this.errorMessageTimeout);
      this.searchErrorMessage.textContent = "";

      if (!searchInputValue.trim()) {
        this.searchErrorMessage.textContent =
          "Por favor, insira um valor de pesquisa.";
        this.errorMessageTimeout = setTimeout(() => {
          this.searchErrorMessage.textContent = "";
        }, 3000);
        return;
      }

      this.fetchSearchData(searchInputValue);
    });

    this.searchInput.addEventListener("input", (event) => {
      console.log("Valor do campo de entrada alterado:", event.target.value);
    });
  }
}

new SearchForm();
