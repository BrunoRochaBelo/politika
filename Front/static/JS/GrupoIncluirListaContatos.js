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

  let contatosEncontrados = [];
  let participantes = [];

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
      const response = await fetch(
        `http://dev.inforvia.com.br:5000//api/contato/searchall/${encodeURIComponent(
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
    }
  };

  const atualizarContadorContatos = () => {
    contadorContatosEncontrados.textContent = `Total de contatos encontrados: ${contatosEncontrados.length}`;
  };

  const atualizarContadorParticipantes = () => {
    contadorParticipantes.textContent = `Total de participantes: ${participantes.length}`;
  };

  const renderizarContatosEncontrados = () => {
    tabelaContatosEncontrados.innerHTML = "";
    contatosEncontrados.forEach((contato) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${contato.name}</td>
        <td>${contato.type}</td>
        <td><button class="adicionar-participante">Adicionar</button></td>
      `;
      tr.querySelector(".adicionar-participante").addEventListener(
        "click",
        () => {
          adicionarParticipante(contato);
        }
      );
      tabelaContatosEncontrados.appendChild(tr);
    });
  };

  const renderizarParticipantes = () => {
    tabelaParticipantesGrupo.innerHTML = "";
    participantes.forEach((participante, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${participante.name}</td>
        <td>${participante.type}</td>
        <td><button class="remover-participante">Remover</button></td>
      `;
      tr.querySelector(".remover-participante").addEventListener(
        "click",
        () => {
          removerParticipante(index);
        }
      );
      tabelaParticipantesGrupo.appendChild(tr);
    });
  };

  const adicionarParticipante = (contato) => {
    // Verifica se o participante já foi adicionado
    if (participantes.find((p) => p.id === contato.id)) {
      showError("Este participante já foi adicionado.");
      return;
    }
    participantes.push(contato);
    renderizarParticipantes();
    atualizarContadorParticipantes();
  };

  const removerParticipante = (index) => {
    participantes.splice(index, 1);
    renderizarParticipantes();
    atualizarContadorParticipantes();
  };

  const handleSearch = debounce(async () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      contatosEncontrados = await fetchContatos(query);
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
