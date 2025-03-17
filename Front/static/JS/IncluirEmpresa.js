// IncluirEmpresa.js

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

  // Função para formatar o valor do campo conforme uma regex e uma função de formatação
  function formatarCampo(input, regex, formato) {
    let value = input.value.replace(/\D/g, "");
    input.value = regex.test(value) ? formato(value) : value;
    validarCampo(input);
  }

  function validarCampo(campo) {
    // Remove mensagens e classes de validação anteriores
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    const valorCampo = campo.value.trim();
    let campoValido = true;

    // Validação padrão: obrigatório
    if (campo.hasAttribute("required") && valorCampo === "") {
      exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
      campoValido = false;
    }
    // Validação para e-mail
    else if (
      campo.type === "email" &&
      valorCampo !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(campo, "Digite um e-mail válido.");
      campoValido = false;
    }
    // Validação para telefone
    else if (
      campo.type === "tel" &&
      valorCampo !== "" &&
      !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um telefone válido no formato (XX) XXXX-XXXX."
      );
      campoValido = false;
    }
    // Validação para CNPJ (formato: 00.000.000/0000-00)
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
    // Se preenchido, marca como sucesso
    else if (valorCampo !== "" || campo.hasAttribute("required")) {
      adicionarClasse(campo, "success");
    }

    return campoValido;
  }

  // Validação dos campos de nomes: Razão Social e Nome Fantasia
  function validarNomesObrigatorios() {
    const campos = ["razao_social", "nome_fantasia"].map((id) =>
      document.getElementById(id)
    );
    const algumCampoPreenchido = campos.some(
      (campo) => campo.value.trim() !== ""
    );

    // Se um dos campos for preenchido, ambos não serão mais obrigatórios
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

    // Valida o campo 'bem_servico' separadamente
    if (!CampoUtils.validarCampo(document.getElementById("bem_servico"))) {
      formValido = false;
      camposNaoPreenchidos.push("Bens e Serviços");
    }

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
    if (feedbackDiv) feedbackDiv.remove();

    if (!validarFormulario()) return;

    mostrarFeedback("success", "Formulário validado com sucesso!");
    document.getElementById("form").reset();
    removerClassesDeSucesso();
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

// Adiciona os ouvintes de eventos no formulário
document
  .getElementById("form")
  .addEventListener("submit", FormularioUtils.enviarFormulario);

// Ouvintes para validação dos campos (exceto 'bem_servico')
document.querySelectorAll("input, select, textarea").forEach((campo) => {
  if (campo.id !== "bem_servico") {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  }
});

// Ouvintes para as máscaras:

// Máscara para CEP (formata 8 dígitos para 00000-000)
document.getElementById("cep").addEventListener("blur", function () {
  CampoUtils.formatarCampo(
    this,
    /^\d{8}$/,
    (value) => `${value.slice(0, 5)}-${value.slice(5)}`
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

// Máscara para telefone principal
document
  .getElementById("telefonePrincipal")
  .addEventListener("blur", function () {
    CampoUtils.formatarCampo(
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
    CampoUtils.formatarCampo(
      this,
      /^\d{10}$/,
      (value) => `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
    );
  });

// Adiciona ouvintes para os campos de nomes (Razão Social e Nome Fantasia)
document
  .getElementById("razao_social")
  .addEventListener("input", CampoUtils.validarNomesObrigatorios);
document
  .getElementById("nome_fantasia")
  .addEventListener("input", CampoUtils.validarNomesObrigatorios);

// Ouvintes para máscara de CPF (caso seja utilizado)
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

// Eventos para WhatsApp e demais interações (se existirem)
document
  .getElementById("whatsapp_switch")
  .addEventListener("change", function () {
    const checkbox = this;
    const campoWhatsapp = document.getElementById("campoWhatsapp");
    const telefonePrincipalInput = document.getElementById("telefonePrincipal");
    const whatsappInput = document.getElementById("whatsapp");

    // Exibe ou oculta o campo de WhatsApp conforme o switch
    if (checkbox.checked) {
      campoWhatsapp.classList.remove("hidden");
      whatsappInput.value = telefonePrincipalInput.value;
    } else {
      campoWhatsapp.classList.add("hidden");
      whatsappInput.value = "";
    }
    CampoUtils.validarCampo(whatsappInput);
  });

document
  .getElementById("estado_civil")
  ?.addEventListener("change", function () {
    // Se houver alguma lógica para campos de estado civil (se aplicável)
    // Pode ser adicionada aqui a exibição/ocultação de campos complementares
  });
