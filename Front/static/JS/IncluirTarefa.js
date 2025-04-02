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
  // Retorna o label associado ao campo. Para rádios, busca no container.
  const obterLabelAssociado = (campo) => {
    let label;
    if (campo.type === "radio") {
      const campoDiv = campo.closest(".campo");
      label = campoDiv ? campoDiv.querySelector("label") : null;
    } else {
      label = document.querySelector(`label[for="${campo.id}"]`);
    }
    return label;
  };

  const obterSpanAssociado = (campo) => {
    const label = obterLabelAssociado(campo);
    return label ? label.querySelector("span") : null;
  };

  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  };

  const removerClasses = (campo, ...classes) => {
    campo.classList.remove(...classes);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  };

  const exibirMensagemErroCampo = (campo, mensagem) => {
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
  };

  const removerMensagemErroCampo = (campo) => {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  };

  const obterNomeCampo = (campo) => {
    const label = obterLabelAssociado(campo);
    if (label) {
      return label.textContent.replace("*", "").trim();
    }
    return campo.name || campo.id;
  };

  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    const valorCampo = campo.value.trim();
    let campoValido = true;

    // Validação específica para rádios
    if (campo.type === "radio" && campo.hasAttribute("required")) {
      const name = campo.name;
      const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
      const checked = Array.from(radioGroup).some((radio) => radio.checked);

      if (!checked) {
        exibirMensagemErroCampo(campo, "Selecione uma opção.");
        campoValido = false;
      } else {
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
    else if (
      campo.type === "email" &&
      valorCampo !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(campo, "Digite um e-mail válido.");
      campoValido = false;
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
    // Validação de select
    else if (
      campo.tagName.toLowerCase() === "select" &&
      campo.hasAttribute("required") &&
      (valorCampo === "" || valorCampo === null)
    ) {
      exibirMensagemErroCampo(campo, "Selecione uma opção.");
      campoValido = false;
    }
    // Se válido, adiciona a classe de sucesso
    else if (valorCampo !== "" || campo.hasAttribute("required")) {
      adicionarClasse(campo, "success");
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

// ==================================
// Módulo de Manipulação do Formulário
// ==================================
window.FormularioUtils = (() => {
  // Variável interna para controle de timeout dos alertas
  let feedbackTimeout;

  // Valida todos os campos do formulário
  const validarFormulario = () => {
    let formValido = true;
    const camposNaoPreenchidos = [];
    const radioGroupsChecked = new Set();

    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    camposRequeridos.forEach((campo) => {
      if (campo.type === "radio") {
        if (radioGroupsChecked.has(campo.name)) return;
        radioGroupsChecked.add(campo.name);

        const name = campo.name;
        const radioGroup = document.querySelectorAll(`input[name="${name}"]`);
        const checked = Array.from(radioGroup).some((radio) => radio.checked);

        if (!checked) {
          formValido = false;
          const campoNome = CampoUtils.obterNomeCampo(campo);
          if (!camposNaoPreenchidos.includes(campoNome)) {
            camposNaoPreenchidos.push(campoNome);
          }
          CampoUtils.exibirMensagemErroCampo(campo, "Selecione uma opção.");
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
  };

  // Função chamada no submit do formulário
  const enviarFormulario = (event) => {
    event.preventDefault();

    // Limpa os alertas anteriores, se houver
    const alertContainer = document.querySelector(".alert-container");
    if (alertContainer) alertContainer.innerHTML = "";

    if (!validarFormulario()) {
      const primeiroCampoIncompleto = document.querySelector(
        "input[required]:not(:valid), select[required]:not(:valid), textarea[required]:not(:valid)"
      );
      if (primeiroCampoIncompleto) {
        setTimeout(() => {
          primeiroCampoIncompleto.focus();
        }, 500);
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

    // Força reflow para disparar a transição
    setTimeout(() => {
      alertDiv.classList.add("show");
    }, 10);

    // Remove automaticamente após 3 segundos
    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      if (alertDiv) {
        alertDiv.classList.remove("show");
        alertDiv.classList.add("fade");
        alertDiv.addEventListener("transitionend", () => alertDiv.remove());
      }
    }, 5000);
  };

  const removerClassesDeSucesso = () => {
    document
      .querySelectorAll(".success")
      .forEach((campo) => campo.classList.remove("success"));
  };

  return {
    enviarFormulario,
    validarFormulario,
    mostrarFeedback,
  };
})();

// ===================================
// Função para Envio do Formulário (caso seja chamada inline)
// ===================================
const submitForm = () => {
  // Limpa os alertas anteriores
  const alertContainer = document.querySelector(".alert-container");
  if (alertContainer) alertContainer.innerHTML = "";

  if (!window.FormularioUtils.validarFormulario()) {
    const primeiroCampoIncompleto = document.querySelector(
      "input[required]:not(:valid), select[required]:not(:valid), textarea[required]:not(:valid)"
    );
    if (primeiroCampoIncompleto) {
      setTimeout(() => {
        primeiroCampoIncompleto.focus();
      }, 500);
    }
    return false;
  }

  window.FormularioUtils.mostrarFeedback(
    "success",
    "Formulário enviado com sucesso!"
  );
  document.getElementById("form").reset();
  return true;
};

// ==========================
// Ouvintes de Eventos
// ==========================
document
  .getElementById("form")
  .addEventListener("submit", window.FormularioUtils.enviarFormulario);

document.querySelectorAll("input, select, textarea").forEach((campo) => {
  campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
  campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
});
