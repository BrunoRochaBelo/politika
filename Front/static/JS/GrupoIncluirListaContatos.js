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

      const response = await fetch(
        `http://dev.inforvia.com.br:5000//api/contato/searchall/${encodeURIComponent(
          query
        )}`
      );
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
      tr.innerHTML = `
        <td>${contato.name}</td>
        <td>${contato.type}</td>
        <td>
          <div class="icone-excluir-container">
            <img src="./static/imagens/icones/add.svg" alt="Adicionar" class="icone-adicionar" onclick="adicionarParticipante(${contato.id})">
          </div>
        </td>
      `;
      tr.querySelector(".icone-adicionar").addEventListener("click", () =>
        adicionarParticipante(contato)
      );
      tabelaContatosEncontrados.appendChild(tr);
    });
  };

  const renderizarParticipantes = () => {
    tabelaParticipantesGrupo.innerHTML = "";
    participantes.forEach((participante, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("table-row-fade-in");
      tr.innerHTML = `
        <td>${participante.name}</td>
        <td>${participante.type}</td>
        <td>
          <div class="icone-excluir-container">
            <img src="./static/imagens/icones/excluir.svg" alt="Remover" class="icone-excluir" onclick="removerParticipante(${index})">
          </div>
        </td>
      `;
      tr.querySelector(".icone-excluir").addEventListener("click", () =>
        removerParticipante(index)
      );
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
    lastRow.classList.add("table-row-highlight");

    setTimeout(() => {
      lastRow.classList.add("table-row-fade-out-highlight");
    }, 1000);
  };

  const removerParticipante = (index) => {
    const participanteRemovido = participantes[index];
    const tr = tabelaParticipantesGrupo.querySelectorAll("tr")[index];
    tr.classList.add("table-row-fade-out");

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
});
