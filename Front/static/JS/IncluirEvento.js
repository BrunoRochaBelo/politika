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
  // Retorna o label associado ao campo.
  function obterLabelAssociado(campo) {
    let label;
    if (campo.type === "radio") {
      // Para campos de rádio, busca o label dentro do mesmo container.
      const campoDiv = campo.closest(".campo");
      label = campoDiv ? campoDiv.querySelector("label") : null;
    } else {
      label = document.querySelector(`label[for="${campo.id}"]`);
    }
    return label;
  }

  // Adiciona uma classe ao campo, seu label e span (se existir).
  function adicionarClasse(campo, classe) {
    campo.classList.add(classe);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.add(classe);
      const span = label.querySelector("span");
      if (span) span.classList.add(classe);
    }
  }

  // Remove as classes especificadas do campo, seu label e span.
  function removerClasses(campo, ...classes) {
    campo.classList.remove(...classes);
    const label = obterLabelAssociado(campo);
    if (label) {
      label.classList.remove(...classes);
      const span = label.querySelector("span");
      if (span) span.classList.remove(...classes);
    }
  }

  // Exibe a mensagem de erro logo abaixo do campo e altera a cor da borda.
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

  // Remove a mensagem de erro e reseta a borda.
  function removerMensagemErroCampo(campo) {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  }

  // Retorna o nome do campo a partir do label associado (sem o asterisco).
  function obterNomeCampo(campo) {
    const label = obterLabelAssociado(campo);
    if (label) {
      const labelClone = label.cloneNode(true);
      const span = labelClone.querySelector("span");
      if (span) span.remove();
      return labelClone.innerText.trim();
    }
    return campo.name || campo.id;
  }

  // Valida o campo conforme seu tipo e atributos.
  function validarCampo(campo) {
    // Remove mensagens e classes anteriores.
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    let campoValido = true;

    if (campo.type === "radio") {
      // Para grupos de rádio, verifica se algum está selecionado.
      const radios = document.getElementsByName(campo.name);
      const algumSelecionado = Array.from(radios).some(
        (radio) => radio.checked
      );
      if (campo.hasAttribute("required") && !algumSelecionado) {
        exibirMensagemErroCampo(
          campo.closest(".campo"),
          "Selecione uma opção."
        );
        campoValido = false;
      } else {
        adicionarClasse(campo, "success");
      }
    } else {
      const valorCampo = campo.value.trim();

      if (campo.hasAttribute("required") && valorCampo === "") {
        exibirMensagemErroCampo(campo, "Este campo é obrigatório.");
        campoValido = false;
      }
      // Validação específica para CEP
      else if (campo.id === "cep" && valorCampo !== "") {
        if (!/^\d{5}-\d{3}$/.test(valorCampo)) {
          exibirMensagemErroCampo(
            campo,
            "Digite um CEP válido no formato 00000-000."
          );
          campoValido = false;
        } else {
          adicionarClasse(campo, "success");
        }
      }
      // Validação para data
      else if (campo.type === "date" && valorCampo !== "") {
        const data = new Date(valorCampo);
        if (isNaN(data.getTime())) {
          exibirMensagemErroCampo(campo, "Digite uma data válida.");
          campoValido = false;
        } else {
          adicionarClasse(campo, "success");
        }
      }
      // Validação para hora
      else if (campo.type === "time" && valorCampo !== "") {
        const horaRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
        if (!horaRegex.test(valorCampo)) {
          exibirMensagemErroCampo(campo, "Digite uma hora válida (HH:MM).");
          campoValido = false;
        } else {
          adicionarClasse(campo, "success");
        }
      }
      // Validação para select obrigatório
      else if (
        campo.tagName.toLowerCase() === "select" &&
        campo.hasAttribute("required") &&
        (valorCampo === "" || valorCampo === null)
      ) {
        exibirMensagemErroCampo(campo, "Selecione uma opção.");
        campoValido = false;
      } else if (valorCampo !== "" || campo.hasAttribute("required")) {
        adicionarClasse(campo, "success");
      }
    }

    return campoValido;
  }

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
    obterNomeCampo,
  };
})();

// Módulo de Manipulação do Formulário
window.FormularioEventoUtils = (() => {
  let feedbackDiv = null;

  // Valida todos os campos obrigatórios do formulário de Evento.
  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];
    const camposRequeridos = document.querySelectorAll(
      "#formEvento input[required], #formEvento select[required], #formEvento textarea[required]"
    );
    const radioGroupsChecked = new Set();

    camposRequeridos.forEach((campo) => {
      if (campo.type === "radio") {
        if (radioGroupsChecked.has(campo.name)) return;
        radioGroupsChecked.add(campo.name);
        if (!CampoUtils.validarCampo(campo)) {
          formValido = false;
          const campoNome = CampoUtils.obterNomeCampo(campo);
          if (!camposNaoPreenchidos.includes(campoNome)) {
            camposNaoPreenchidos.push(campoNome);
          }
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
      mostrarFeedbackErro(camposNaoPreenchidos);
    }

    return formValido;
  }

  // Função de envio: valida o formulário e, se válido, envia; senão, exibe feedback.
  function enviarFormulario(event) {
    event.preventDefault();
    if (feedbackDiv) feedbackDiv.remove();

    if (!validarFormulario()) return;

    mostrarFeedbackSucesso();
    document.getElementById("formEvento").reset();
    removerClassesDeSucesso();
  }

  function mostrarFeedbackSucesso() {
    mostrarFeedback("success", "Formulário validado com sucesso!");
  }

  function mostrarFeedbackErro(camposNaoPreenchidos) {
    const mensagem = `Preencha os campos obrigatórios: ${camposNaoPreenchidos.join(
      ", "
    )}`;
    mostrarFeedback("error", mensagem);
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
    document.querySelectorAll("#formEvento .success").forEach((campo) => {
      campo.classList.remove("success");
    });
  }

  return {
    enviarFormulario,
  };
})();

// Adiciona os ouvintes de eventos para o formulário de Evento.
document
  .getElementById("formEvento")
  .addEventListener("submit", FormularioEventoUtils.enviarFormulario);

// Adiciona os ouvintes para validação em campo (blur e input) dos campos do formulário de Evento.
document
  .querySelectorAll(
    "#formEvento input, #formEvento select, #formEvento textarea"
  )
  .forEach((campo) => {
    campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
    campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
  });

// Evento para máscara e formatação do CEP
document.getElementById("cep")?.addEventListener("blur", function () {
  let cep = this.value.replace(/\D/g, "");
  if (cep.length === 8) {
    this.value = `${cep.slice(0, 5)}-${cep.slice(5)}`;
  }
  // Após a formatação, valida o campo CEP.
  CampoUtils.validarCampo(this);
});
