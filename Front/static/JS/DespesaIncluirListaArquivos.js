let idArquivo = 1;
const arquivosMap = new Map();

function mostrarFeedback(selectElement, msgElement) {
  if (selectElement) {
    selectElement.classList.add("error");
    setTimeout(() => selectElement.classList.remove("error"), 1500);
  }
  if (msgElement) {
    msgElement.style.display = "block";
    setTimeout(() => (msgElement.style.display = "none"), 1500);
  }
}

function atualizarListaArquivos(
  inputFile,
  tabelaId,
  selectId,
  msgId,
  linkId
) {
  const tabelaArquivos = document.getElementById(tabelaId);
  const tbody = tabelaArquivos.querySelector("tbody");

  const selectElement = document.getElementById(selectId);
  const msgElement = document.getElementById(msgId);
  const linkInput = linkId ? document.getElementById(linkId) : null;
  const especieDocumento = selectElement.options[selectElement.selectedIndex].text;
  const valorSelecionado = selectElement.value;

  if (!valorSelecionado) {
    mostrarFeedback(selectElement, msgElement);
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
        <td data-label="ID" class="hidden-column">${idArquivo}</td>
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
        <td data-label="ID" class="hidden-column">${idArquivo}</td>
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

    arquivosMap.set(idArquivo, { valor: valorSelecionado, nome: arquivo.name });
    idArquivo++;

    const formData = new FormData();
    formData.append("file", arquivo);

    fetch("/upload", { method: "POST", body: formData })
      .then(() => console.log("Upload realizado com sucesso"))
      .catch((error) => console.error("Erro ao enviar o arquivo:", error));
  }

  atualizarContadorArquivos(tabelaId);
  inputFile.value = "";
  selectElement.value = "";
  selectElement.dispatchEvent(new Event("change"));
}

function excluirArquivo(id, tabelaId) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  const info = arquivosMap.get(id);
  const nomeArquivo = info ? info.nome : "";

  if (confirm("Tem certeza que deseja excluir este arquivo?")) {
    tr.classList.add("table-row-fade-out");
    setTimeout(() => {
      tr.remove();
      arquivosMap.delete(id);
      atualizarContadorArquivos(tabelaId);
      exibirMensagemSucesso(
        nomeArquivo
          ? `O arquivo "${nomeArquivo}" foi excluído com sucesso.`
          : "Arquivo excluído com sucesso."
      );
    }, 500);
  }
}

function exibirMensagemSucesso(mensagem) {
  const msgSucesso = document.getElementById("mensagemSucesso");
  if (!msgSucesso) return;
  msgSucesso.textContent = mensagem;
  msgSucesso.classList.add("show");
  setTimeout(() => {
    msgSucesso.classList.remove("show");
  }, 3000);
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

function configurarSelecaoArquivo(selectId, inputId, areaId, msgId, linkId) {
  const selectElement = document.getElementById(selectId);
  const inputFile = document.getElementById(inputId);
  const uploadArea = document.getElementById(areaId);
  const msgElement = document.getElementById(msgId);
  const linkInput = linkId ? document.getElementById(linkId) : null;
  if (!selectElement || !inputFile) return;

  function ajustarEstado() {
    const habilitar = !!selectElement.value;
    inputFile.disabled = !habilitar;
    if (uploadArea) uploadArea.classList.toggle("disabled", !habilitar);
    if (linkInput) linkInput.disabled = !habilitar;
    if (!habilitar) {
      inputFile.value = "";
      if (linkInput) linkInput.value = "";
    } else if (msgElement) {
      msgElement.style.display = "none";
    }
  }

  ajustarEstado();
  selectElement.addEventListener("change", ajustarEstado);

  if (linkInput) {
    linkInput.addEventListener("focus", (e) => {
      if (linkInput.disabled) {
        mostrarFeedback(selectElement, msgElement);
        e.preventDefault();
        linkInput.blur();
      }
    });
    linkInput.addEventListener("mousedown", (e) => {
      if (linkInput.disabled) {
        mostrarFeedback(selectElement, msgElement);
        e.preventDefault();
      }
    });
  }
}

function configurarDragAndDrop(areaId, inputId, selectId, msgId) {
  const uploadArea = document.getElementById(areaId);
  const fileInput = document.getElementById(inputId);
  const selectElement = document.getElementById(selectId);
  const msgElement = document.getElementById(msgId);
  if (!uploadArea || !fileInput) return;

  function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    if (fileInput.disabled) {
      mostrarFeedback(selectElement, msgElement);
      return;
    }
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

    if (fileInput.disabled) {
      mostrarFeedback(selectElement, msgElement);
      return;
    }

    if (files.length) {
      fileInput.files = files;
      const event = new Event("change");
      fileInput.dispatchEvent(event);
    }
  });

  uploadArea.addEventListener("click", (e) => {
    if (fileInput.disabled) {
      e.preventDefault();
      mostrarFeedback(selectElement, msgElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarSelecaoArquivo(
    "especie_documento_aba2",
    "anexar_documento_aba2",
    "uploadAreaAba2",
    "msgEspecieAba2",
    "linkDocAba2"
  );
  configurarSelecaoArquivo(
    "especie_documento_aba3",
    "anexar_documento_aba3",
    "uploadAreaAba3",
    "msgEspecieAba3",
    "linkDocAba3"
  );

  const inputAba2 = document.getElementById("anexar_documento_aba2");
  const inputAba3 = document.getElementById("anexar_documento_aba3");

  if (inputAba2) {
    inputAba2.addEventListener("change", () =>
      atualizarListaArquivos(
        inputAba2,
        "tabelaArquivosAba2",
        "especie_documento_aba2",
        "msgEspecieAba2",
        "linkDocAba2"
      )
    );
    configurarDragAndDrop("uploadAreaAba2", "anexar_documento_aba2", "especie_documento_aba2", "msgEspecieAba2");
  }

  if (inputAba3) {
    inputAba3.addEventListener("change", () =>
      atualizarListaArquivos(
        inputAba3,
        "tabelaArquivosAba3",
        "especie_documento_aba3",
        "msgEspecieAba3",
        "linkDocAba3"
      )
    );
    configurarDragAndDrop("uploadAreaAba3", "anexar_documento_aba3", "especie_documento_aba3", "msgEspecieAba3");
  }
});