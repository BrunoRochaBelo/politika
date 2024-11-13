// EmpresaIncluirListaArquivos.js

document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("bem_servico");
  const buttonAdicionarBensServices = document.getElementById(
    "buttonAdicionarBensServices"
  );
  const tabelaBemServico = document
    .getElementById("tabelaBemServico")
    .querySelector("tbody");
  const contadorItens = document.getElementById("contadorItens");

  let itensAdicionados = [];
  let idItem = 1;

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

  const atualizarContadorItens = () => {
    contadorItens.textContent = `Total de itens adicionados: ${itensAdicionados.length}`;
    contadorItens.classList.add("contador-pulse");
    setTimeout(() => {
      contadorItens.classList.remove("contador-pulse");
    }, 300);
  };

  const renderizarItens = () => {
    tabelaBemServico.innerHTML = "";
    itensAdicionados.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("table-row-fade-in");
      tr.setAttribute("data-id", item.id);

      // Coluna Oculta para ID
      const tdId = document.createElement("td");
      tdId.classList.add("hidden-column");
      tdId.textContent = item.id;
      tr.appendChild(tdId);

      // Coluna Produto / Serviço
      const tdProduto = document.createElement("td");
      tdProduto.textContent = item.nome;
      tr.appendChild(tdProduto);

      // Coluna Ação
      const tdAcao = document.createElement("td");
      const divAcao = document.createElement("div");
      divAcao.classList.add("icone-excluir-container");
      const imgExcluir = document.createElement("img");
      imgExcluir.src = "./static/imagens/icones/excluir.svg";
      imgExcluir.alt = "Excluir";
      imgExcluir.classList.add("icone-excluir");
      imgExcluir.style.cursor = "pointer";
      imgExcluir.addEventListener("click", () => removerItem(index));
      divAcao.appendChild(imgExcluir);
      tdAcao.appendChild(divAcao);
      tr.appendChild(tdAcao);

      tabelaBemServico.appendChild(tr);
    });
  };

  const adicionarItem = () => {
    const valorSelecionado = selectElement.value;
    const textoSelecionado =
      selectElement.options[selectElement.selectedIndex]?.text || "";

    if (!valorSelecionado) {
      showError("Por favor, selecione um bem ou serviço.");
      return;
    }

    if (itensAdicionados.find((item) => item.valor === valorSelecionado)) {
      showError("Este item já foi adicionado.");
      return;
    }

    const novoItem = {
      id: idItem++,
      valor: valorSelecionado,
      nome: textoSelecionado,
    };

    itensAdicionados.push(novoItem);

    // Desabilitar a opção selecionada
    const optionElement = selectElement.querySelector(
      `option[value="${valorSelecionado}"]`
    );
    optionElement.disabled = true;
    optionElement.classList.add("bens-servicos-option-disabled");

    // Resetar o select
    selectElement.value = "";
    buttonAdicionarBensServices.disabled = true;

    renderizarItens();
    atualizarContadorItens();

    // Validar o campo 'bem_servico'
    CampoUtils.validarCampo(selectElement);
  };

  const removerItem = (index) => {
    const itemRemovido = itensAdicionados[index];

    const tr = tabelaBemServico.querySelectorAll("tr")[index];
    if (tr) {
      tr.classList.add("table-row-fade-out");
    }

    setTimeout(() => {
      itensAdicionados.splice(index, 1);

      // Habilitar a opção no select
      const optionElement = selectElement.querySelector(
        `option[value="${itemRemovido.valor}"]`
      );
      optionElement.disabled = false;
      optionElement.classList.remove("bens-servicos-option-disabled");

      renderizarItens();
      atualizarContadorItens();

      // Validar o campo 'bem_servico'
      CampoUtils.validarCampo(selectElement);
    }, 500);
  };

  selectElement.addEventListener("change", () => {
    if (selectElement.value) {
      buttonAdicionarBensServices.disabled = false;
      selectElement.querySelector('option[value=""]').textContent =
        "Selecionar outro";
    } else {
      buttonAdicionarBensServices.disabled = true;
    }
  });

  buttonAdicionarBensServices.addEventListener("click", adicionarItem);

  // Atualizar campos ocultos antes do envio do formulário
  const formulario = document.getElementById("form");
  formulario.addEventListener("submit", (event) => {
    // Verificar se há itens antes de enviar
    if (itensAdicionados.length === 0) {
      event.preventDefault();
      showError(
        "Adicione pelo menos um bem ou serviço antes de enviar o formulário."
      );
    }
  });
});
