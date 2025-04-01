// Módulo de Manipulação de Estilos
window.EstiloUtils = (() => {
  function alterarCorBorda(elemento, cor) {
    if (elemento) {
      elemento.style.borderColor = cor;
    }
  }
  return { alterarCorBorda };
})();

// Módulo de Manipulação de Campos
window.CampoUtils = (() => {
  // Busca o span associado ao label do campo (caso exista)
  function obterSpanAssociado(campo) {
    const label = document.querySelector(`label[for="${campo.id}"]`);
    return label ? label.querySelector("span") : null;
  }

  // Adiciona uma classe ao campo e ao span associado
  function adicionarClasse(campo, classe) {
    campo.classList.add(classe);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.add(classe);
  }

  // Remove as classes especificadas do campo e do span associado
  function removerClasses(campo, ...classes) {
    campo.classList.remove(...classes);
    const span = obterSpanAssociado(campo);
    if (span) span.classList.remove(...classes);
  }

  // Exibe uma mensagem de erro logo abaixo do campo
  function exibirMensagemErroCampo(campo, mensagem) {
    let mensagemErro = campo.nextElementSibling;
    if (!mensagemErro || !mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro = document.createElement("div");
      mensagemErro.classList.add("mensagem-erro");
      campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
    }
    mensagemErro.textContent = mensagem;
    mensagemErro.style.color = "var(--erro)";
    mensagemErro.style.marginTop = "8px";
    mensagemErro.style.marginLeft = "15px";
    adicionarClasse(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "var(--erro)");
  }

  // Remove a mensagem de erro associada ao campo e reseta a borda
  function removerMensagemErroCampo(campo) {
    const mensagemErro = campo.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains("mensagem-erro")) {
      mensagemErro.remove();
    }
    removerClasses(campo, "error");
    EstiloUtils.alterarCorBorda(campo, "");
  }

  // Valida o campo de acordo com seus atributos e formatos específicos
  function validarCampo(campo) {
    // Remove mensagens e classes anteriores
    removerMensagemErroCampo(campo);
    removerClasses(campo, "error", "success");

    const valorCampo = campo.value.trim();
    let campoValido = true;

    // Verifica obrigatoriedade
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
    // Validação para select obrigatório
    else if (
      campo.tagName.toLowerCase() === "select" &&
      campo.hasAttribute("required") &&
      valorCampo === ""
    ) {
      exibirMensagemErroCampo(campo, "Selecione uma opção.");
      campoValido = false;
    }
    // Para os demais campos, se não estiver vazio, marca como sucesso
    else if (valorCampo !== "" || campo.hasAttribute("required")) {
      adicionarClasse(campo, "success");
    }

    return campoValido;
  }

  return {
    validarCampo,
    exibirMensagemErroCampo,
    removerMensagemErroCampo,
  };
})();

// Módulo de Manipulação do Formulário (sem envio via fetch)
window.FormularioUtils = (() => {
  // Valida todos os campos obrigatórios do formulário
  function validarFormulario() {
    let formValido = true;
    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    camposRequeridos.forEach((campo) => {
      if (!CampoUtils.validarCampo(campo)) {
        formValido = false;
      }
    });

    return formValido;
  }

  // Função de envio do formulário: valida e envia se tudo estiver ok
  function enviarFormulario(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      console.log("Por favor, preencha os campos obrigatórios corretamente.");
      return;
    }

    console.log("Formulário validado com sucesso!");
    event.target.submit();
  }

  return { enviarFormulario };
})();

// Adiciona os ouvintes de eventos para o envio do formulário
document
  .getElementById("form")
  .addEventListener("submit", FormularioUtils.enviarFormulario);

// Adiciona ouvintes para validação imediata de cada campo (em eventos de blur e input)
document.querySelectorAll("input, select, textarea").forEach((campo) => {
  campo.addEventListener("blur", () => CampoUtils.validarCampo(campo));
  campo.addEventListener("input", () => CampoUtils.validarCampo(campo));
});

// FUNÇÃO PARA APLICAR MÁSCARA DE CEP DE FORMA DINÂMICA
function aplicarMascaraCEP(input) {
  let digits = input.value.replace(/\D/g, "");
  if (digits.length > 5) {
    input.value = digits.substring(0, 5) + "-" + digits.substring(5, 8);
  } else {
    input.value = digits;
  }
  // Valida o campo CEP após a formatação
  CampoUtils.validarCampo(input);
}

// Evento para máscara e formatação do CEP utilizando o evento "input"
const campoCEP = document.getElementById("cep");
if (campoCEP) {
  campoCEP.addEventListener("input", function () {
    aplicarMascaraCEP(this);
  });
}
