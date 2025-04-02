// ===============================
// Módulo de Manipulação de Estilos
// ===============================
window.EstiloUtils = (() => {
  const alterarCorBorda = (elemento, cor) => {
    if (elemento) {
      elemento.style.borderColor = cor;
    }
  };
  return { alterarCorBorda };
})();

// ===============================
// Módulo de Manipulação de Campos
// ===============================
window.CampoUtils = (() => {
  // Retorna o label associado ao campo (procura dentro do mesmo .campo para checkboxes e rádios)
  const obterLabelAssociado = (campo) => {
    let label;
    if (campo.type === "radio" || campo.type === "checkbox") {
      const campoDiv = campo.closest(".campo");
      label = campoDiv ? campoDiv.querySelector("label") : null;
    } else {
      label = document.querySelector(`label[for="${campo.id}"]`);
    }
    return label;
  };

  // Adiciona uma classe ao campo, ao label associado e ao span contido (se houver)
  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  };

  // Remove as classes especificadas do campo, label e span associado
  const removerClasses = (campo, ...classes) => {
    campo.classList.remove(...classes);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  };

  // Exibe a mensagem de erro logo após o campo e altera a borda pra cor de erro
  const exibirMensagemErroCampo = (campo, mensagem) => {
    let mensagemErro = campo.nextElementSibling;
    if (!mensagemErro || !mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro = document.createElement("div");
      mensagemErro.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
    }
    mensagemErro.textContent = mensagem;
    mensagemErro.style.color = "var(--erro)";
    mensagemErro.style.marginTop = "8px";
    mensagemErro.style.marginLeft = "15px";
    adicionarClasse(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");
  };

  // Remove a mensagem de erro e reseta a borda
  const removerMensagemErroCampo = (campo) => {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  };

  // Retorna o nome do campo a partir do label (sem o span do asterisco)
  const obterNomeCampo = (campo) => {
    const label = obterLabelAssociado(campo);
    if (label) {
      const labelClone = label.cloneNode(true);
      const span = labelClone.querySelector("span");
      if (span) span.remove();
      return labelClone.textContent.trim();
    }
    return campo.name || campo.id;
  };

  // Valida o campo conforme o tipo e os atributos
  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    let campoValido = true;
    const valorCampo = campo.value.trim();

    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
    } else if (campo.type === "email" && valorCampo !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valorCampo)) {
        exibirMensagemErroCampo(campo, "Digite um e-mail válido.");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    } else if (campo.type === "date" && valorCampo !== "") {
      const data = new Date(valorCampo);
      if (isNaN(data.getTime())) {
        exibirMensagemErroCampo(campo, "Digite uma data válida.");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    } else if (campo.type === "time" && valorCampo !== "") {
      const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(valorCampo)) {
        exibirMensagemErroCampo(campo, "Digite uma hora válida (HH:MM).");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    } else {
      if (valorCampo !== "" || !campo.hasAttribute("required")) {
        adicionarClasse(campo, "success");
      }
    }
    return campoValido;
  };

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
    adicionarClasse,
    removerClasses,
    obterNomeCampo,
  };
})();

// ======================================
// Módulo de Manipulação do Formulário de Lembrete
// ======================================
window.FormularioLembreteUtils = (() => {
  let feedbackTimeout;

  // Valida todos os campos obrigatórios do formulário de lembrete
  const validarFormulario = () => {
    let formValido = true;
    const camposNaoPreenchidos = [];
    const camposRequeridos = document.querySelectorAll(
      "#form input[required], #form select[required], #form textarea[required]"
    );

    camposRequeridos.forEach((campo) => {
      if (!CampoUtils.validarCampo(campo)) {
        formValido = false;
        const nomeCampo = CampoUtils.obterNomeCampo(campo);
        if (!camposNaoPreenchidos.includes(nomeCampo)) {
          camposNaoPreenchidos.push(nomeCampo);
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
  };

  // Função executada no submit do formulário
  const enviarFormulario = (event) => {
    // Temporariamente previna o envio do formulário para realizar validações
    event.preventDefault();

    // Limpa eventuais alertas anteriores
    const alertContainer = document.querySelector(".alert-container");
    if (alertContainer) alertContainer.innerHTML = "";

    if (!validarFormulario()) {
      // Se a validação falhar, não envia o formulário
      const primeiroCampoInvalido = document.querySelector("#form .error");
      if (primeiroCampoInvalido) {
        setTimeout(() => primeiroCampoInvalido.focus(), 500);
      }
      return;
    }

    // Se a validação for bem-sucedida, envia o formulário programaticamente
    mostrarFeedback("success", "Enviando formulário...");

    // Submete o formulário realmente após as validações terem sido concluídas com sucesso
    setTimeout(() => {
      event.target.submit();
    }, 10);
  };

  // Exibe mensagens de alerta num estilo tipo Bootstrap
  const mostrarFeedback = (tipo, mensagem) => {
    let alertContainer = document.querySelector(".alert-container");
    if (!alertContainer) {
      alertContainer = document.createElement("div");
      alertContainer.className = "alert-container";
      document.body.appendChild(alertContainer);
    }

    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", "alert-dismissible", "fade");

    if (tipo === "success") {
      alertDiv.classList.add("alert-sucesso");
    } else if (tipo === "error") {
      alertDiv.classList.add("alert-erro");
    } else if (tipo === "info") {
      alertDiv.classList.add("alert-informacao");
    } else if (tipo === "warning") {
      alertDiv.classList.add("alert-aviso");
    }

    const messageSpan = document.createElement("span");
    messageSpan.innerText = mensagem;
    alertDiv.appendChild(messageSpan);

    const closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("fade");
      alertDiv.addEventListener("transitionend", () => alertDiv.remove());
    });
    alertDiv.appendChild(closeButton);

    alertContainer.appendChild(alertDiv);

    // Dispara a transição pra mostrar o alerta
    setTimeout(() => alertDiv.classList.add("show"), 10);

    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      if (alertDiv) {
        alertDiv.classList.remove("show");
        alertDiv.classList.add("fade");
        alertDiv.addEventListener("transitionend", () => alertDiv.remove());
      }
    }, 5000);
  };

  // Remove a classe de sucesso de todos os campos do formulário
  const removerClassesDeSucesso = () => {
    document.querySelectorAll("#form .success").forEach((campo) => {
      campo.classList.remove("success");
    });
  };

  return {
    enviarFormulario,
    validarFormulario,
    mostrarFeedback,
  };
})();

// ======================================
// Função para Envio do Formulário (chamada inline)
// ======================================
const submitForm = () => {
  const alertContainer = document.querySelector(".alert-container");
  if (alertContainer) alertContainer.innerHTML = "";
  if (!window.FormularioPleitoUtils.validarFormulario()) {
    const primeiroCampoInvalido = document.querySelector("#form .error");
    if (primeiroCampoInvalido) {
      setTimeout(() => primeiroCampoInvalido.focus(), 500);
    }
    return false;
  }
  window.FormularioPleitoUtils.mostrarFeedback(
    "success",
    "Formulário enviado com sucesso!"
  );
  // Retorna true para permitir o envio padrão do formulário quando chamado inline
  return true;
};

// ==========================
// Ouvintes de Eventos
// ==========================
document
  .getElementById("form")
  .addEventListener("submit", window.FormularioLembreteUtils.enviarFormulario);

document
  .querySelectorAll("#form input, #form select, #form textarea")
  .forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  });
