// Módulo de Manipulação de Campos
const CampoUtils = (() => {
  function validarCampo(campo) {
    const valorCampo = campo.value.trim();
    let campoValido = true;

    campo.classList.remove("error", "success");

    const label = document.querySelector(`label[for="${campo.id}"]`);
    const span = label ? label.querySelector("span") : null;

    if (span) {
      span.classList.remove("error", "success");
    }

    if (campo.hasAttribute("required") && valorCampo === "") {
      campo.classList.add("error");
      if (span) span.classList.add("error");
      campoValido = false;
    } else if (
      campo.type === "email" &&
      valorCampo !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCampo)
    ) {
      campo.classList.add("error");
      if (span) span.classList.add("error");
      campoValido = false;
    } else if (
      campo.type === "tel" &&
      valorCampo !== "" &&
      !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valorCampo)
    ) {
      campo.classList.add("error");
      if (span) span.classList.add("error");
      campoValido = false;
    } else if (valorCampo !== "" || campo.hasAttribute("required")) {
      campo.classList.add("success");
      if (span) span.classList.add("success");
    }

    return campoValido;
  }

  function formatarCampo(input, regex, formato) {
    let value = input.value.replace(/\D/g, "");
    input.value = regex.test(value) ? formato(value) : value;
    validarCampo(input);
  }

  function validarNomesObrigatorios() {
    const nomeContato = document.getElementById("nome_contato");
    const nomeFantasia = document.getElementById("nome_fantasia");

    const nomeContatoPreenchido = nomeContato.value.trim() !== "";
    const nomeFantasiaPreenchido = nomeFantasia.value.trim() !== "";

    nomeContato.required = !nomeContatoPreenchido;
    nomeFantasia.required = !nomeFantasiaPreenchido;

    validarCampo(nomeContato);
    validarCampo(nomeFantasia);

    if (nomeContatoPreenchido || nomeFantasiaPreenchido) {
      nomeContato.classList.add("success");
      nomeFantasia.classList.add("success");

      const labelNomeContato = document.querySelector(
        'label[for="nome_contato"] span'
      );
      const labelNomeFantasia = document.querySelector(
        'label[for="nome_fantasia"] span'
      );

      if (labelNomeContato) labelNomeContato.classList.add("success");
      if (labelNomeFantasia) labelNomeFantasia.classList.add("success");
    }
  }

  return {
    validarCampo,
    formatarCampo,
    validarNomesObrigatorios,
  };
})();

// Módulo de Manipulação de Sessões
const SessaoUtils = (() => {
  function toggleComissionadoFields() {
    const comissionadoFields = document.getElementById("comissionado-fields");
    comissionadoFields.classList.toggle(
      "hiddenCc",
      !document.getElementById("comissionado").checked
    );
  }

  function mostrarCampoWhatsapp() {
    const checkbox = document.getElementById("whatsapp_switch");
    const campoWhatsapp = document.getElementById("campoWhatsapp");
    const telefonePrincipalInput = document.getElementById("telefonePrincipal");
    const whatsappInput = document.getElementById("whatsapp");

    campoWhatsapp.style.display = checkbox.checked ? "none" : "block";
    whatsappInput.value = checkbox.checked ? telefonePrincipalInput.value : "";
    CampoUtils.validarCampo(whatsappInput);
  }

  function mostrarCamposConjuge() {
    const estadoCivil = document.getElementById("estado_civil").value;
    const camposConjuge = document.getElementById("camposConjuge");

    camposConjuge.style.display =
      estadoCivil === "Casado(a)" || estadoCivil === "União Estável"
        ? "block"
        : "none";
  }

  return {
    toggleComissionadoFields,
    mostrarCampoWhatsapp,
    mostrarCamposConjuge,
  };
})();

// Módulo de Manipulação do Formulário
const FormularioUtils = (() => {
  function validarFormulario() {
    let formValido = true;
    const camposNaoPreenchidos = [];

    // Valida campos que têm a flag "required"
    const camposRequeridos = document.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    CampoUtils.validarNomesObrigatorios();

    camposRequeridos.forEach((campo) => {
      if (!CampoUtils.validarCampo(campo)) {
        formValido = false;
        // Aqui, estamos adicionando o nome do campo ao array de campos não preenchidos
        const label = document.querySelector(`label[for="${campo.id}"]`);
        const campoNome = label
          ? label.innerText.replace("*", "").trim()
          : campo.id;
        camposNaoPreenchidos.push(campoNome);
      }
    });

    if (!formValido) {
      mostrarFeedbackErro(camposNaoPreenchidos); // Passa a lista de campos não preenchidos
    }

    return formValido;
  }

  function enviarFormulario(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const form = document.getElementById("form");
    const formData = new FormData(form);

    fetch("/process_form", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Erro ao enviar o formulário");
      })
      .then((data) => {
        console.log(data);
        mostrarFeedbackSucesso();
        form.reset();
        removerClassesDeSucesso();
      })
      .catch((error) => {
        console.error("Erro:", error);
        mostrarFeedbackErro();
      });
  }

  function mostrarFeedbackSucesso() {
    const feedbackDiv = criarFeedbackDiv(
      "Formulário enviado com sucesso!",
      "message-success"
    );
    document.body.appendChild(feedbackDiv);
    feedbackDiv.classList.add("show");
    removerFeedbackDivAposTempo(feedbackDiv);
  }

  function mostrarFeedbackErro(camposNaoPreenchidos = []) {
    const mensagemErro = camposNaoPreenchidos.length
      ? `Preencha os campos obrigatórios: ${camposNaoPreenchidos.join(", ")}`
      : "Ocorreu um erro ao enviar o formulário. Tente novamente.";

    const feedbackDiv = criarFeedbackDiv(mensagemErro, "message-error");
    document.body.appendChild(feedbackDiv);
    feedbackDiv.classList.add("show");
    removerFeedbackDivAposTempo(feedbackDiv);
  }

  function criarFeedbackDiv(mensagem, classe) {
    const feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add(classe);
    feedbackDiv.innerText = mensagem;
    return feedbackDiv;
  }

  function removerFeedbackDivAposTempo(feedbackDiv, tempo = 5000) {
    setTimeout(() => {
      feedbackDiv.classList.add("fade-out");
      feedbackDiv.addEventListener("transitionend", () => feedbackDiv.remove());
    }, tempo);
  }

  function removerClassesDeSucesso() {
    const camposSucesso = document.querySelectorAll(".success");
    camposSucesso.forEach((campo) => campo.classList.remove("success"));
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
document
  .getElementById("telefoneAdicional")
  .addEventListener("blur", function () {
    CampoUtils.formatarCampo(
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

// Evitar o envio do formulário ao pressionar Enter
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
