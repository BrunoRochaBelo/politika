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
  }
}
function editarArquivo(idArquivo) {
  // Implemente a lógica para editar o arquivo
  console.log(`Editar arquivo com ID: ${idArquivo}`);
}

function excluirArquivo(idArquivo, tabelaId) {
  // Encontra a linha da tabela com o ID do arquivo
  const linha = document.querySelector(
    `#${tabelaId} tr[data-id="${idArquivo}"]`
  );
  if (linha) {
    // Remove a linha da tabela
    linha.remove();
    console.log(`Arquivo com ID: ${idArquivo} excluído com sucesso.`);

    // Redefine o contador de ID para o próximo ID disponível
    const tabelaArquivos = document.getElementById(tabelaId);
    const linhas = tabelaArquivos.querySelectorAll("tbody tr");
    idArquivo = linhas.length + 1;

    // Limpa o campo de input correspondente
    const inputFile = document.getElementById(
      tabelaId === "tabelaArquivosAba2"
        ? "anexar_documento"
        : "anexar_documento_pagamento"
    );
    inputFile.value = "";
  } else {
    console.log(`Arquivo com ID: ${idArquivo} não encontrado.`);
  }
}
