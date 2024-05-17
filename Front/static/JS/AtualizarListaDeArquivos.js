let idArquivo = 1; // Inicializa um contador para os IDs dos arquivos

function atualizarListaArquivos(inputFile, tabelaId, selectId) {
  const tabelaArquivos = document.getElementById(tabelaId);
  const tbody = tabelaArquivos.querySelector("tbody");

  // Obtenha o valor selecionado do campo <select> específico para cada aba
  const especieDocumento = document.getElementById(selectId).value;

  for (let i = 0; i < inputFile.files.length; i++) {
    const arquivo = inputFile.files[i];
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", idArquivo);
    tr.classList.add("tabela-historico");
    tr.innerHTML = `
      <td data-label="ID">${idArquivo++}</td>
      <td data-label="Data">${new Date().toLocaleDateString()}</td>
      <td data-label="Tipo">${arquivo.type}</td>
      <td data-label="Nome">${arquivo.name}</td>
      <td data-label="Espécie Documento">${especieDocumento}</td> <!-- Adiciona a espécie do documento -->
      <td>
        <button onclick="editarArquivo(${idArquivo - 1})">Editar</button>
        <button onclick="excluirArquivo(${
          idArquivo - 1
        }, '${tabelaId}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);

    // Envio do arquivo para o servidor
    const formData = new FormData();
    formData.append("file", arquivo);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Lidar com a resposta do servidor
        console.log("Upload realizado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao enviar o arquivo:", error);
      });
  }
}
