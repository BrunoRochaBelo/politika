// A classe SearchForm é responsável por gerenciar a funcionalidade de pesquisa de contatos.
class SearchForm {
  // O construtor inicializa os elementos do DOM necessários e chama o método init para configurar os listeners de eventos.
  constructor() {
    // Inicializa os elementos do DOM
    this.searchForm = document.getElementById("searchForm");
    this.searchInput = document.getElementById("searchInput");
    this.contatosList = document.getElementById("contatosList");
    this.loadingMessage = document.getElementById("loadingMessage");
    this.searchErrorMessage = document.getElementById("searcherrorMessage");
    // Inicializa o timeout da mensagem de erro
    this.errorMessageTimeout = null;
    // Configura os listeners de eventos
    this.init();
  }

  // O método fetchSearchData faz uma solicitação POST para "/contato/listcard" com o valor de entrada da pesquisa.
  fetchSearchData(searchInput) {
    // Esconde a lista de contatos e mostra a mensagem de carregamento
    this.contatosList.style.display = "none";
    this.loadingMessage.style.display = "block";

    // Faz a solicitação POST
    fetch("/contato/listcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: searchInput }),
    })
      .then((response) => {
        // Mostra a lista de contatos e esconde a mensagem de carregamento
        this.contatosList.style.display = "block";
        this.loadingMessage.style.display = "none";

        // Se a resposta não for ok, lança um erro
        if (!response.ok) {
          throw new Error("Erro na solicitação");
        }
        // Retorna a resposta como JSON
        return response.json();
      })
      .then((data) => console.log(data)) // Loga os dados recebidos
      .catch((error) => {
        // Em caso de erro, mostra uma mensagem de erro e a esconde após 3 segundos
        console.error("Error:", error);
        this.searchErrorMessage.textContent =
          "Ocorreu um erro durante a pesquisa. Por favor, tente novamente.";
        clearTimeout(this.errorMessageTimeout);
        this.errorMessageTimeout = setTimeout(() => {
          this.searchErrorMessage.textContent = "";
        }, 3000);
      });
  }

  // O método init configura os listeners de eventos para o formulário de pesquisa e o campo de entrada.
  init() {
    // Adiciona um listener de evento de submit ao formulário de pesquisa
    this.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      var searchInputValue = this.searchInput.value;

      // Limpa a mensagem de erro
      clearTimeout(this.errorMessageTimeout);
      this.searchErrorMessage.textContent = "";

      // Se o valor de entrada estiver vazio, mostra uma mensagem de erro e a esconde após 3 segundos
      if (!searchInputValue.trim()) {
        this.searchErrorMessage.textContent =
          "Por favor, insira um valor de pesquisa.";
        this.errorMessageTimeout = setTimeout(() => {
          this.searchErrorMessage.textContent = "";
        }, 3000);
        return;
      }

      // Se o valor de entrada não estiver vazio, faz a pesquisa
      this.fetchSearchData(searchInputValue);
    });

    // Adiciona um listener de evento de input ao campo de entrada
    this.searchInput.addEventListener("input", (event) => {
      console.log("Valor do campo de entrada alterado:", event.target.value);
    });
  }
}

// Cria uma nova instância da classe SearchForm
new SearchForm();
