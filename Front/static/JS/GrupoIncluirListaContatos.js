document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const tabelaContatosEncontrados = document
    .getElementById("tabelaContatosEncontrados")
    .querySelector("tbody");
  const tabelaParticipantesGrupo = document
    .getElementById("tabelaParticipantesGrupo")
    .querySelector("tbody");
  const contadorContatosEncontrados = document.getElementById(
    "contadorContatosEncontrados"
  );
  const contadorParticipantes = document.getElementById(
    "contadorParticipantes"
  );

  // Referência ao indicador de carregamento
  const loadingIndicator = document.getElementById("loading-indicator");

  let contatosEncontrados = [];
  let contatosPesquisados = [];
  let participantes = [];
  let contatosAdicionados = [];

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

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

  const fetchContatos = async (query) => {
    try {
      // Mostra o indicador de carregamento
      loadingIndicator.style.display = "block";

      // Obtém a URL base do config.js com base no ambiente atual
      const baseURL = Config.BASE_URL[Config.ENVIRONMENT];

      // Obtém o endpoint para buscar contatos
      const endpoint = Config.API_ENDPOINTS.CONTACT_SEARCH_ALL;

      // Verifica se baseURL e endpoint estão definidos
      if (!baseURL || !endpoint) {
        console.error("Configuração de URL base ou endpoint não encontrada.");
        showError("Erro de configuração. Tente novamente mais tarde.");
        return [];
      }

      // Monta a URL completa utilizando as variáveis do config.js
      const url = `${baseURL}${endpoint}/${encodeURIComponent(query)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados da API");
      }
      const data = await response.json();
      const todosContatos = data.DADOS || [];

      contatosPesquisados = todosContatos;
      contatosEncontrados = todosContatos.filter(
        (contato) =>
          !contatosAdicionados.some(
            (adicionado) => adicionado.id === contato.id
          )
      );

      contatosEncontrados.sort((a, b) => a.name.localeCompare(b.name));

      return contatosEncontrados;
    } catch (error) {
      showError("Erro ao buscar dados. Tente novamente.");
      return [];
    } finally {
      // Oculta o indicador de carregamento após a busca
      loadingIndicator.style.display = "none";
    }
  };

  const atualizarContadorContatos = () => {
    contadorContatosEncontrados.textContent = `Total de contatos encontrados: ${contatosEncontrados.length}`;
    contadorContatosEncontrados.classList.add("contador-pulse");
    setTimeout(() => {
      contadorContatosEncontrados.classList.remove("contador-pulse");
    }, 300);
  };

  const atualizarContadorParticipantes = () => {
    contadorParticipantes.textContent = `Total de participantes: ${participantes.length}`;
    contadorParticipantes.classList.add("contador-pulse");
    setTimeout(() => {
      contadorParticipantes.classList.remove("contador-pulse");
    }, 300);
  };

  const renderizarContatosEncontrados = () => {
    tabelaContatosEncontrados.innerHTML = "";
    contatosEncontrados.forEach((contato) => {
      const tr = document.createElement("tr");

      // Coluna Oculta para ID
      const tdId = document.createElement("td");
      tdId.classList.add("hidden-column");
      const inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.name = "contatos_encontrados_ids[]"; // Nome do campo para envio
      inputId.value = contato.id;
      tdId.appendChild(inputId);
      tr.appendChild(tdId);

      // Coluna Nome
      const tdNome = document.createElement("td");
      tdNome.textContent = contato.name;
      tr.appendChild(tdNome);

      // Coluna Tipo
      const tdTipo = document.createElement("td");
      tdTipo.textContent = contato.type;
      tr.appendChild(tdTipo);

      // Coluna Ação
      const tdAcao = document.createElement("td");
      const divAcao = document.createElement("div");
      divAcao.classList.add("icone-excluir-container");
      const imgAdd = document.createElement("img");
      imgAdd.src = "./static/imagens/icones/add.svg";
      imgAdd.alt = "Adicionar";
      imgAdd.classList.add("icone-adicionar");
      imgAdd.style.cursor = "pointer";
      imgAdd.addEventListener("click", () => adicionarParticipante(contato));
      divAcao.appendChild(imgAdd);
      tdAcao.appendChild(divAcao);
      tr.appendChild(tdAcao);

      tabelaContatosEncontrados.appendChild(tr);
    });
  };

  const renderizarParticipantes = () => {
    tabelaParticipantesGrupo.innerHTML = "";
    participantes.forEach((participante, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("table-row-fade-in");

      // Coluna Oculta para ID
      const tdId = document.createElement("td");
      tdId.classList.add("hidden-column");
      const inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.name = "participantes_ids[]"; // Nome do campo para envio ao backend
      inputId.value = participante.id;
      tdId.appendChild(inputId);
      tr.appendChild(tdId);

      // Coluna Nome
      const tdNome = document.createElement("td");
      tdNome.textContent = participante.name;
      tr.appendChild(tdNome);

      // Coluna Tipo
      const tdTipo = document.createElement("td");
      tdTipo.textContent = participante.type;
      tr.appendChild(tdTipo);

      // Coluna Ação
      const tdAcao = document.createElement("td");
      const divAcao = document.createElement("div");
      divAcao.classList.add("icone-excluir-container");
      const imgExcluir = document.createElement("img");
      imgExcluir.src = "./static/imagens/icones/excluir.svg";
      imgExcluir.alt = "Remover";
      imgExcluir.classList.add("icone-excluir");
      imgExcluir.style.cursor = "pointer";
      imgExcluir.addEventListener("click", () => removerParticipante(index));
      divAcao.appendChild(imgExcluir);
      tdAcao.appendChild(divAcao);
      tr.appendChild(tdAcao);

      tabelaParticipantesGrupo.appendChild(tr);
    });
  };

  const adicionarParticipante = (contato) => {
    if (participantes.find((p) => p.id === contato.id)) {
      showError("Este participante já foi adicionado.");
      return;
    }

    participantes.push(contato);
    contatosEncontrados = contatosEncontrados.filter(
      (c) => c.id !== contato.id
    );
    contatosAdicionados.push(contato);

    participantes.sort((a, b) => a.name.localeCompare(b.name));

    renderizarContatosEncontrados();
    renderizarParticipantes();
    atualizarContadorContatos();
    atualizarContadorParticipantes();

    const rows = tabelaParticipantesGrupo.querySelectorAll("tr");
    const lastRow = rows[rows.length - 1];
    if (lastRow) {
      lastRow.classList.add("table-row-highlight");

      setTimeout(() => {
        lastRow.classList.add("table-row-fade-out-highlight");
      }, 1000);
    }
  };

  const removerParticipante = (index) => {
    const participanteRemovido = participantes[index];
    const tr = tabelaParticipantesGrupo.querySelectorAll("tr")[index];
    if (tr) {
      tr.classList.add("table-row-fade-out");
    }

    setTimeout(() => {
      participantes.splice(index, 1);
      contatosAdicionados = contatosAdicionados.filter(
        (c) => c.id !== participanteRemovido.id
      );

      if (contatosPesquisados.some((c) => c.id === participanteRemovido.id)) {
        contatosEncontrados.push(participanteRemovido);
        contatosEncontrados.sort((a, b) => a.name.localeCompare(b.name));
      }

      renderizarContatosEncontrados();
      renderizarParticipantes();
      atualizarContadorContatos();
      atualizarContadorParticipantes();
    }, 500);
  };

  const handleSearch = debounce(async () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      await fetchContatos(query);
      renderizarContatosEncontrados();
      atualizarContadorContatos();
    } else {
      contatosEncontrados = [];
      tabelaContatosEncontrados.innerHTML = "";
      atualizarContadorContatos();
    }
  }, 300);

  searchInput.addEventListener("input", () => {
    handleSearch();
  });

  searchButton.addEventListener("click", () => {
    handleSearch();
  });

  // Atualizar campos ocultos antes do envio do formulário
  const formulario = document.getElementById("form");
  formulario.addEventListener("submit", (event) => {
    // Opcional: Verificar se há participantes antes de enviar
    if (participantes.length === 0) {
      event.preventDefault();
      showError(
        "Adicione pelo menos um participante antes de enviar o formulário."
      );
    }
  });
});
