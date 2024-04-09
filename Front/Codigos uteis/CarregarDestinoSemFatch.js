// Variáveis globais
var estadoSelecionado = "";

// Função para atualizar a variável global com o valor do estado selecionado
function atualizarEstadoSelecionado() {
  estadoSelecionado = this.value;
}

// Ouvinte 'change' para o elemento 'select' de estados
document
  .getElementById("estado")
  .addEventListener("change", atualizarEstadoSelecionado);

// Ouvinte 'blur' para o elemento 'select' de estados
document.getElementById("estado").addEventListener("blur", function () {
  document.getElementById("formEstado").dispatchEvent(new Event("submit"));
});

// Ouvinte 'keypress' para o elemento 'select' de estados
document
  .getElementById("estado")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("formEstado").dispatchEvent(new Event("submit"));
    }
  });

// Ouvinte 'submit' para o formulário de estados
document
  .getElementById("formEstado")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Constrói a URL de ação do formulário usando o valor do estado selecionado
    this.action = "/?uf_destino=" + encodeURIComponent(estadoSelecionado);

    this.submit();
  });

// Variáveis globais
var cidadeSelecionada = "";

// Função para atualizar a variável global com o valor da cidade selecionada
function atualizarCidadeSelecionada() {
  cidadeSelecionada = this.value;
}

// Ouvinte 'change' para o elemento 'select' de cidades
document
  .getElementById("cidade")
  .addEventListener("change", atualizarCidadeSelecionada);

// Ouvinte 'blur' para o elemento 'select' de cidades
document.getElementById("cidade").addEventListener("blur", function () {
  document.getElementById("formCidade").dispatchEvent(new Event("submit"));
});

// Ouvinte 'keypress' para o elemento 'select' de cidades
document
  .getElementById("cidade")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("formCidade").dispatchEvent(new Event("submit"));
    }
  });

// Ouvinte 'submit' para o formulário de cidades
document
  .getElementById("formCidade")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Captura o valor do estado selecionado
    var estadoSelecionado = document.getElementById("estado").value;

    // Verifica se o estado já foi selecionado
    if (estadoSelecionado) {
      var url =
        "/?uf_destino=" +
        encodeURIComponent(estadoSelecionado) +
        "&cid_destino=" +
        encodeURIComponent(cidadeSelecionada);
      this.action = url;
    } else {
      console.log("Por favor, selecione um estado primeiro.");
    }

    // Envia o formulário
    this.submit();
  });
