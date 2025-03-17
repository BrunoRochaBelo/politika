// Módulo de Manipulação de Estilos
window.EstiloUtils = (() => {
  // Altera a cor da borda do elemento (caso exista)
  function alterarCorBorda(elemento, cor) {
    if (elemento) {
      elemento.style.borderColor = cor;
    }
  }
  return {
    alterarCorBorda,
  };
})();

// Módulo de Manipulação de Campos
window.CampoUtils = (() => {
  // Retorna o label associado ao campo. Para rádios, busca no container.
  function obterLabelAssociado(campo) {
    let label;
    if (campo.type === "radio") {
      const campoDiv = campo.closest(".campo");
      label = campoDiv ? campoDiv.querySelector("label") : null;
    } else {
      label = document.querySelector(`label[for="${campo.id}"]`);
    }
    return label;
  }

  // Adiciona uma classe ao campo, seu label e, se houver, ao span contido no label.
  function adicionarClasse(campo, classe) {
    campo.classList.add(classe);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  }

  // Remove as classes especificadas do campo, label e span (se existir)
  function removerClasses(campo, ...classes) {
    campo.classList.remove(...classes);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  }

  // Exibe uma mensagem de erro logo após o campo e altera sua borda
  function exibirMensagemErroCampo(campo, mensagem) {
    let mensagemErro = campo.nextElementSibling;
    if (!mensagemErro || !mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro = document.createElement("div");
      mensagemErro.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
    }
    mensagemErro.innerText = mensagem;
    mensagemErro.style.color = "var(--erro)";
    mensagemErro.style.marginTop = "8px";
    mensagemErro.style.marginLeft = "15px";
    adicionarClasse(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");
  }

  // Remove a mensagem de erro e reseta a borda do campo
  function removerMensagemErroCampo(campo) {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  }

  // Retorna o nome do campo extraído do label (sem o asterisco)
  function obterNomeCampo(campo) {
    const label = obterLabelAssociado(campo);
    if (label) {
      const labelClone = label.cloneNode(true);
      const span = labelClone.querySelector("span");
      if (span) span.remove();
      return labelClone.innerText.trim();
    }
    return campo.name || campo.id;
  }

  // Valida o campo com base em seu tipo e atributos
  function validarCampo(campo) {
    // Remove mensagens e classes de validação anteriores
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    let campoValido = true;
    const valorCampo = campo.value.trim();

    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
    } else if (campo.type === "date" && valorCampo !== "") {
      // Validação de data
      const data = new Date(valorCampo);
      if (isNaN(data.getTime())) {
        exibirMensagemErroCampo(campo, "Digite uma data válida.");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    } else if (
      campo.tagName.toLowerCase() === "select" &&
      campo.hasAttribute("required") &&
      (valorCampo === "" || valorCampo === null)
    ) {
      exibirMensagemErroCampo(campo, "Selecione uma opção.");
      campoValido = false;
    } else if (valorCampo !== "" || campo.hasAttribute("required")) {
      adicionarClasse(campo, "success");
    }
    return campoValido;
  }

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
    obterNomeCampo,
  };
})();

// Módulo de Manipulação do Formulário
window.FormularioUtils = (() => {
  let feedbackDiv = null;

  // Valida todos os campos obrigatórios do formulário
  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];
    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    const radioGroupsChecked = new Set();

    camposRequeridos.forEach((campo) => {
      if (campo.type === "radio") {
        if (radioGroupsChecked.has(campo.name)) return;
        radioGroupsChecked.add(campo.name);
        if (!CampoUtils.validarCampo(campo)) {
          formValido = false;
          const campoNome = CampoUtils.obterNomeCampo(campo);
          if (!camposNaoPreenchidos.includes(campoNome)) {
            camposNaoPreenchidos.push(campoNome);
          }
        }
      } else {
        if (!CampoUtils.validarCampo(campo)) {
          formValido = false;
          const campoNome = CampoUtils.obterNomeCampo(campo);
          camposNaoPreenchidos.push(campoNome);
        }
      }
    });

    if (!formValido) {
      mostrarFeedback(
        "error",
        `Preencha os campos obrigatórios: ${camposNaoPreenchidos.join(", ")}`
      );
    }
    return formValido;
  }

  // Função de envio: previne o envio se houver erros; caso contrário, submete o formulário.
  function enviarFormulario(event) {
    event.preventDefault();
    if (feedbackDiv) feedbackDiv.remove();

    if (!validarFormulario()) return;

    mostrarFeedback("success", "Formulário validado com sucesso!");
    document.getElementById("form").reset();
    removerClassesDeSucesso();
  }

  // Exibe feedback (sucesso ou erro) em uma div temporária
  function mostrarFeedback(tipo, mensagem) {
    if (feedbackDiv) feedbackDiv.remove();
    feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add(`message-${tipo}`, "show");
    feedbackDiv.innerText = mensagem;
    document.body.appendChild(feedbackDiv);
    setTimeout(() => feedbackDiv.classList.add("fade-out"), 5000);
    feedbackDiv.addEventListener("transitionend", () => feedbackDiv.remove());
  }

  // Remove a classe "success" de todos os campos (para resetar o visual)
  function removerClassesDeSucesso() {
    document
      .querySelectorAll(".success")
      .forEach((campo) => campo.classList.remove("success"));
  }

  return {
    enviarFormulario,
  };
})();

// Adiciona ouvintes de eventos para o envio do formulário
document
  .getElementById("form")
  .addEventListener("submit", FormularioUtils.enviarFormulario);

// Adiciona ouvintes para validação em tempo real dos campos (nos eventos blur e input)
document.querySelectorAll("input, select, textarea").forEach((campo) => {
  campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
  campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
});
