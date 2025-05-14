// IncluirBiblioteca.js

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

    // Select obrigatório
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

    // Input text obrigatório
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
// Módulo de Validação do Formulário
// ======================================
window.FormularioBibliotecaUtils = (() => {
  let feedbackTimeout;

  // validação do grupo de checkboxes
  const validarCheckboxGroup = (groupId) => {
    const container = document.getElementById(groupId);
    const checkboxes = Array.from(
      container.querySelectorAll('input[type="checkbox"]')
    );
    const algumChecado = checkboxes.some((cb) => cb.checked);

    CampoUtils.removerMensagemErroCampo(container);
    CampoUtils.removerClasses(container, "success", "error");

    if (!algumChecado) {
      CampoUtils.exibirMensagemErroCampo(
        container,
        "Selecione pelo menos um tipo."
      );
      return false;
    } else {
      CampoUtils.adicionarClasse(container, "success");
      return true;
    }
  };

  const validarFormulario = () => {
    let formValido = true;
    const faltando = [];

    const nome = document.getElementById("nomeBiblioteca");
    if (!CampoUtils.validarCampo(nome)) {
      formValido = false;
      faltando.push("Nome da Biblioteca");
    }

    const modelo = document.getElementById("modelo_biblio");
    if (!CampoUtils.validarCampo(modelo)) {
      formValido = false;
      faltando.push("Modelo da Biblioteca");
    }

    if (!validarCheckboxGroup("tipo_arquivo")) {
      formValido = false;
      faltando.push("Tipo(s) de arquivo(s)");
    }

    if (!formValido) {
      mostrarFeedback("error", `Faltando: ${faltando.join(", ")}`);
    }

    return formValido;
  };

  // ** Aqui é que mudamos pro padrão do seu projeto **
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

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => alertDiv.remove());
    alertDiv.appendChild(closeBtn);

    alertContainer.appendChild(alertDiv);
    // dispara o fade-in
    setTimeout(() => alertDiv.classList.add("show"), 10);

    // limpa qualquer timeout anterior
    clearTimeout(feedbackTimeout);
    // após 5s, dispara fade-out e remove ao fim da transição
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

    mostrarFeedback("success", "Enviando formulário...");
    setTimeout(() => event.target.submit(), 200);
    return true;
  };

  return {
    enviarFormulario,
    validarFormulario,
    mostrarFeedback,
    validarCheckboxGroup,
  };
})();

// ======================================
// Ouvintes de Evento
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener(
    "submit",
    window.FormularioBibliotecaUtils.enviarFormulario
  );

  document
    .querySelectorAll('#form input[type="text"], #form select')
    .forEach((campo) => {
      campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
      campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
    });

  document
    .querySelectorAll('#tipo_arquivo input[type="checkbox"]')
    .forEach((cb) => {
      cb.addEventListener("change", () => {
        window.FormularioBibliotecaUtils.validarCheckboxGroup("tipo_arquivo");
      });
    });
});

// Função inline para onclick
function submitForm() {
  return window.FormularioBibliotecaUtils.enviarFormulario(event);
}
