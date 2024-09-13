let idArquivo = 1; // Inicializa um contador para os IDs dos arquivos
const arquivosMap = new Map(); // Armazena os arquivos adicionados para controle
const contadorArquivos = document.getElementById("contadorArquivos");

function atualizarListaArquivos(inputFile, tabelaId, selectId) {
  const tabelaArquivos = document.getElementById(tabelaId);
  const tbody = tabelaArquivos.querySelector("tbody");

  // Obtenha o valor selecionado do campo <select> específico para cada aba
  const selectElement = document.getElementById(selectId);
  const especieDocumento =
    selectElement.options[selectElement.selectedIndex].text;
  const valorSelecionado = selectElement.value;

  // Verifica se um valor foi selecionado
  if (!valorSelecionado) {
    alert("Por favor, selecione uma espécie de documento.");
    return;
  }

  for (let i = 0; i < inputFile.files.length; i++) {
    const arquivo = inputFile.files[i];
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", idArquivo);
    tr.classList.add("tabela-historico", "table-row-fade-in");
    tr.innerHTML = `
      <td data-label="ID">${idArquivo}</td>
      <td data-label="Data">${new Date().toLocaleDateString()}</td>
      <td data-label="Tipo">${arquivo.type}</td>
      <td data-label="Nome">${arquivo.name}</td>
      <td data-label="Espécie Documento">${especieDocumento}</td>
      <td>
        <div class="icone-excluir-container">
          <img src="./static/imagens/icones/excluir.svg" alt="Excluir" class="icone-excluir" onclick="excluirArquivo(${idArquivo}, '${tabelaId}')">
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    arquivosMap.set(idArquivo, { valor: valorSelecionado });
    idArquivo++;

    // Envio do arquivo para o servidor (simulação)
    const formData = new FormData();
    formData.append("file", arquivo);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Upload realizado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao enviar o arquivo:", error);
      });
  }

  // Atualiza o contador de itens
  atualizarContadorArquivos();
}

function excluirArquivo(id, tabelaId) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);

  if (confirm("Tem certeza que deseja excluir este arquivo?")) {
    tr.classList.add("table-row-fade-out");
    setTimeout(() => {
      tr.remove();
      arquivosMap.delete(id);

      // Atualiza o contador de itens
      atualizarContadorArquivos();
    }, 500); // Tempo para a animação de remoção
  }
}

function atualizarContadorArquivos() {
  const tabelaArquivos = document.getElementById("tabelaArquivosAba2");
  const tbody = tabelaArquivos.querySelector("tbody");
  const numItens = tbody.querySelectorAll("tr").length;
  contadorArquivos.textContent = `Total de arquivos adicionados: ${numItens}`;
  contadorArquivos.classList.add("contador-pulse");
  setTimeout(() => {
    contadorArquivos.classList.remove("contador-pulse");
  }, 300);
}
