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
  const obterSpanAssociado = (campo) => {
    const label = document.querySelector(`label[for="${campo.id}"]`);
    return label ? label.querySelector("span") : null;
  };

  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.add(classe);
  };

  const removerClasses = (campo, ...classes) => {
    campo.classList.remove(...classes);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.remove(...classes);
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

    // Altera a borda do próprio campo
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");

    // Altera a borda do container .card-session (se existir)
    const cardSession = campo.closest(".card-session");
    if (cardSession) {
      EstiloUtils.alterarCorBorda(cardSession, "var(--erro)");
    }
  };

  const removerMensagemErroCampo = (campo) => {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");

    // Restaura a borda do campo
    EstiloUtils.alterarCorBorda(campo, "");

    // Restaura a borda do container .card-session (se existir)
    const cardSession = campo.closest(".card-session");
    if (cardSession) {
      EstiloUtils.alterarCorBorda(cardSession, "");
    }
  };

  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    const valorCampo = campo.value.trim();
    let campoValido = true;

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
    else if (
      campo.type === "email" &&
      valorCampo !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(campo, "Digite um e-mail válido.");
      campoValido = false;
    }
    // Validação de telefone
    else if (
      campo.type === "tel" &&
      valorCampo !== "" &&
      !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um telefone válido no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX."
      );
      campoValido = false;
    }
    // Validação de CNPJ
    else if (
      campo.id === "cnpj" &&
      valorCampo !== "" &&
      !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um CNPJ válido no formato 00.000.000/0000-00."
      );
      campoValido = false;
    }
    // Se válido, adiciona a classe de sucesso para os demais campos
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
  };
})();

// ==================================
// Módulo de Manipulação do Formulário
// ==================================
window.FormularioUtils = (() => {
  // Variável interna para controle de timeout dos alertas
  let feedbackTimeout;

  // Procura a primeira seção com campos obrigatórios não preenchidos
  const encontrarPrimeiraSecaoIncompleta = () => {
    const secoes = document.querySelectorAll(".secao-interna-template");
    for (let i = 0; i < secoes.length; i++) {
      const secao = secoes[i];
      const camposObrigatorios = secao.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );
      for (const campo of camposObrigatorios) {
        if (!campo.value.trim()) {
          return i + 1;
        }
      }
    }
    return -1;
  };

  // Valida todos os campos do formulário
  const validarFormulario = () => {
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
      mostrarFeedback(
        "error",
        `Preencha os campos obrigatórios: ${camposNaoPreenchidos.join(", ")}`
      );
    }

    return formValido;
  };

  // Função chamada no submit do formulário
  const enviarFormulario = (event) => {
    // Previne temporariamente o envio para validar
    event.preventDefault();

    // Limpa os alertas anteriores, se houver
    const alertContainer = document.querySelector(".alert-container");
    if (alertContainer) alertContainer.innerHTML = "";

    if (!validarFormulario()) {
      const secaoIncompleta = encontrarPrimeiraSecaoIncompleta();
      if (secaoIncompleta !== -1) {
        const secao = document.querySelector(`#secao${secaoIncompleta}`);
        // Só chama o changeSession se a seção ainda não estiver ativa
        if (!secao.classList.contains("active")) {
          changeSession(secaoIncompleta);
        }
        const primeiroCampoIncompleto = secao.querySelector(
          "input[required]:not(:valid), select[required]:not(:valid), textarea[required]:not(:valid)"
        );
        if (primeiroCampoIncompleto) {
          setTimeout(() => {
            primeiroCampoIncompleto.focus();
          }, 500);
        }
      }
      return;
    }

    mostrarFeedback("success", "Enviando formulário...");
    // Envia o formulário programaticamente após validação bem-sucedida
    setTimeout(() => {
      event.target.submit();
    }, 10);
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
    encontrarPrimeiraSecaoIncompleta,
  };
})();

// ==========================
// Funções para Máscaras de Input
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

const aplicarMascaraCNPJ = (input) => {
  let digits = input.value.replace(/\D/g, "");
  let formatted = "";
  if (digits.length > 0) {
    formatted = digits.substring(0, Math.min(2, digits.length));
    if (digits.length > 2) {
      formatted += "." + digits.substring(2, Math.min(5, digits.length));
    }
    if (digits.length > 5) {
      formatted += "." + digits.substring(5, Math.min(8, digits.length));
    }
    if (digits.length > 8) {
      formatted += "/" + digits.substring(8, Math.min(12, digits.length));
    }
    if (digits.length > 12) {
      formatted += "-" + digits.substring(12, Math.min(14, digits.length));
    }
  }
  input.value = formatted;
};

const aplicarMascaraTelefone = (input) => {
  let digits = input.value.replace(/\D/g, "");
  if (digits.length > 11) digits = digits.substring(0, 11);
  let formatted = "";
  if (digits.length < 2) {
    formatted = digits;
  } else {
    const ddd = digits.substring(0, 2);
    formatted = `(${ddd})`;
    const rest = digits.substring(2);
    if (rest.length > 0) {
      formatted += " ";
      if (rest.length <= 4) {
        formatted += rest;
      } else if (rest.length <= 8) {
        formatted += rest.substring(0, 4) + "-" + rest.substring(4);
      } else {
        formatted += rest.substring(0, 5) + "-" + rest.substring(5, 9);
      }
    }
  }
  input.value = formatted;
};

const aplicarMascaraCPF = (input) => {
  let digits = input.value.replace(/\D/g, "");
  let formatted = "";
  if (digits.length > 0) {
    formatted = digits.substring(0, Math.min(3, digits.length));
    if (digits.length > 3) {
      formatted += "." + digits.substring(3, Math.min(6, digits.length));
    }
    if (digits.length > 6) {
      formatted += "." + digits.substring(6, Math.min(9, digits.length));
    }
    if (digits.length > 9) {
      formatted += "-" + digits.substring(9, Math.min(11, digits.length));
    }
  }
  input.value = formatted;
};

// ===================================
// Função para Envio do Formulário (caso seja chamada inline)
// ===================================
const submitForm = () => {
  // Limpa os alertas anteriores
  const alertContainer = document.querySelector(".alert-container");
  if (alertContainer) alertContainer.innerHTML = "";

  if (!window.FormularioUtils.validarFormulario()) {
    const secaoIncompleta =
      window.FormularioUtils.encontrarPrimeiraSecaoIncompleta();
    if (secaoIncompleta !== -1) {
      changeSession(secaoIncompleta);
      const secao = document.querySelector(`#secao${secaoIncompleta}`);
      const primeiroCampoIncompleto = secao.querySelector(
        "input[required]:not(:valid), select[required]:not(:valid), textarea[required]:not(:valid)"
      );
      if (primeiroCampoIncompleto) {
        setTimeout(() => {
          primeiroCampoIncompleto.focus();
        }, 500);
      }
    }
    return false;
  }

  window.FormularioUtils.mostrarFeedback(
    "success",
    "Formulário enviado com sucesso!"
  );
  // Não reseta o formulário aqui, pois ele será submetido ao servidor
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

document.getElementById("cep").addEventListener("input", function () {
  aplicarMascaraCEP(this);
});

document.getElementById("cnpj")?.addEventListener("input", function () {
  aplicarMascaraCNPJ(this);
});

document
  .getElementById("telefonePrincipal")
  .addEventListener("input", function () {
    aplicarMascaraTelefone(this);
  });

document
  .getElementById("telefoneAdicional")
  .addEventListener("input", function () {
    aplicarMascaraTelefone(this);
  });

document.getElementById("cpf")?.addEventListener("input", function () {
  aplicarMascaraCPF(this);
});

document.getElementById("whatsapp")?.addEventListener("input", function () {
  aplicarMascaraTelefone(this);
});

document
  .getElementById("whatsapp_switch")
  .addEventListener("change", function () {
    const checkbox = this;
    const campoWhatsapp = document.getElementById("campoWhatsapp");
    const telefonePrincipalInput = document.getElementById("telefonePrincipal");
    const whatsappInput = document.getElementById("whatsapp");

    if (checkbox.checked) {
      campoWhatsapp.classList.remove("hidden");
      whatsappInput.value = telefonePrincipalInput.value;
    } else {
      campoWhatsapp.classList.add("hidden");
      whatsappInput.value = "";
    }
    CampoUtils.validarCampo(whatsappInput);
  });
