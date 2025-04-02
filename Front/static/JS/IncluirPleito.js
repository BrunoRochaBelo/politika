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
  // Retorna o label associado ao campo (procura no mesmo container para checkboxes e rádios)
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

  // Adiciona uma classe ao campo, ao label e ao span (se houver)
  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  };

  // Remove as classes especificadas do campo, label e span
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

  // Valida o campo conforme seus atributos e tipo
  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    let campoValido = true;
    const valorCampo = campo.value.trim();

    // Validação específica para o CEP
    if (campo.id === "cep") {
      let digits = valorCampo.replace(/\D/g, "");
      if (campo.hasAttribute("required") && digits === "") {
        exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
        campoValido = false;
      } else if (digits.length > 0 && digits.length !== 8) {
        exibirMensagemErroCampo(campo, "Digite um CEP válido com 8 dígitos.");
        campoValido = false;
      } else if (digits.length === 8) {
        adicionarClasse(campo, "success");
        campoValido = true;
      }
      return campoValido;
    }

    // Validações para outros campos
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
// Módulo de Manipulação do Formulário de Pleito
// ======================================
window.FormularioPleitoUtils = (() => {
  let feedbackTimeout;

  // Valida todos os campos obrigatórios do formulário de pleito
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

  // Função chamada no submit do formulário
  const enviarFormulario = (event) => {
    event.preventDefault();

    // Limpa eventuais alertas anteriores
    const alertContainer = document.querySelector(".alert-container");
    if (alertContainer) alertContainer.innerHTML = "";

    if (!validarFormulario()) {
      const primeiroCampoInvalido = document.querySelector("#form .error");
      if (primeiroCampoInvalido) {
        setTimeout(() => primeiroCampoInvalido.focus(), 500);
      }
      return;
    }

    mostrarFeedback("success", "Formulário enviado com sucesso!");
    document.getElementById("form").reset();
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
// Função para Envio do Formulário (chamada inline, se necessário)
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
  document.getElementById("form").reset();
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

  // Só valida quando o CEP estiver completo (8 dígitos)
  if (digits.length === 8) {
    // CEP completo: remove eventuais mensagens de erro e marca como válido
    CampoUtils.removerMensagemErroCampo(input);
    CampoUtils.adicionarClasse(input, "success");
  } else {
    // Se não estiver completo, remove a classe de sucesso para não validar prematuramente
    CampoUtils.removerClasses(input, "success");
    // Opcional: se quiser, pode limpar mensagens de erro ou não exibi-las até o blur
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
  .getElementById("form")
  .addEventListener("submit", window.FormularioPleitoUtils.enviarFormulario);

document
  .querySelectorAll("#form input, #form select, #form textarea")
  .forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  });
