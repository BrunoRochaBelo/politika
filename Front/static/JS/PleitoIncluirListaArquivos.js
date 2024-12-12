let idArquivo = 1;
const dataTransfer = new DataTransfer();
const arquivosMap = new Map(); // Mapeia o ID do arquivo ao objeto File

function atualizarListaArquivos() {
  const inputFile = document.getElementById("anexar_documento");
  const tabelaArquivos = document.getElementById("tabelaArquivosAnexados");
  const tbody = tabelaArquivos.querySelector("tbody");

  if (!inputFile.files || inputFile.files.length === 0) {
    return;
  }

  for (let i = 0; i < inputFile.files.length; i++) {
    const arquivo = inputFile.files[i];
    const nomeArquivo = arquivo.name;

    // Verifica duplicidade
    if (isArquivoNaLista(nomeArquivo)) {
      exibirMensagemErro(`O arquivo "${nomeArquivo}" já foi adicionado.`);
      continue;
    }

    dataTransfer.items.add(arquivo);

    // Armazena o arquivo no mapa associando-o ao ID
    arquivosMap.set(idArquivo, arquivo);

    const tr = document.createElement("tr");
    tr.setAttribute("data-id", idArquivo);
    tr.innerHTML = `
      <td data-label="ID" class="hidden-column">${idArquivo}</td>
      <td data-label="Nome">
        <a href="#" onclick="visualizarArquivo(${idArquivo})">${nomeArquivo}</a>
      </td>
      <td data-label="Tipo">${
        arquivo.type || obterExtensaoArquivo(nomeArquivo)
      }</td>
      <td data-label="Ações">
        <div class="icone-container">
          <img src="./static/imagens/icones/excluir.svg" alt="Excluir" class="icone-excluir" style="cursor:pointer;" onclick="excluirArquivo(${idArquivo}, '${nomeArquivo}')">
        </div>
      </td>
    `;
    tbody.appendChild(tr);
    idArquivo++;
  }

  inputFile.files = dataTransfer.files;
  inputFile.value = "";
  atualizarContadorArquivos();
}

function visualizarArquivo(id) {
  const file = arquivosMap.get(id);
  if (!file) {
    exibirMensagemErro("Arquivo não encontrado.");
    return;
  }

  // Cria uma URL temporária (blob) para o arquivo
  const fileURL = URL.createObjectURL(file);
  // Abre o arquivo em uma nova aba
  window.open(fileURL, "_blank");
}

function excluirArquivo(id, nomeArquivo) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;

  if (confirm(`Tem certeza que deseja excluir o arquivo "${nomeArquivo}"?`)) {
    tr.remove();
    removerArquivoDoDataTransfer(nomeArquivo);
    document.getElementById("anexar_documento").files = dataTransfer.files;

    // Remove o arquivo do map
    arquivosMap.delete(id);

    atualizarContadorArquivos();
    exibirMensagemSucesso(
      `O arquivo "${nomeArquivo}" foi excluído com sucesso.`
    );
  }
}

function atualizarContadorArquivos() {
  const tabela = document.getElementById("tabelaArquivosAnexados");
  const tbody = tabela.querySelector("tbody");
  const contadorElement = document.getElementById("contadorArquivosAnexados");
  const numItens = tbody.querySelectorAll("tr").length;

  contadorElement.textContent = `Total de contatos encontrados: ${numItens}`;
  contadorElement.classList.add("contador-pulse");
  setTimeout(() => {
    contadorElement.classList.remove("contador-pulse");
  }, 300);
}

function obterExtensaoArquivo(nome) {
  const partes = nome.split(".");
  return partes.length > 1 ? partes.pop().toLowerCase() : "desconhecido";
}

function isArquivoNaLista(nomeArquivo) {
  const tabela = document.getElementById("tabelaArquivosAnexados");
  const linhas = tabela.querySelectorAll("tbody tr");
  for (let linha of linhas) {
    const nome = linha
      .querySelector('td[data-label="Nome"]')
      .textContent.trim();
    if (nome === nomeArquivo) {
      return true;
    }
  }
  return false;
}

function removerArquivoDoDataTransfer(nomeArquivo) {
  const novoDT = new DataTransfer();
  for (let i = 0; i < dataTransfer.files.length; i++) {
    const file = dataTransfer.files[i];
    if (file.name !== nomeArquivo) {
      novoDT.items.add(file);
    }
  }

  dataTransfer.items.clear();
  for (let i = 0; i < novoDT.files.length; i++) {
    dataTransfer.items.add(novoDT.files[i]);
  }
}

function exibirMensagemErro(mensagem) {
  const msgErro = document.getElementById("mensagemErro");
  msgErro.textContent = mensagem;
  msgErro.classList.add("show");

  setTimeout(() => {
    msgErro.classList.remove("show");
  }, 3000);
}

function exibirMensagemSucesso(mensagem) {
  const msgSucesso = document.getElementById("mensagemSucesso");
  msgSucesso.textContent = mensagem;
  msgSucesso.classList.add("show");

  setTimeout(() => {
    msgSucesso.classList.remove("show");
  }, 3000);
}
