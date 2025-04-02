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
  // Retorna o label associado ao campo (buscando no mesmo container para rádios e checkboxes)
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

  // Adiciona uma classe ao campo, label e span (se existir)
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

  // Exibe mensagem de erro logo após o campo e altera a borda para a cor de erro
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

  // Remove a mensagem de erro e reseta a borda do campo
  const removerMensagemErroCampo = (campo) => {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  };

  // Retorna o nome do campo a partir do label (removendo o span do asterisco)
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

  // Valida o campo conforme seu tipo e atributos,
  // tratando de forma específica o campo de CEP
  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    let campoValido = true;
    const valorCampo = campo.value.trim();

    // Validação específica para CEP
    if (campo.id === "cep") {
      const digits = valorCampo.replace(/\D/g, "");
      if (campo.hasAttribute("required") && digits === "") {
        exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
        campoValido = false;
      } else if (digits.length > 0 && digits.length !== 8) {
        exibirMensagemErroCampo(campo, "Digite um CEP válido com 8 dígitos.");
        campoValido = false;
      } else if (digits.length === 8) {
        adicionarClasse(campo, "success");
      }
      return campoValido;
    }

    // Validação padrão: campo obrigatório
    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
    }
    // Validação de e-mail
    else if (campo.type === "email" && valorCampo !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valorCampo)) {
        exibirMensagemErroCampo(campo, "Digite um e-mail válido.");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    }
    // Validação de data
    else if (campo.type === "date" && valorCampo !== "") {
      const data = new Date(valorCampo);
      if (isNaN(data.getTime())) {
        exibirMensagemErroCampo(campo, "Digite uma data válida.");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    }
    // Validação de time
    else if (campo.type === "time" && valorCampo !== "") {
      const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(valorCampo)) {
        exibirMensagemErroCampo(campo, "Digite uma hora válida (HH:MM).");
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    }
    // Validação genérica para demais campos
    else {
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
// Módulo de Manipulação do Formulário de Evento
// ======================================
window.FormularioEventoUtils = (() => {
  let feedbackTimeout;

  // Valida os campos obrigatórios do formulário de Evento
  const validarFormulario = () => {
    let formValido = true;
    const camposNaoPreenchidos = [];
    const camposRequeridos = document.querySelectorAll(
      "#formEvento input[required], #formEvento select[required], #formEvento textarea[required]"
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
    event.preventDefault();

    // Limpa eventuais alertas anteriores
    const alertContainer = document.querySelector(".alert-container");
    if (alertContainer) alertContainer.innerHTML = "";

    if (!validarFormulario()) {
      const primeiroCampoInvalido =
        document.querySelector("#formEvento .error");
      if (primeiroCampoInvalido) {
        setTimeout(() => primeiroCampoInvalido.focus(), 500);
      }
      return;
    }

    mostrarFeedback("success", "Formulário enviado com sucesso!");
    document.getElementById("formEvento").reset();
    removerClassesDeSucesso();
  };

  // Exibe mensagens de alerta no padrão Bootstrap-like
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
    document.querySelectorAll("#formEvento .success").forEach((campo) => {
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
  if (!window.FormularioEventoUtils.validarFormulario()) {
    const primeiroCampoInvalido = document.querySelector("#formEvento .error");
    if (primeiroCampoInvalido) {
      setTimeout(() => primeiroCampoInvalido.focus(), 500);
    }
    return false;
  }
  window.FormularioEventoUtils.mostrarFeedback(
    "success",
    "Formulário enviado com sucesso!"
  );
  document.getElementById("formEvento").reset();
  return true;
};

// ==========================
// Funções para Máscaras de Input (CEP)
// ==========================
const aplicarMascaraCEP = (input) => {
  // Remove tudo que não for dígito
  let digits = input.value.replace(/\D/g, "");

  // Se tiver mais de 5 dígitos, insere o hífen (limitando o CEP a 8 dígitos)
  if (digits.length > 5) {
    input.value = digits.substring(0, 5) + "-" + digits.substring(5, 8);
  } else {
    input.value = digits;
  }

  // Atualiza a validação visual: somente marca sucesso se estiver completo
  if (digits.length === 8) {
    CampoUtils.removerMensagemErroCampo(input);
    CampoUtils.adicionarClasse(input, "success");
  } else {
    CampoUtils.removerClasses(input, "success");
  }
};

// Adiciona o listener para a máscara de CEP, se o campo existir
const campoCEP = document.getElementById("cep");
if (campoCEP) {
  campoCEP.addEventListener("input", function () {
    aplicarMascaraCEP(this);
  });
}

// ==========================
// Ouvintes de Eventos
// ==========================
document
  .getElementById("formEvento")
  .addEventListener("submit", window.FormularioEventoUtils.enviarFormulario);

document
  .querySelectorAll(
    "#formEvento input, #formEvento select, #formEvento textarea"
  )
  .forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  });
