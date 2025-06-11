let idArquivo = 1;
const arquivosMap = new Map();

function atualizarListaArquivos(inputFile, tabelaId, selectId) {
  const tabelaArquivos = document.getElementById(tabelaId);
  const tbody = tabelaArquivos.querySelector("tbody");

  const selectElement = document.getElementById(selectId);
  const especieDocumento = selectElement.options[selectElement.selectedIndex].text;
  const valorSelecionado = selectElement.value;

  if (!valorSelecionado) {
    alert("Por favor, selecione uma espécie de documento.");
    return;
  }

  for (let i = 0; i < inputFile.files.length; i++) {
    const arquivo = inputFile.files[i];
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", idArquivo);
    tr.classList.add("tabela-historico", "table-row-fade-in");

    let rowHtml = "";
    if (tabelaId === "tabelaArquivosAba3") {
      rowHtml = `
        <td data-label="ID">${idArquivo}</td>
        <td data-label="Data">${new Date().toLocaleDateString()}</td>
        <td data-label="Espécie Documento">${especieDocumento}</td>
        <td data-label="Arquivo">${arquivo.name}</td>
        <td>
          <div class="icone-container">
            <img src="./static/imagens/icones/excluir.svg" alt="Excluir" class="icone-excluir" onclick="excluirArquivo(${idArquivo}, '${tabelaId}')">
          </div>
        </td>`;
    } else {
      rowHtml = `
        <td data-label="ID">${idArquivo}</td>
        <td data-label="Data">${new Date().toLocaleDateString()}</td>
        <td data-label="Tipo">${arquivo.type}</td>
        <td data-label="Nome">${arquivo.name}</td>
        <td data-label="Espécie Documento">${especieDocumento}</td>
        <td>
          <div class="icone-container">
            <img src="./static/imagens/icones/excluir.svg" alt="Excluir" class="icone-excluir" onclick="excluirArquivo(${idArquivo}, '${tabelaId}')">
          </div>
        </td>`;
    }

    tr.innerHTML = rowHtml;
    tbody.appendChild(tr);

    arquivosMap.set(idArquivo, { valor: valorSelecionado });
    idArquivo++;

    const formData = new FormData();
    formData.append("file", arquivo);

    fetch("/upload", { method: "POST", body: formData })
      .then(() => console.log("Upload realizado com sucesso"))
      .catch((error) => console.error("Erro ao enviar o arquivo:", error));
  }

  atualizarContadorArquivos(tabelaId);
  inputFile.value = "";
}

function excluirArquivo(id, tabelaId) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);

  if (confirm("Tem certeza que deseja excluir este arquivo?")) {
    tr.classList.add("table-row-fade-out");
    setTimeout(() => {
      tr.remove();
      arquivosMap.delete(id);
      atualizarContadorArquivos(tabelaId);
    }, 500);
  }
}

function atualizarContadorArquivos(tabelaId) {
  const tabelaArquivos = document.getElementById(tabelaId);
  const tbody = tabelaArquivos.querySelector("tbody");
  const numItens = tbody.querySelectorAll("tr").length;
  const contadorId = tabelaId === "tabelaArquivosAba3" ? "contadorArquivosAba3" : "contadorArquivosAba2";
  const contadorElement = document.getElementById(contadorId);
  contadorElement.textContent = `Total de arquivos adicionados: ${numItens}`;
  contadorElement.classList.add("contador-pulse");
  setTimeout(() => {
    contadorElement.classList.remove("contador-pulse");
  }, 300);
}

function configurarSelecaoArquivo(selectId, inputId) {
  const selectElement = document.getElementById(selectId);
  const inputFile = document.getElementById(inputId);
  if (!selectElement || !inputFile) return;
  inputFile.disabled = true;
  selectElement.addEventListener("change", () => {
    if (selectElement.value) {
      inputFile.disabled = false;
    } else {
      inputFile.disabled = true;
      inputFile.value = "";
    }
  });
}

function configurarDragAndDrop(areaId, inputId) {
  const uploadArea = document.getElementById(areaId);
  const fileInput = document.getElementById(inputId);
  if (!uploadArea || !fileInput) return;

  function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadArea.style.borderColor = "#3498db";
    uploadArea.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
  });

  uploadArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    uploadArea.style.borderColor = getCSSVariable("--input-border");
    uploadArea.style.backgroundColor = "rgba(52, 152, 219, 0.05)";
  });

  uploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadArea.style.borderColor = getCSSVariable("--input-border");
    uploadArea.style.backgroundColor = "rgba(52, 152, 219, 0.05)";

    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length) {
      fileInput.files = files;
      const event = new Event("change");
      fileInput.dispatchEvent(event);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarSelecaoArquivo("especie_documento_aba2", "anexar_documento_aba2");
  configurarSelecaoArquivo("especie_documento_aba3", "anexar_documento_aba3");

  const inputAba2 = document.getElementById("anexar_documento_aba2");
  const inputAba3 = document.getElementById("anexar_documento_aba3");

  if (inputAba2) {
    inputAba2.addEventListener("change", () => atualizarListaArquivos(inputAba2, "tabelaArquivosAba2", "especie_documento_aba2"));
    configurarDragAndDrop("uploadAreaAba2", "anexar_documento_aba2");
  }

  if (inputAba3) {
    inputAba3.addEventListener("change", () => atualizarListaArquivos(inputAba3, "tabelaArquivosAba3", "especie_documento_aba3"));
    configurarDragAndDrop("uploadAreaAba3", "anexar_documento_aba3");
  }
});

