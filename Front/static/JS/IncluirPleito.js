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
  function obterSpanAssociado(campo) {
    const label = document.querySelector(`label[for="${campo.id}"]`);
    return label ? label.querySelector("span") : null;
  }

  function adicionarClasse(campo, classe) {
    campo.classList.add(classe);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.add(classe);
  }

  function removerClasses(campo, ...classes) {
    campo.classList.remove(...classes);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.remove(...classes);
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

  function validarCampo(campo) {
    // Remove mensagens de erro e classes de validação anteriores
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    const valorCampo = campo.value.trim();
    let campoValido = true;

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
    } else if (
      campo.tagName.toLowerCase() === "select" &&
      campo.hasAttribute("required") &&
      valorCampo === ""
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
  };
})();

// Módulo de Manipulação do Formulário
window.FormularioUtils = (() => {
  let feedbackDiv = null;

  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];

    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    camposRequeridos.forEach((campo) => {
      if (!CampoUtils.validarCampo(campo)) {
        formValido = false;
        const label = document.querySelector(`label[for="${campo.id}"]`);
        const campoNome = label
          ? label.innerText.replace("*", "").trim()
          : campo.id;
        camposNaoPreenchidos.push(campoNome);
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
    document.getElementById("form").reset();
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
      .querySelectorAll(".success")
      .forEach((campo) => campo.classList.remove("success"));
  }

  return {
    enviarFormulario,
  };
})();

// Adicionar ouvintes de eventos
document
  .getElementById("form")
  .addEventListener("submit", FormularioUtils.enviarFormulario);

// Adicionar ouvintes de eventos para outros campos
document.querySelectorAll("input, select, textarea").forEach((campo) => {
  campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
  campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
});
