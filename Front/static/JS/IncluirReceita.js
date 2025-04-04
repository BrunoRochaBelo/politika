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
// Módulo de Máscaras
// ===============================
window.MascaraUtils = (() => {
  // Máscara para CPF: 000.000.000-00
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

  // Máscara para CNPJ: 00.000.000/0000-00
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

  // Detecta automaticamente se é CPF ou CNPJ e aplica a máscara correspondente
  const aplicarMascaraCPFCNPJ = (input) => {
    let digits = input.value.replace(/\D/g, "");
    // Se tem mais de 11 dígitos, trata como CNPJ
    if (digits.length > 11) {
      aplicarMascaraCNPJ(input);
    } else {
      aplicarMascaraCPF(input);
    }
  };

  // Máscara para valores monetários
  const aplicarMascaraValor = (input) => {
    let value = input.value.replace(/\D/g, "");
    value = (parseInt(value) / 100).toFixed(2) + "";
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = "R$ " + value;
  };

  // Máscara para ano (4 dígitos)
  const aplicarMascaraAno = (input) => {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    input.value = value;
  };

  return {
    aplicarMascaraCPF,
    aplicarMascaraCNPJ,
    aplicarMascaraCPFCNPJ,
    aplicarMascaraValor,
    aplicarMascaraAno,
  };
})();

// ===============================
// Módulo de Validações
// ===============================
window.ValidacaoUtils = (() => {
  // Validação de CPF (pode ser aprimorada se necessário)
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf === "" || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
      return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  // Validação de CNPJ (pode ser aprimorada se necessário)
  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj === "" || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj))
      return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  };

  // Validação de CPF ou CNPJ (detecta automaticamente)
  const validarCPFCNPJ = (valor) => {
    const digitsOnly = valor.replace(/\D/g, "");
    if (digitsOnly.length === 11) {
      return validarCPF(digitsOnly);
    } else if (digitsOnly.length === 14) {
      return validarCNPJ(digitsOnly);
    }
    return false;
  };

  // Validação de data (verifica se a data não é futura)
  const validarDataNaoFutura = (data) => {
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    const dataInformada = new Date(data);
    return dataInformada <= dataAtual;
  };

  // Validação de ano eleitoral (entre 1990 e o próximo ano)
  const validarAnoEleitoral = (ano) => {
    const anoAtual = new Date().getFullYear();
    const anoNum = parseInt(ano);
    return !isNaN(anoNum) && anoNum >= 1990 && anoNum <= anoAtual + 1;
  };

  return {
    validarCPF,
    validarCNPJ,
    validarCPFCNPJ,
    validarDataNaoFutura,
    validarAnoEleitoral,
  };
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
      } else if (
        campo.id === "dataCredito" &&
        !ValidacaoUtils.validarDataNaoFutura(valorCampo)
      ) {
        exibirMensagemErroCampo(campo, "A data não pode ser futura.");
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
    // Validação de ano eleitoral
    else if (
      campo.id === "anoEleitoral" &&
      valorCampo !== "" &&
      !ValidacaoUtils.validarAnoEleitoral(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um ano eleitoral válido (entre 1990 e o próximo ano)."
      );
      campoValido = false;
    }
    // Validação de CPF/CNPJ usando a lógica original (máscara e formato)
    else if (campo.id === "cpfCnpjCredor" && valorCampo !== "") {
      const valorLimpo = valorCampo.replace(/\D/g, "");
      if (valorLimpo.length === 11) {
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valorCampo)) {
          exibirMensagemErroCampo(
            campo,
            "Digite um CPF válido no formato 000.000.000-00."
          );
          campoValido = false;
        } else {
          adicionarClasse(campo, "success");
        }
      } else if (valorLimpo.length === 14) {
        if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(valorCampo)) {
          exibirMensagemErroCampo(
            campo,
            "Digite um CNPJ válido no formato 00.000.000/0000-00."
          );
          campoValido = false;
        } else {
          adicionarClasse(campo, "success");
        }
      } else {
        exibirMensagemErroCampo(campo, "Digite um CPF ou CNPJ válido.");
        campoValido = false;
      }
    }
    // Validação de valor monetário
    else if (
      campo.id === "valorReceita" &&
      valorCampo !== "" &&
      parseFloat(valorCampo) <= 0
    ) {
      exibirMensagemErroCampo(campo, "O valor deve ser maior que zero.");
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
    // Previna o envio para validar os campos
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

    // Se a validação for bem-sucedida, envia o formulário programaticamente
    mostrarFeedback("success", "Enviando formulário...");

    setTimeout(() => {
      event.target.submit();
    }, 10);
  };

  // Exibe mensagens de alerta (Bootstrap-like)
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

    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      if (alertDiv) {
        alertDiv.classList.remove("show");
        alertDiv.classList.add("fade");
        alertDiv.addEventListener("transitionend", () => alertDiv.remove());
      }
    }, 5000);
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
  const alertContainer = document.querySelector(".alert-container");
  if (alertContainer) alertContainer.innerHTML = "";
  if (!window.FormularioUtils.validarFormulario()) {
    const primeiroCampoInvalido = document.querySelector("#form .error");
    if (primeiroCampoInvalido) {
      setTimeout(() => primeiroCampoInvalido.focus(), 500);
    }
    return false;
  }
  window.FormularioUtils.mostrarFeedback(
    "success",
    "Formulário enviado com sucesso!"
  );
  return true;
};

// ===================================
// Configuração Inicial e Event Listeners
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  // Configuração dos listeners de eventos para os campos
  document.querySelectorAll("input, select, textarea").forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  });

  // Listener de evento para o formulário
  document
    .getElementById("form")
    .addEventListener("submit", window.FormularioUtils.enviarFormulario);

  // Configuração de máscaras para campos específicos
  const cpfCnpjCredor = document.getElementById("cpfCnpjCredor");
  if (cpfCnpjCredor) {
    cpfCnpjCredor.addEventListener("input", function () {
      MascaraUtils.aplicarMascaraCPFCNPJ(this);
    });
  }

  const anoEleitoral = document.getElementById("anoEleitoral");
  if (anoEleitoral) {
    // Limita o campo a aceitar apenas números e aplica máscara de ano
    anoEleitoral.addEventListener("input", function () {
      MascaraUtils.aplicarMascaraAno(this);
    });
    anoEleitoral.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    });
  }

  // Configuração do valor monetário para usar o formato correto
  const valorReceita = document.getElementById("valorReceita");
  if (valorReceita) {
    // Formata o valor ao perder o foco
    valorReceita.addEventListener("blur", function () {
      if (this.value.trim() !== "") {
        const valor = parseFloat(
          this.value.replace(/[^\d.,]/g, "").replace(",", ".")
        );
        if (!isNaN(valor)) {
          this.value = valor.toFixed(2);
        }
      }
    });
    // Impede a digitação de caracteres não numéricos (exceto ponto e vírgula)
    valorReceita.addEventListener("keypress", function (e) {
      const char = String.fromCharCode(e.keyCode);
      if (!/[\d.,]/.test(char)) {
        e.preventDefault();
      }
    });
  }
});
