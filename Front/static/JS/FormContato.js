// Função para validar um campo específico
function validarCampo(campo) {
  const valorCampo = campo.value.trim();
  let campoValido = true;

  // Remover classes de erro e sucesso antes da validação
  campo.classList.remove("error");
  campo.classList.remove("success");

  // Verificar se o campo é obrigatório e está vazio
  if (campo.hasAttribute("required") && valorCampo === "") {
    campo.classList.add("error");
    campoValido = false;
  } else if (
    campo.type === "email" &&
    valorCampo !== "" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorCampo)
  ) {
    campo.classList.add("error");
    campoValido = false;
  } else if (
    campo.type === "tel" &&
    valorCampo !== "" &&
    !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valorCampo)
  ) {
    campo.classList.add("error");
    campoValido = false;
  } else if (campo.hasAttribute("required")) {
    campo.classList.add("success");
  }

  return campoValido;
}

// Função para validar o formulário
function validarFormulario() {
  let formValido = true;
  let camposNaoPreenchidos = [];

  const camposRequeridos = [
    { id: "tipo_pessoa", mensagem: "Tipo de Pessoa" },
    { id: "nome_contato", mensagem: "Nome do Contato" },
    { id: "celular", mensagem: "Celular" },
    { id: "whatsapp", mensagem: "WhatsApp" },
    { id: "email", mensagem: "E-mail" },
    { id: "telefone", mensagem: "Telefone" },
    { id: "cep", mensagem: "CEP" },
    { id: "uf", mensagem: "UF" },
    { id: "cidade", mensagem: "Cidade" },
    { id: "bairro", mensagem: "Bairro" },
    { id: "perfil_influencia", mensagem: "Perfil de Influência" },
  ];

  camposRequeridos.forEach((campo) => {
    const elementoCampo = document.getElementById(campo.id);

    if (!validarCampo(elementoCampo)) {
      formValido = false;
      camposNaoPreenchidos.push(campo.mensagem);
    }

    // Lógica específica para o campo "perfil_influencia"
    if (campo.id === "perfil_influencia" && formValido) {
      let tipoContatoSelecionado = Array.from(
        document.querySelectorAll("#tipo_contato input[type='checkbox']")
      ).some((checkbox) => checkbox.checked);

      if (!tipoContatoSelecionado) {
        camposNaoPreenchidos.push("Selecione pelo menos um Tipo de Contato");
        formValido = false;
      }
    }
  });

  if (!formValido) {
    alert(
      `Por favor, preencha os seguintes campos obrigatórios:\n${camposNaoPreenchidos.join(
        "\n"
      )}`
    );
  }

  return formValido;
}

// Função para enviar o formulário
function submitForm(event) {
  event.preventDefault();

  // Validar o formulário antes de prosseguir
  if (!validarFormulario()) {
    return false;
  }

  // Selecionar o formulário e seus campos
  const form = document.getElementById("form");
  const inputs = form.querySelectorAll(
    ".campo input, .campo select, .campo textarea"
  );

  // Iterar sobre os campos para adicionar classes de sucesso
  inputs.forEach((input) => {
    if (input.hasAttribute("required") && input.value.trim() !== "") {
      input.classList.remove("error");
      input.classList.add("success");
    }
  });

  // Enviar os dados do formulário via fetch
  const formData = new FormData(form);

  fetch("/process_form", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Faça algo com a resposta do servidor, se necessário
    })
    .catch((error) => {
      console.error("Erro:", error);
    });

  return false;
}

// Função para formatar campos específicos
function formatarCampoParaExibicao(input, regex, formato) {
  let value = input.value.replace(/\D/g, "");
  if (regex.test(value)) {
    input.value = formato(value);
  } else {
    input.value = value;
  }
}

function formatarCelularParaExibicao(input) {
  formatarCampoParaExibicao(
    input,
    /^\d{11}$/,
    (value) =>
      `(${value.slice(0, 2)}) ${value.slice(2, 3)}${value.slice(
        3,
        7
      )}-${value.slice(7)}`
  );
}

function formatarTelefoneParaExibicao(input) {
  formatarCampoParaExibicao(
    input,
    /^\d{10,11}$/,
    (value) => `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
  );
}

function formatarCampoParaBanco(input) {
  input.value = input.value.replace(/\D/g, "");
}

function formatarCEP(input) {
  formatarCampoParaExibicao(
    input,
    /^\d{8}$/,
    (value) => `${value.slice(0, 5)}-${value.slice(5)}`
  );
}

// Função para verificar a tecla "Enter" e evitar o envio do formulário
function checkEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    // Obter o campo atual em foco
    const campoAtual = event.target;

    // Validar o campo atual
    validarCampo(campoAtual);

    // Se o campo for válido, avance para o próximo campo
    if (!campoAtual.classList.contains("error")) {
      const form = event.target.form;
      const camposDeFormulario = Array.from(
        form.querySelectorAll("input, select, textarea")
      );
      const indiceCampoAtual = camposDeFormulario.indexOf(campoAtual);
      const proximoCampo =
        camposDeFormulario[indiceCampoAtual + 1] || camposDeFormulario[0];
      proximoCampo.focus();
    }
  }
}

// Ouvinte de eventos 'keydown' para todos os campos de entrada do formulário
const camposDoFormulario = document.querySelectorAll("input, select, textarea");
camposDoFormulario.forEach((campo) => {
  campo.addEventListener("keydown", checkEnter);
  campo.addEventListener("blur", () => validarCampo(campo)); // Valida o campo ao desfocar
});

// Funções para exibir campos de acordo com a resposta
function mostrarCampoWhatsapp() {
  var checkbox = document.getElementById("whatsapp_switch");
  var campoWhatsapp = document.getElementById("campoWhatsapp");
  var celularInput = document.getElementById("celular");
  var whatsappInput = document.getElementById("whatsapp");

  if (checkbox.checked) {
    campoWhatsapp.style.display = "none";
    whatsappInput.value = celularInput.value;
  } else {
    campoWhatsapp.style.display = "block";
    whatsappInput.value = ""; // Limpa o campo WhatsApp, se estiver preenchido
  }
}

function mostrarCamposFilhos() {
  var camposFilhos = document.getElementById("camposFilhos");
  if (camposFilhos) {
    camposFilhos.style.display = "block";
  }
}

function ocultarCamposFilhos() {
  var camposFilhos = document.getElementById("camposFilhos");
  if (camposFilhos) {
    camposFilhos.style.display = "none";
  }
}

function adicionarFilho() {
  var maisFilhosContainer = document.getElementById("maisFilhosContainer");

  var novoFilhoDiv = document.createElement("div");
  novoFilhoDiv.classList.add("campo");

  var labelNomeFilho = document.createElement("label");
  labelNomeFilho.textContent = "Nome do Filho";
  var inputNomeFilho = document.createElement("input");
  inputNomeFilho.type = "text";
  inputNomeFilho.name = "nome_filho";

  var labelDataNascimentoFilho = document.createElement("label");
  labelDataNascimentoFilho.textContent = "Data de Nascimento do Filho";
  var inputDataNascimentoFilho = document.createElement("input");
  inputDataNascimentoFilho.type = "date";
  inputDataNascimentoFilho.name = "data_nascimento_filho";

  novoFilhoDiv.appendChild(labelNomeFilho);
  novoFilhoDiv.appendChild(inputNomeFilho);
  novoFilhoDiv.appendChild(labelDataNascimentoFilho);
  novoFilhoDiv.appendChild(inputDataNascimentoFilho);

  maisFilhosContainer.appendChild(novoFilhoDiv);
}

function mostrarCamposConjuge() {
  var estadoCivil = document.getElementById("estado_civil").value;
  var camposConjuge = document.getElementById("camposConjuge");

  if (estadoCivil === "casado" || estadoCivil === "uniao_estavel") {
    camposConjuge.style.display = "block";
  } else {
    camposConjuge.style.display = "none";
  }
}

// Ouvinte de evento para o campo Estado Civil
document
  .getElementById("estado_civil")
  .addEventListener("change", mostrarCamposConjuge);

// Ouvinte de evento para o campo Celular
document.getElementById("celular").addEventListener("blur", function () {
  formatarCelularParaExibicao(this);
  validarCampo(this); // Validar campo ao desfocar
});

// Ouvinte de evento para o campo Telefone
document.getElementById("telefone").addEventListener("blur", function () {
  formatarTelefoneParaExibicao(this);
  validarCampo(this); // Validar campo ao desfocar
});

// Ouvinte de evento para o campo CEP
document.getElementById("cep").addEventListener("blur", function () {
  formatarCEP(this);
  validarCampo(this); // Validar campo ao desfocar
});

// Ouvinte de evento para o campo WhatsApp switch
document
  .getElementById("whatsapp_switch")
  .addEventListener("change", mostrarCampoWhatsapp);

// Ouvinte de evento para adicionar filho
document
  .getElementById("adicionarFilho")
  .addEventListener("click", adicionarFilho);

// Ouvinte de evento para o envio do formulário
document.getElementById("form").addEventListener("submit", submitForm);
