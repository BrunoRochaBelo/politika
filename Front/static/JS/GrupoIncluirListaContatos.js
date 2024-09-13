let participantesGrupo = new Map(); // Armazena os participantes do grupo
const contadorParticipantes = document.getElementById("contadorParticipantes");
const contadorContatosEncontrados = document.getElementById(
  "contadorContatosEncontrados"
);

function pesquisarContatos(event) {
  event.preventDefault();
  const searchTerm = document.getElementById("searchInput").value;

  // Simulação de pesquisa - você pode integrar isso com seu backend
  const resultados = [
    { id: 1, nome: "João Silva", tipo: "Usuário" },
    { id: 2, nome: "Maria Oliveira", tipo: "Contato" },
  ];

  atualizarListaContatos(resultados);
}

function atualizarListaContatos(contatos) {
  const tabelaContatos = document
    .getElementById("tabelaContatosEncontrados")
    .querySelector("tbody");
  tabelaContatos.innerHTML = ""; // Limpa os resultados anteriores

  contatos.forEach((contato) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.tipo}</td>
      <td>
        <button onclick="adicionarParticipante(${contato.id}, '${contato.nome}', '${contato.tipo}')">
          Adicionar
        </button>
      </td>
    `;
    tabelaContatos.appendChild(tr);
  });

  // Atualizar contador de contatos encontrados
  contadorContatosEncontrados.textContent = `Total de contatos encontrados: ${contatos.length}`;
}

function adicionarParticipante(id, nome, tipo) {
  if (participantesGrupo.has(id)) {
    alert("Este participante já está no grupo.");
    return;
  }

  const tabelaParticipantes = document
    .getElementById("tabelaParticipantesGrupo")
    .querySelector("tbody");

  const tr = document.createElement("tr");
  tr.setAttribute("data-id", id);
  tr.innerHTML = `
    <td>${nome}</td>
    <td>${tipo}</td>
    <td>
      <div class="icone-excluir-container">
        <button onclick="removerParticipante(${id})">
          Remover
        </button>
      </div>
    </td>
  `;
  tabelaParticipantes.appendChild(tr);

  participantesGrupo.set(id, { nome, tipo });
  atualizarContadorParticipantes();
}

function removerParticipante(id) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (confirm("Tem certeza que deseja remover este participante?")) {
    tr.remove();
    participantesGrupo.delete(id);
    atualizarContadorParticipantes();
  }
}

function atualizarContadorParticipantes() {
  const numParticipantes = participantesGrupo.size;
  contadorParticipantes.textContent = `Total de participantes: ${numParticipantes}`;
}
