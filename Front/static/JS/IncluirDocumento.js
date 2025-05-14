// IncluirDocumento.js

// ===============================
// Módulo de Manipulação de Estilos
// ===============================
window.EstiloUtils = (() => {
  const alterarCorBorda = (elemento, cor) => {
    if (elemento) elemento.style.borderColor = cor;
  };
  return { alterarCorBorda };
})();

// ===============================
// Módulo de Manipulação de Campos
// ===============================
window.CampoUtils = (() => {
  const obterLabel = (campo) =>
    document.querySelector(`label[for="${campo.id}"]`) ||
    campo.closest(".campo")?.querySelector("label");

  const adicionarClasse = (campo, classe) => {
    campo.classList.add(classe);
    const label = obterLabel(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  };

  const removerClasses = (campo, ...classes) => {
    campo.classList.remove(...classes);
    const label = obterLabel(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  };

  const exibirMensagemErroCampo = (campo, mensagem) => {
    let msg = campo.nextElementSibling;
    if (!msg || !msg.classList.contains("mensagem-erro")) {
      msg = document.createElement("div");
      msg.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(msg, campo.nextSibling);
    }
    msg.innerText = mensagem;
    msg.style.color = "var(--erro)";
    msg.style.margin = "8px 0 0 15px";
    adicionarClasse(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");
  };

  const removerMensagemErroCampo = (campo) => {
    const msg = campo.nextElementSibling;
    if (msg && msg.classList.contains("mensagem-erro")) msg.remove();
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  };

  const validarCampo = (campo) => {
    removerMensagemErroCampo(campo);
    removerClasses(campo, "success", "error");

    const valor = campo.value.trim();
    let valido = true;

    // Select obrigatório (caso role no futuro)
    if (
      campo.tagName.toLowerCase() === "select" &&
      campo.hasAttribute("required")
    ) {
      if (!valor) {
        exibirMensagemErroCampo(campo, "Selecione uma opção.");
        valido = false;
      } else {
        adicionarClasse(campo, "success");
      }
      return valido;
    }

    // Input/textarea obrigatório
    if (campo.hasAttribute("required") && !valor) {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      valido = false;
    } else if (valor) {
      adicionarClasse(campo, "success");
    }

    return valido;
  };

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
    adicionarClasse,
    removerClasses,
  };
})();

// ======================================
// Módulo de Validação do Formulário de Documento
// ======================================
window.FormularioDocumentoUtils = (() => {
  let feedbackTimeout;

  const validarFormulario = () => {
    let formValido = true;
    const faltando = [];

    // Título
    const titulo = document.getElementById("tituloDoc");
    if (!CampoUtils.validarCampo(titulo)) {
      formValido = false;
      faltando.push("Título");
    }

    // Descrição
    const descricao = document.getElementById("descricaoDoc");
    if (!CampoUtils.validarCampo(descricao)) {
      formValido = false;
      faltando.push("Descrição");
    }

    // Emissor
    const emissor = document.getElementById("emissorDoc");
    if (!CampoUtils.validarCampo(emissor)) {
      formValido = false;
      faltando.push("Emissor do documento");
    }

    if (!formValido) {
      mostrarFeedback("error", `Preencha: ${faltando.join(", ")}`);
    }

    return formValido;
  };

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
    }

    const span = document.createElement("span");
    span.innerText = mensagem;
    alertDiv.appendChild(span);

    const btn = document.createElement("button");
    btn.className = "close-btn";
    btn.innerHTML = "&times;";
    btn.addEventListener("click", () => alertDiv.remove());
    alertDiv.appendChild(btn);

    alertContainer.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add("show"), 10);

    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("fade");
      alertDiv.addEventListener("transitionend", () => alertDiv.remove());
    }, 5000);
  };

  const enviarFormulario = (event) => {
    event.preventDefault();
    document
      .querySelectorAll(".alert-container, .mensagem-erro")
      .forEach((el) => el.remove());

    if (!validarFormulario()) {
      const primeiro = document.querySelector(".error");
      primeiro?.scrollIntoView({ behavior: "smooth", block: "center" });
      primeiro?.focus();
      return false;
    }

    mostrarFeedback("success", "Criando documento...");
    setTimeout(() => event.target.submit(), 200);
    return true;
  };

  return {
    enviarFormulario,
    validarFormulario,
    mostrarFeedback,
  };
})();

// ======================================
// Ouvintes de Evento
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener(
    "submit",
    window.FormularioDocumentoUtils.enviarFormulario
  );

  // valida inline inputs e textarea
  document
    .querySelectorAll('#form input[type="text"], #form textarea')
    .forEach((campo) => {
      campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
      campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
    });

  // valida datas se quiser (opcional)
  // document.querySelectorAll('#form input[type="date"]').forEach(campo => {
  //   campo.addEventListener('blur', () => CampoUtils.validarCampo(campo));
  //   campo.addEventListener('input', () => CampoUtils.validarCampo(campo));
  // });
});

// Função inline de compatibilidade com onclick
function submitForm() {
  return window.FormularioDocumentoUtils.enviarFormulario(event);
}
