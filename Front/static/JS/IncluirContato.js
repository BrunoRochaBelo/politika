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
  // Altera a cor do asterisco presente no label associado ao campo
  function alterarCorAsterisco(campoId, cor) {
    const labelSpan = document.querySelector(`label[for="${campoId}"] span`);
    if (labelSpan) {
      labelSpan.style.color = cor;
    }
  }

  // Busca o span associado ao label do campo
  function obterSpanAssociado(campo) {
    const label = document.querySelector(`label[for="${campo.id}"]`);
    return label ? label.querySelector("span") : null;
  }

  // Adiciona uma classe tanto no campo quanto no seu span associado
  function adicionarClasse(campo, classe) {
    campo.classList.add(classe);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.add(classe);
  }

  // Remove as classes passadas do campo e do seu span associado
  function removerClasses(campo, ...classes) {
    campo.classList.remove(...classes);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.remove(...classes);
  }

  // Exibe mensagem de erro logo abaixo do campo
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
    alterarCorAsterisco(campo.id, "var(--erro)");
  }

  // Remove a mensagem de erro associada ao campo
  function removerMensagemErroCampo(campo) {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    alterarCorAsterisco(campo.id, "");
  }

  // Valida o campo com base em atributos e padrões (e-mail, telefone, CPF, CNPJ)
  function validarCampo(campo) {
    const valorCampo = campo.value.trim();
    let campoValido = true;

    removerMensagemErroCampo(campo);

    // Verifica se o campo é obrigatório e está vazio
    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    }

    // Validação para e-mail
    if (
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
    }

    // Validação para telefone
    if (
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
    }

    // Validação para CPF (formato: 000.000.000-00)
    if (
      campo.id === "cpf" &&
      valorCampo !== "" &&
      !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um CPF válido no formato 000.000.000-00."
      );
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    }

    // Validação para CNPJ (formato: 00.000.000/0000-00)
    if (
      campo.id === "cnpj" &&
      valorCampo !== "" &&
      !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um CNPJ válido no formato 00.000.000/0000-00."
      );
      campoValido = false;
      EstiloUtils.alterarCorBorda(
        campo.closest(".card-session"),
        "var(--erro)"
      );
    }

    if (campoValido) {
      adicionarClasse(campo, "success");
      EstiloUtils.alterarCorBorda(campo.closest(".card-session"), "");
    }

    return campoValido;
  }

  // Aplica formatação ao valor do campo com base em uma regex e função de formatação
  function formatarCampo(input, regex, formato) {
    let value = input.value.replace(/\D/g, "");
    input.value = regex.test(value) ? formato(value) : value;
    validarCampo(input);
  }

  // Valida os campos de nome (nome_contato e nome_fantasia) de forma condicional
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
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
  };
})();

// Módulo de Manipulação de Sessões
const SessaoUtils = (() => {
  // Alterna a visibilidade de um elemento com base na condição
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

  // Valida todos os campos obrigatórios e acumula os nomes dos que estão com erro
  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];

    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    const campoIndicacao = document.getElementById("indicacao");
    if (!CampoUtils.validarCampo(campoIndicacao)) {
      formValido = false;
      camposNaoPreenchidos.push("Indicação");
    }

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

  // Envia o formulário se estiver válido, senão previne o envio
  function enviarFormulario(event) {
    if (feedbackDiv) {
      feedbackDiv.remove();
    }

    if (validarFormulario()) {
      mostrarFeedback("success", "Formulário validado com sucesso!");
    } else {
      event.preventDefault();
      mostrarFeedback(
        "error",
        "O formulário contém erros. Corrija e tente novamente."
      );
    }
  }

  // Exibe uma mensagem de feedback (sucesso ou erro)
  function mostrarFeedback(tipo, mensagem) {
    if (feedbackDiv) {
      feedbackDiv.remove();
    }

    feedbackDiv = criarFeedbackDiv(mensagem, `message-${tipo}`);
    document.body.appendChild(feedbackDiv);
    feedbackDiv.classList.add("show");
    removerFeedbackDivAposTempo(feedbackDiv);
  }

  // Cria a div de feedback com a mensagem
  function criarFeedbackDiv(mensagem, classe) {
    const div = document.createElement("div");
    div.classList.add(classe);
    div.innerText = mensagem;
    return div;
  }

  // Remove a div de feedback após um tempo determinado (default 5000ms)
  function removerFeedbackDivAposTempo(div, tempo = 5000) {
    setTimeout(() => {
      div.classList.add("fade-out");
      div.addEventListener("transitionend", () => {
        div.remove();
        feedbackDiv = null;
      });
    }, tempo);
  }

  return {
    enviarFormulario,
    mostrarFeedback, // Exportado para uso na validação de indicação
  };
})();

// Função para validar o campo de indicação
function validarCampoIndicacao() {
  const campoIndicacao = document.getElementById("indicacao");
  const valorCampo = campoIndicacao.value.trim();

  // Se estiver vazio, retorna válido, pois não é obrigatório
  if (valorCampo === "") {
    return true;
  }

  // Verifica se o valor corresponde à indicação válida (variável global "selectedSuggestionNameRefPoli")
  if (valorCampo !== selectedSuggestionNameRefPoli) {
    CampoUtils.exibirMensagemErroCampo(
      campoIndicacao,
      "Por favor, selecione uma indicação válida."
    );
    return false;
  }

  return true;
}

// Função de envio do formulário com validação de indicação
function enviarFormulario(event) {
  if (!validarCampoIndicacao()) {
    event.preventDefault();
    FormularioUtils.mostrarFeedback("error", "Selecione uma indicação válida.");
    return;
  }
  FormularioUtils.enviarFormulario(event);
}

// Adiciona os ouvintes de eventos
document.getElementById("form").addEventListener("submit", enviarFormulario);
document
  .getElementById("comissionado")
  .addEventListener("change", SessaoUtils.toggleComissionadoFields);
document
  .getElementById("nome_contato")
  .addEventListener("input", CampoUtils.validarNomesObrigatorios);
document
  .getElementById("nome_fantasia")
  .addEventListener("input", CampoUtils.validarNomesObrigatorios);

// Função auxiliar para formatar telefone
function formatarTelefone(input, regex, formato) {
  CampoUtils.formatarCampo(input, regex, formato);
}

// Máscara para telefone principal
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

// Máscara para telefone adicional
document
  .getElementById("telefoneAdicional")
  .addEventListener("blur", function () {
    formatarTelefone(
      this,
      /^\d{10}$/,
      (value) => `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
    );
  });

// Máscara para CEP (formata 8 dígitos para 00000-000)
document.getElementById("cep").addEventListener("blur", function () {
  CampoUtils.formatarCampo(
    this,
    /^\d{8}$/,
    (value) => `${value.slice(0, 5)}-${value.slice(5)}`
  );
});

// Máscara para CPF
document.getElementById("cpf")?.addEventListener("blur", function () {
  CampoUtils.formatarCampo(
    this,
    /^\d{11}$/,
    (value) =>
      `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(
        6,
        9
      )}-${value.slice(9)}`
  );
});

// Máscara para CNPJ
document.getElementById("cnpj")?.addEventListener("blur", function () {
  CampoUtils.formatarCampo(
    this,
    /^\d{14}$/,
    (value) =>
      `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
        5,
        8
      )}/${value.slice(8, 12)}-${value.slice(12)}`
  );
});

document
  .getElementById("whatsapp_switch")
  .addEventListener("change", SessaoUtils.mostrarCampoWhatsapp);
document
  .getElementById("estado_civil")
  .addEventListener("change", SessaoUtils.mostrarCamposConjuge);

// Adiciona ouvintes para validação em eventos de keydown, blur, input e change
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
