let idArquivo = 1;
const dataTransfer = new DataTransfer();
const arquivosMap = new Map(); // ID -> File

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

    if (isArquivoNaLista(nomeArquivo)) {
      exibirMensagemErro(`O arquivo "${nomeArquivo}" já foi adicionado.`);
      continue;
    }

    dataTransfer.items.add(arquivo);
    arquivosMap.set(idArquivo, arquivo);

    const extensao = obterExtensaoArquivo(nomeArquivo);
    const tipoAbreviado = abreviarTipo(extensao);

    const tr = document.createElement("tr");
    tr.setAttribute("data-id", idArquivo);
    // Note: adicionamos onclick na linha toda
    tr.setAttribute("onclick", `clicarLinha(event, ${idArquivo})`);
    tr.innerHTML = `
      <td class="hidden-column">${idArquivo}</td>
      <td>${nomeArquivo}</td>
      <td>${tipoAbreviado}</td>
      <td>
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

// Função para tratar o clique na linha.
// Se o clique for na área da .icone-container, não abrimos o modal.
function clicarLinha(event, id) {
  // Verifica se o alvo do clique ou qualquer ancestral dele é .icone-container
  const iconeContainer = event.target.closest(".icone-container");

  if (iconeContainer) {
    // Clicou no container do ícone, não faz nada (já há funcionalidade de excluir)
    return;
  }

  // Caso contrário, visualizar o arquivo
  visualizarArquivo(id);
}

function visualizarArquivo(id) {
  const file = arquivosMap.get(id);
  if (!file) {
    exibirMensagemErro("Arquivo não encontrado.");
    return;
  }

  const fileViewModal = document.getElementById("fileViewModal");
  const fileViewContainer = document.getElementById("fileViewContainer");

  fileViewContainer.innerHTML = "";
  const fileURL = URL.createObjectURL(file);

  let elementoVisualizacao;
  if (file.type.startsWith("image/")) {
    elementoVisualizacao = document.createElement("img");
    elementoVisualizacao.src = fileURL;
  } else if (file.type === "application/pdf") {
    const embed = document.createElement("embed");
    embed.src = fileURL;
    embed.type = "application/pdf";
    embed.style.width = "100%";
    embed.style.height = "80vh";
    elementoVisualizacao = embed;
  } else if (file.type.startsWith("text/")) {
    const iframe = document.createElement("iframe");
    iframe.src = fileURL;
    iframe.style.width = "100%";
    iframe.style.height = "80vh";
    elementoVisualizacao = iframe;
  } else {
    const iframe = document.createElement("iframe");
    iframe.src = fileURL;
    iframe.style.width = "100%";
    iframe.style.height = "80vh";
    elementoVisualizacao = iframe;
  }

  fileViewContainer.appendChild(elementoVisualizacao);
  fileViewModal.style.display = "block";
}

function fecharModalVisualizacao() {
  const fileViewModal = document.getElementById("fileViewModal");
  fileViewModal.style.display = "none";
}

function excluirArquivo(id, nomeArquivo) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;

  if (confirm(`Tem certeza que deseja excluir o arquivo "${nomeArquivo}"?`)) {
    tr.remove();
    removerArquivoDoDataTransfer(nomeArquivo);
    document.getElementById("anexar_documento").files = dataTransfer.files;
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

function abreviarTipo(extensao) {
  const imagens = ["jpg", "jpeg", "png", "gif", "webp"];
  if (extensao === "pdf") return "pdf";
  if (extensao === "svg") return "svg";
  if (imagens.includes(extensao)) return "img";
  return extensao !== "desconhecido" ? extensao : "desconhecido";
}

function isArquivoNaLista(nomeArquivo) {
  const tabela = document.getElementById("tabelaArquivosAnexados");
  const linhas = tabela.querySelectorAll("tbody tr");
  for (let linha of linhas) {
    const nome = linha.querySelector("td:nth-child(2)").textContent.trim();
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

// Fecha o modal se o usuário clicar fora dele
window.onclick = function (event) {
  const modal = document.getElementById("fileViewModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
