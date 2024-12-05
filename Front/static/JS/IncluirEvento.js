// Módulo de Manipulação de Estilos
window.EstiloUtils = (() => {
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
  function obterLabelAssociado(campo) {
    let label;
    if (campo.type === "radio") {
      // Para campos de rádio, encontramos o label dentro do mesmo .campo
      const campoDiv = campo.closest(".campo");
      label = campoDiv ? campoDiv.querySelector("label") : null;
    } else {
      label = document.querySelector(`label[for="${campo.id}"]`);
    }
    return label;
  }

  function adicionarClasse(campo, classe) {
    campo.classList.add(classe);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  }

  function removerClasses(campo, ...classes) {
    campo.classList.remove(...classes);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  }

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

  function removerMensagemErroCampo(campo) {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  }

  function obterNomeCampo(campo) {
    const label = obterLabelAssociado(campo);
    if (label) {
      // Clonar o label para não modificar o original
      const labelClone = label.cloneNode(true);
      // Remover o span com o asterisco
      const span = labelClone.querySelector("span");
      if (span) span.remove();
      return labelClone.innerText.trim();
    }
    return campo.name || campo.id;
  }

  function validarCampo(campo) {
    // Remove mensagens de erro e classes de validação anteriores
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    let campoValido = true;

    if (campo.type === "radio") {
      // Para grupos de rádio, verifica se algum está selecionado
      const radios = document.getElementsByName(campo.name);
      const algumSelecionado = Array.from(radios).some(
        (radio) => radio.checked
      );
      if (campo.hasAttribute("required") && !algumSelecionado) {
        exibirMensagemErroCampo(
          campo.closest(".campo"),
          "Selecione uma opção."
        );
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    } else {
      const valorCampo = campo.value.trim();

      if (campo.hasAttribute("required") && valorCampo === "") {
        exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
        campoValido = false;
      } else if (campo.type === "date" && valorCampo !== "") {
        // Verificar se a data é válida
        const data = new Date(valorCampo);
        if (isNaN(data.getTime())) {
          exibirMensagemErroCampo(campo, "Digite uma data válida.");
          campoValido = false;
        } else {
          adicionarClasse(campo, "success");
        }
      } else if (campo.type === "time" && valorCampo !== "") {
        // Verificar se a hora é válida
        const horaRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
        if (!horaRegex.test(valorCampo)) {
          exibirMensagemErroCampo(campo, "Digite uma hora válida (HH:MM).");
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
window.FormularioEventoUtils = (() => {
  let feedbackDiv = null;

  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];

    const camposRequeridos = document.querySelectorAll(
      "#formEvento input[required], #formEvento select[required], #formEvento textarea[required]"
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
      mostrarFeedbackErro(camposNaoPreenchidos);
    }

    return formValido;
  }

  function enviarFormulario(event) {
    event.preventDefault();
    if (feedbackDiv) feedbackDiv.remove();

    if (!validarFormulario()) return;

    mostrarFeedbackSucesso();
    document.getElementById("formEvento").reset();
    removerClassesDeSucesso();
  }

  function mostrarFeedbackSucesso() {
    mostrarFeedback("success", "Formulário validado com sucesso!");
  }

  function mostrarFeedbackErro(camposNaoPreenchidos) {
    const mensagem = `Preencha os campos obrigatórios: ${camposNaoPreenchidos.join(
      ", "
    )}`;
    mostrarFeedback("error", mensagem);
  }

  function mostrarFeedback(tipo, mensagem) {
    if (feedbackDiv) feedbackDiv.remove();

    feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add(`message-${tipo}`, "show");
    feedbackDiv.innerText = mensagem;
    document.body.appendChild(feedbackDiv);

    setTimeout(() => feedbackDiv.classList.add("fade-out"), 5000);
    feedbackDiv.addEventListener("transitionend", () => feedbackDiv.remove());
  }

  function removerClassesDeSucesso() {
    document
      .querySelectorAll("#formEvento .success")
      .forEach((campo) => campo.classList.remove("success"));
  }

  return {
    enviarFormulario,
  };
})();

// Adicionar ouvintes de eventos para o formulário de Evento
document
  .getElementById("formEvento")
  .addEventListener("submit", FormularioEventoUtils.enviarFormulario);

// Adicionar ouvintes de eventos para os campos do formulário de Evento
document
  .querySelectorAll(
    "#formEvento input, #formEvento select, #formEvento textarea"
  )
  .forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  });
