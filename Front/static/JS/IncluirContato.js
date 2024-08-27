// Módulo de Manipulação de Estilos
const EstiloUtils = (() => {
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
const CampoUtils = (() => {
  function alterarCorAsterisco(campoId, cor) {
    const labelSpan = document.querySelector(`label[for="${campoId}"] span`);
    if (labelSpan) {
      labelSpan.style.color = cor;
    }
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

  function obterSpanAssociado(campo) {
    const label = document.querySelector(`label[for="${campo.id}"]`);
    return label ? label.querySelector("span") : null;
  }

  function exibirMensagemErroCampo(campo, mensagem) {
    let mensagemErro = campo.nextElementSibling;
    if (!mensagemErro || !mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro = document.createElement("div");
      mensagemErro.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
    }
    mensagemErro.innerText = mensagem;
    adicionarClasse(campo, "error");
    alterarCorAsterisco(campo.id, "var(--erro)"); // Altera cor do asterisco para a cor de erro
  }

  function removerMensagemErroCampo(campo) {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    alterarCorAsterisco(campo.id, ""); // Reseta a cor do asterisco
  }

  function validarCampo(campo) {
    const valorCampo = campo.value.trim();
    let campoValido = true;

    removerMensagemErroCampo(campo);

    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    } else if (
      campo.type === "email" &&
      valorCampo !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(campo, "Digite um e-mail válido.");
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    } else if (
      campo.type === "tel" &&
      valorCampo !== "" &&
      !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um telefone válido no formato (XX) XXXX-XXXX."
      );
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    } else if (valorCampo !== "" || campo.hasAttribute("required")) {
      adicionarClasse(campo, "success");
      EstiloUtils.alterarCorBorda(campo.closest(".card-session"), ""); // Reseta a cor da borda se estiver válido
    }

    // Se o campo era obrigatório e foi preenchido, mas agora está vazio, deve exibir erro
    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    }

    return campoValido;
  }

  function formatarCampo(input, regex, formato) {
    let value = input.value.replace(/\D/g, "");
    input.value = regex.test(value) ? formato(value) : value;
    validarCampo(input);
  }

  function validarNomesObrigatorios() {
    const campos = ["nome_contato", "nome_fantasia"].map((id) =>
      document.getElementById(id)
    );
    const algumCampoPreenchido = campos.some(
      (campo) => campo.value.trim() !== ""
    );

    campos.forEach((campo) => {
      campo.required = !algumCampoPreenchido;
      validarCampo(campo);
    });

    if (algumCampoPreenchido) {
      campos.forEach((campo) => adicionarClasse(campo, "success"));
    }
  }

  return {
    validarCampo,
    formatarCampo,
    validarNomesObrigatorios,
    alterarCorAsterisco,
  };
})();

// Módulo de Manipulação de Sessões
const SessaoUtils = (() => {
  function toggleElementVisibility(element, condition) {
    if (element) {
      element.classList.toggle("hiddenCc", !condition);
    }
  }

  function toggleComissionadoFields() {
    const comissionado = document.getElementById("comissionado").checked;
    toggleElementVisibility(
      document.getElementById("comissionado-fields"),
      comissionado
    );
  }

  function mostrarCampoWhatsapp() {
    const checkbox = document.getElementById("whatsapp_switch");
    const campoWhatsapp = document.getElementById("campoWhatsapp");
    const telefonePrincipalInput = document.getElementById("telefonePrincipal");
    const whatsappInput = document.getElementById("whatsapp");

    toggleElementVisibility(campoWhatsapp, !checkbox.checked);
    whatsappInput.value = checkbox.checked ? telefonePrincipalInput.value : "";
    CampoUtils.validarCampo(whatsappInput);

    // Alterar a cor do "*" no label "Este número é WhatsApp?"
    CampoUtils.alterarCorAsterisco("whatsapp", checkbox.checked ? "red" : "");
  }

  function mostrarCamposConjuge() {
    const estadoCivil = document.getElementById("estado_civil").value;
    toggleElementVisibility(
      document.getElementById("camposConjuge"),
      estadoCivil === "Casado(a)" || estadoCivil === "União Estável"
    );
  }

  return {
    toggleComissionadoFields,
    mostrarCampoWhatsapp,
    mostrarCamposConjuge,
  };
})();

// Módulo de Manipulação do Formulário
const FormularioUtils = (() => {
  let feedbackDiv = null;

  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];

    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    CampoUtils.validarNomesObrigatorios();

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
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (feedbackDiv) {
      feedbackDiv.remove();
    }

    if (validarFormulario()) {
      mostrarFeedback("success", "Formulário validado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      mostrarFeedback(
        "error",
        "O formulário contém erros. Corrija e tente novamente."
      );
    }
  }

  function mostrarFeedback(tipo, mensagem) {
    if (feedbackDiv) {
      feedbackDiv.remove();
    }

    feedbackDiv = criarFeedbackDiv(mensagem, `message-${tipo}`);
    document.body.appendChild(feedbackDiv);
    feedbackDiv.classList.add("show");
    removerFeedbackDivAposTempo(feedbackDiv);
  }

  function criarFeedbackDiv(mensagem, classe) {
    const div = document.createElement("div");
    div.classList.add(classe);
    div.innerText = mensagem;
    return div;
  }

  function removerFeedbackDivAposTempo(div, tempo = 5000) {
    setTimeout(() => {
      div.classList.add("fade-out");
      div.addEventListener("transitionend", () => {
        div.remove();
        feedbackDiv = null;
      });
    }, tempo);
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
  .getElementById("comissionado")
  .addEventListener("change", SessaoUtils.toggleComissionadoFields);
document
  .getElementById("nome_contato")
  .addEventListener("input", CampoUtils.validarNomesObrigatorios);
document
  .getElementById("nome_fantasia")
  .addEventListener("input", CampoUtils.validarNomesObrigatorios);

function formatarTelefone(input, regex, formato) {
  CampoUtils.formatarCampo(input, regex, formato);
}

document
  .getElementById("telefonePrincipal")
  .addEventListener("blur", function () {
    formatarTelefone(
      this,
      /^\d{11}$/,
      (value) =>
        `(${value.slice(0, 2)}) ${value.slice(2, 3)}${value.slice(
          3,
          7
        )}-${value.slice(7)}`
    );
  });

document
  .getElementById("telefoneAdicional")
  .addEventListener("blur", function () {
    formatarTelefone(
      this,
      /^\d{10}$/,
      (value) => `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
    );
  });

document.getElementById("cep").addEventListener("blur", function () {
  CampoUtils.formatarCampo(
    this,
    /^\d{8}$/,
    (value) => `${value.slice(0, 5)}-${value.slice(5)}`
  );
});

document
  .getElementById("whatsapp_switch")
  .addEventListener("change", SessaoUtils.mostrarCampoWhatsapp);
document
  .getElementById("estado_civil")
  .addEventListener("change", SessaoUtils.mostrarCamposConjuge);
document
  .getElementById("form")
  .addEventListener("submit", FormularioUtils.enviarFormulario);

document.querySelectorAll("input, select, textarea").forEach((campo) => {
  campo.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      CampoUtils.validarCampo(event.target);
    }
  });

  campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
  campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  campo.addEventListener("change", () => CampoUtils.validarCampo(campo));
});
