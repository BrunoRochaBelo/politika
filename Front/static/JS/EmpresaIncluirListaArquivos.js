let idItem = 1; // Inicializa um contador para os IDs dos itens
const itensMap = new Map(); // Armazena as informações dos itens para exclusão
const buttonAdicionarBensServices = document.getElementById(
  "buttonAdicionarBensServices"
);
const selectElement = document.getElementById("bem_servico");
const contadorItens = document.getElementById("contadorItens");

selectElement.addEventListener("change", function () {
  if (selectElement.value) {
    buttonAdicionarBensServices.disabled = false;
    selectElement.querySelector('option[value=""]').textContent =
      "Selecionar outro";
  } else {
    buttonAdicionarBensServices.disabled = true;
  }
});

function adicionarServico() {
  const especieDocumento =
    selectElement.options[selectElement.selectedIndex].text;
  const valorSelecionado = selectElement.value;

  if (!valorSelecionado || valorSelecionado === "") {
    alert("Por favor, selecione um bem ou serviço.");
    return;
  }

  if (
    Array.from(itensMap.values()).some(
      (item) => item.valor === valorSelecionado
    )
  ) {
    alert("Este item já foi adicionado.");
    return;
  }

  const tabelaId = "tabelaBemServico";
  const tabelaArquivos = document.getElementById(tabelaId);
  const tbody = tabelaArquivos.querySelector("tbody");

  const tr = document.createElement("tr");
  tr.setAttribute("data-id", idItem);
  tr.classList.add("tabela-historico", "table-row-fade-in");
  tr.innerHTML = `
        <td data-label="ID">${idItem}</td>
        <td data-label="Produto / Serviço">${especieDocumento}</td>
        <td>
            <div class="icone-excluir-container">
                <img src="./static/imagens/icones/excluir.svg" alt="Excluir" class="icone-excluir" onclick="excluirItem(${idItem}, '${tabelaId}', '${valorSelecionado}')">
            </div>
        </td>
    `;
  tbody.appendChild(tr);

  itensMap.set(idItem, { valor: valorSelecionado });

  const optionElement = selectElement.querySelector(
    `option[value="${valorSelecionado}"]`
  );
  optionElement.disabled = true;
  optionElement.classList.add("bens-servicos-option-disabled");

  idItem++;
  selectElement.value = "";
  buttonAdicionarBensServices.disabled = true;

  atualizarContadorItens();
}

function excluirItem(id, tabelaId, valorSelecionado) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);

  if (confirm("Tem certeza que deseja excluir este item?")) {
    tr.classList.add("table-row-fade-out");
    setTimeout(() => {
      tr.remove();
      itensMap.delete(id);

      const optionElement = selectElement.querySelector(
        `option[value="${valorSelecionado}"]`
      );
      optionElement.disabled = false;
      optionElement.classList.remove("bens-servicos-option-disabled");

      if (itensMap.size === 0) {
        selectElement.querySelector('option[value=""]').textContent =
          "Selecione";
        buttonAdicionarBensServices.disabled = true;
      }

      atualizarContadorItens();
    }, 500); // Tempo para a animação de remoção
  }
}

function atualizarContadorItens() {
  const tabelaArquivos = document.getElementById("tabelaBemServico");
  const tbody = tabelaArquivos.querySelector("tbody");
  const numItens = tbody.querySelectorAll("tr").length;
  contadorItens.textContent = `Total de itens adicionados: ${numItens}`;
  contadorItens.classList.add("contador-pulse");
  setTimeout(() => {
    contadorItens.classList.remove("contador-pulse");
  }, 300);
}
