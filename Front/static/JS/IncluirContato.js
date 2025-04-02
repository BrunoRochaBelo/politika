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
  const alterarCorAsterisco = (campoId, cor) => {
    const labelSpan = document.querySelector(`label[for="${campoId}"] span`);
    if (labelSpan) {
      labelSpan.style.color = cor;
    }
  };

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
    // Validação de CPF
    else if (
      campo.id === "cpf" &&
      valorCampo !== "" &&
      !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valorCampo)
    ) {
      exibirMensagemErroCampo(
        campo,
        "Digite um CPF válido no formato 000.000.000-00."
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
    else if (valorCampo !== "") {
      adicionarClasse(campo, "success");
    }

    return campoValido;
  };

  // Validar os campos nome_contato e nome_fantasia (lógica do código 2)
  const validarNomesObrigatorios = () => {
    const campos = ["nome_contato", "nome_fantasia"].map((id) =>
      document.getElementById(id)
    );

    const algumCampoPreenchido = campos.some(
      (campo) => campo.value.trim() !== ""
    );

    campos.forEach((campo) => {
      // Se algum campo estiver preenchido, nenhum é obrigatório
      // Se nenhum estiver preenchido, ambos são obrigatórios
      campo.required = !algumCampoPreenchido;
      validarCampo(campo);
    });

    if (algumCampoPreenchido) {
      campos.forEach((campo) => adicionarClasse(campo, "success"));
    }

    return algumCampoPreenchido;
  };

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
    adicionarClasse,
    removerClasses,
    validarNomesObrigatorios,
    alterarCorAsterisco,
  };
})();

// ==================================
// Módulo de Manipulação de Sessões
// ==================================
window.SessaoUtils = (() => {
  // Alterna a visibilidade de um elemento com base na condição
  const toggleElementVisibility = (element, condition) => {
    if (element) {
      element.classList.toggle("hiddenCc", !condition);
    }
  };

  const toggleComissionadoFields = () => {
    const comissionado = document.getElementById("comissionado").checked;
    toggleElementVisibility(
      document.getElementById("comissionado-fields"),
      comissionado
    );
  };

  const mostrarCampoWhatsapp = () => {
    const checkbox = document.getElementById("whatsapp_switch");
    const campoWhatsapp = document.getElementById("campoWhatsapp");
    const telefonePrincipalInput = document.getElementById("telefonePrincipal");
    const whatsappInput = document.getElementById("whatsapp");

    toggleElementVisibility(campoWhatsapp, checkbox.checked);
    whatsappInput.value = checkbox.checked ? telefonePrincipalInput.value : "";
    CampoUtils.validarCampo(whatsappInput);
    CampoUtils.alterarCorAsterisco("whatsapp", checkbox.checked ? "red" : "");
  };

  const mostrarCamposConjuge = () => {
    const estadoCivil = document.getElementById("estado_civil").value;
    toggleElementVisibility(
      document.getElementById("camposConjuge"),
      estadoCivil === "Casado(a)" || estadoCivil === "União Estável"
    );
  };

  return {
    toggleComissionadoFields,
    mostrarCampoWhatsapp,
    mostrarCamposConjuge,
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

  // Nova função para encontrar o primeiro card-session com campo obrigatório não preenchido
  const encontrarPrimeiroCardSessionIncompleto = () => {
    const cardSessions = document.querySelectorAll(".card-session");
    for (const cardSession of cardSessions) {
      const camposObrigatorios = cardSession.querySelectorAll(
        "input[required], select[required], textarea[required]"
      );
      for (const campo of camposObrigatorios) {
        if (!campo.value.trim()) {
          return {
            cardSession: cardSession,
            primeiroCampo: campo,
          };
        }
      }
    }
    return null;
  };

  // Aplicar estilo de erro ao card-session e campo
  const aplicarEstiloErroAoCardSession = (cardSession, campo) => {
    if (!cardSession || !campo) return;

    // Aplica estilo de erro ao campo
    CampoUtils.validarCampo(campo);

    // Aplica estilo de erro explicitamente ao card-session
    EstiloUtils.alterarCorBorda(cardSession, "var(--erro)");

    // Marca o cardSession com uma classe para identificar que contém erro
    cardSession.classList.add("has-error");
  };

  // Navegar para a seção incompleta sem fechar o card-session se já estiver aberto
  const navegarParaSecaoIncompleta = (secaoIncompleta) => {
    if (secaoIncompleta === -1) return;

    const selectedSession = document.getElementById(`secao${secaoIncompleta}`);
    if (!selectedSession) return;

    const cards = document.querySelectorAll(".card-session");
    const selectedCard = cards[secaoIncompleta - 1];

    // Encontrar o primeiro card-session com erro
    const resultado = encontrarPrimeiroCardSessionIncompleto();

    // Se a seção já estiver ativa, não chamamos changeSession
    if (selectedSession.classList.contains("active")) {
      // Garante que o card-session que contém o primeiro campo incompleto esteja aberto
      if (resultado) {
        const { cardSession, primeiroCampo } = resultado;
        if (!cardSession.classList.contains("active")) {
          cardSession.classList.add("active");
          const header = cardSession.querySelector(
            ".secao-interna-template-header"
          );
          const arrow = header.querySelector(".arrow");
          header.classList.add("active-header");
          arrow.classList.remove("down");
          arrow.classList.add("up");
        }

        // Aplica estilo de erro imediatamente
        aplicarEstiloErroAoCardSession(cardSession, primeiroCampo);
      }
      return;
    }

    // Se a seção não estiver ativa, chamamos changeSession para ativá-la
    changeSession(secaoIncompleta);

    // Depois de mudar para a seção, garante que o card-session esteja aberto
    setTimeout(() => {
      const resultadoAtualizado = encontrarPrimeiroCardSessionIncompleto();
      if (resultadoAtualizado) {
        const { cardSession, primeiroCampo } = resultadoAtualizado;
        if (!cardSession.classList.contains("active")) {
          cardSession.classList.add("active");
          const header = cardSession.querySelector(
            ".secao-interna-template-header"
          );
          const arrow = header.querySelector(".arrow");
          header.classList.add("active-header");
          arrow.classList.remove("down");
          arrow.classList.add("up");
        }

        // Aplica estilo de erro imediatamente
        aplicarEstiloErroAoCardSession(cardSession, primeiroCampo);
      }
    }, 100);
  };

  // Valida todos os campos do formulário
  const validarFormulario = () => {
    let formValido = true;
    const camposNaoPreenchidos = [];

    // Validar campos nome_contato e nome_fantasia juntos
    CampoUtils.validarNomesObrigatorios();

    // Validar campo de indicação
    const campoIndicacao = document.getElementById("indicacao");
    if (campoIndicacao && !validarCampoIndicacao()) {
      formValido = false;
      camposNaoPreenchidos.push("Indicação");
    }

    // Validar todos os campos obrigatórios
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

      // Usa a nova função para navegar para a seção com erro
      navegarParaSecaoIncompleta(secaoIncompleta);

      if (secaoIncompleta !== -1) {
        const secao = document.querySelector(`#secao${secaoIncompleta}`);
        const primeiroCampoIncompleto = secao.querySelector(
          "input[required]:not(:valid), select[required]:not(:valid), textarea[required]:not(:valid)"
        );
        if (primeiroCampoIncompleto) {
          // Garante que o card-session que contém o campo permaneça aberto
          const cardSession = primeiroCampoIncompleto.closest(".card-session");
          if (cardSession) {
            if (!cardSession.classList.contains("active")) {
              cardSession.classList.add("active");
              const header = cardSession.querySelector(
                ".secao-interna-template-header"
              );
              const arrow = header.querySelector(".arrow");
              header.classList.add("active-header");
              arrow.classList.remove("down");
              arrow.classList.add("up");
            }

            // Aplica estilo de erro explicitamente
            aplicarEstiloErroAoCardSession(
              cardSession,
              primeiroCampoIncompleto
            );
          }

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
    navegarParaSecaoIncompleta,
    encontrarPrimeiroCardSessionIncompleto,
    aplicarEstiloErroAoCardSession,
  };
})();

// ==========================
// Funções para Validação de Indicação
// ==========================
const validarCampoIndicacao = () => {
  const campoIndicacao = document.getElementById("indicacao");
  if (!campoIndicacao) return true;

  const valorCampo = campoIndicacao.value.trim();

  // Se estiver vazio, retorna válido, pois não é obrigatório
  if (valorCampo === "") {
    return true;
  }

  // Verifica se o valor corresponde à indicação válida (variável global "selectedSuggestionNameRefPoli")
  if (
    typeof selectedSuggestionNameRefPoli !== "undefined" &&
    valorCampo !== selectedSuggestionNameRefPoli
  ) {
    CampoUtils.exibirMensagemErroCampo(
      campoIndicacao,
      "Por favor, selecione uma indicação válida."
    );
    return false;
  }

  return true;
};

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

  if (!validarCampoIndicacao()) {
    window.FormularioUtils.mostrarFeedback(
      "error",
      "Selecione uma indicação válida."
    );
    return false;
  }

  if (!window.FormularioUtils.validarFormulario()) {
    const secaoIncompleta =
      window.FormularioUtils.encontrarPrimeiraSecaoIncompleta();

    // Usa a nova função para navegar para a seção com erro
    window.FormularioUtils.navegarParaSecaoIncompleta(secaoIncompleta);

    if (secaoIncompleta !== -1) {
      const secao = document.querySelector(`#secao${secaoIncompleta}`);
      const primeiroCampoIncompleto = secao.querySelector(
        "input[required]:not(:valid), select[required]:not(:valid), textarea[required]:not(:valid)"
      );
      if (primeiroCampoIncompleto) {
        const cardSession = primeiroCampoIncompleto.closest(".card-session");
        if (cardSession) {
          if (!cardSession.classList.contains("active")) {
            cardSession.classList.add("active");
            const header = cardSession.querySelector(
              ".secao-interna-template-header"
            );
            const arrow = header.querySelector(".arrow");
            header.classList.add("active-header");
            arrow.classList.remove("down");
            arrow.classList.add("up");
          }

          // Aplica estilo de erro explicitamente
          window.FormularioUtils.aplicarEstiloErroAoCardSession(
            cardSession,
            primeiroCampoIncompleto
          );
        }

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
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", window.FormularioUtils.enviarFormulario);
  }

  // Adicionar ouvintes para os campos de nome (lógica do código 2)
  const nomeContato = document.getElementById("nome_contato");
  const nomeFantasia = document.getElementById("nome_fantasia");

  if (nomeContato) {
    nomeContato.addEventListener("input", CampoUtils.validarNomesObrigatorios);
    nomeContato.addEventListener("blur", CampoUtils.validarNomesObrigatorios);
  }

  if (nomeFantasia) {
    nomeFantasia.addEventListener("input", CampoUtils.validarNomesObrigatorios);
    nomeFantasia.addEventListener("blur", CampoUtils.validarNomesObrigatorios);
  }

  // Inputs com máscaras
  const camposCEP = document.getElementById("cep");
  if (camposCEP) {
    camposCEP.addEventListener("input", function () {
      aplicarMascaraCEP(this);
    });
  }

  const camposCNPJ = document.getElementById("cnpj");
  if (camposCNPJ) {
    camposCNPJ.addEventListener("input", function () {
      aplicarMascaraCNPJ(this);
    });
  }

  const telefonePrincipal = document.getElementById("telefonePrincipal");
  if (telefonePrincipal) {
    telefonePrincipal.addEventListener("input", function () {
      aplicarMascaraTelefone(this);
    });
  }

  const telefoneAdicional = document.getElementById("telefoneAdicional");
  if (telefoneAdicional) {
    telefoneAdicional.addEventListener("input", function () {
      aplicarMascaraTelefone(this);
    });
  }

  const cpf = document.getElementById("cpf");
  if (cpf) {
    cpf.addEventListener("input", function () {
      aplicarMascaraCPF(this);
    });
  }

  const whatsapp = document.getElementById("whatsapp");
  if (whatsapp) {
    whatsapp.addEventListener("input", function () {
      aplicarMascaraTelefone(this);
    });
  }

  // Switch de WhatsApp
  const whatsappSwitch = document.getElementById("whatsapp_switch");
  if (whatsappSwitch) {
    whatsappSwitch.addEventListener("change", SessaoUtils.mostrarCampoWhatsapp);
  }

  // Estado Civil para mostrar campos do cônjuge
  const estadoCivil = document.getElementById("estado_civil");
  if (estadoCivil) {
    estadoCivil.addEventListener("change", SessaoUtils.mostrarCamposConjuge);
  }

  // Comissionado toggle
  const comissionado = document.getElementById("comissionado");
  if (comissionado) {
    comissionado.addEventListener(
      "change",
      SessaoUtils.toggleComissionadoFields
    );
  }

  // Validação de todos os campos em blur e input
  document.querySelectorAll("input, select, textarea").forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        CampoUtils.validarCampo(event.target);
      }
    });
  });
});
