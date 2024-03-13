// Validações e formatação
// Função para validação do formulário
function validarFormulario() {
  let formValido = true;
  let camposNaoPreenchidos = [];

  function validarCampo(campoId, mensagem) {
    let campo = document.getElementById(campoId);
    let valorCampo = campo.value.trim();

    if (valorCampo === "") {
      camposNaoPreenchidos.push(mensagem);
      campo.style.border = "2px solid red"; // Adiciona a borda vermelha
      formValido = false;
      return false;
    } else {
      campo.style.border = ""; // Remove a borda vermelha se o campo for preenchido
    }

    return true;
  }

  // Defina uma lista de objetos representando os campos requeridos
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
    // Adicione mais campos conforme necessário
  ];

  // Iterar sobre os campos requeridos e validar cada um
  for (const campo of camposRequeridos) {
    let campoValido = validarCampo(campo.id, campo.mensagem);

    // Adicione lógica de validação adicional conforme necessário
    if (campo.id === "perfil_influencia" && campoValido) {
      let tipoContatoSelecionado = Array.from(
        document.querySelectorAll("#tipo_contato input[type='checkbox']")
      ).some((checkbox) => checkbox.checked);

      if (!tipoContatoSelecionado) {
        camposNaoPreenchidos.push("Selecione pelo menos um Tipo de Contato");
        formValido = false;
      }
    }
  }

  // Verificar se há campos não preenchidos e exibir alerta único
  if (camposNaoPreenchidos.length > 0) {
    alert(
      `Por favor, preencha os seguintes campos obrigatórios:\n${camposNaoPreenchidos.join(
        "\n"
      )}`
    );

    formValido = false;
  }

  return formValido;
}
// Função para validar um campo específico
function validarCampo(campo) {
  const valorCampo = campo.value.trim();

  if (campo.hasAttribute("required") && valorCampo === "") {
    alert("Campo obrigatório não preenchido");
    campo.style.border = "2px solid red"; // Adiciona a borda vermelha
    return false;
  } else {
    campo.style.border = ""; // Remove a borda vermelha se o campo for preenchido
    return true;
  }
}
// Função para Validação do preenchimento correto do campo
function validarEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexEmail.test(email)) {
    alert("E-mail inválido");
    return false;
  } else {
    return true;
  }
}
function validarCelular(celular) {
  const regexCelular = /^\(\d{2}\) 9\d{4}-\d{4}$/;

  if (!regexCelular.test(celular)) {
    alert("Celular inválido");
    return false;
  } else {
    return true;
  }
}
function validarTelefone(telefone) {
  const regexTelefone = /^\(\d{2}\) \d{4,5}-\d{4}$/;

  if (!regexTelefone.test(telefone)) {
    alert("Telefone inválido");
    return false;
  } else {
    return true;
  }
}
function validarCEP(cep) {
  const regexCEP = /^\d{5}-?\d{3}$/;

  if (!regexCEP.test(cep)) {
    alert("CEP inválido");
    return false;
  } else {
    return true;
  }
}
// Função para formatação  dos campos
function formatarCelularParaExibicao(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 10) {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, 3)}${value.slice(
      3,
      7
    )}-${value.slice(7)}`;
  } else {
    input.value = value;
  }
}

function formatarTelefoneParaExibicao(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 9) {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(
      6
    )}`;
  } else {
    input.value = value;
  }
}

function formatarCelularParaBanco(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  input.value = value;
}

function formatarTelefoneParaBanco(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  input.value = value;
}

function formatarCEP(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 5) {
    input.value = `${value.slice(0, 5)}-${value.slice(5)}`;
  } else {
    input.value = value;
  }
}
// Função para verificar a tecla "Enter" e evitar o envio do formulário
function checkEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    // Obtenha o campo atual em foco
    const campoAtual = event.target;

    // Adicione aqui a lógica para validar o campo atual
    const campoValido = validarCampo(campoAtual);

    if (campoValido) {
      // O campo é válido, continue com a lógica para avançar para o próximo campo
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
// Ouvinte de calendario 'keydown' a todos os campos de entrada do formulário
const camposDoFormulario = document.querySelectorAll("input, select, textarea");
camposDoFormulario.forEach((campo) => {
  campo.addEventListener("keydown", checkEnter);
});

// Exibir campos de acordo com a resposta
// Função para mostrar campo de Whatsapp
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

  if (estadoCivil === "Casado(a)" || estadoCivil === "União Estável") {
    camposConjuge.style.display = "block";
  } else {
    camposConjuge.style.display = "none";
  }
}
function ocultarCamposConjuge() {
  var camposConjuge = document.getElementById("camposConjuge");
  camposConjuge.style.display = "none";
}
function toggleCamposCargoComissionado() {
  var checkbox = document.getElementById("cargo_comissionado_switch");
  var camposCargoComissionado = document.getElementById(
    "camposCargoComissionado"
  );

  if (checkbox.checked) {
    camposCargoComissionado.style.display = "block";
  } else {
    camposCargoComissionado.style.display = "none";
  }
}

function submitForm() {
  // Adicione validações adicionais conforme necessário
  if (!validarFormulario()) {
    // Se a validação falhar, retorne false para evitar o envio do formulário
    return false;
  }

  var form = document.getElementById("form");
  var formData = new FormData(form);

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

  // Retorne false para evitar o envio padrão do formulário
  return false;
}
// Adiciona um evento de clique ao botão Fechar
//document.getElementById("btnFechar").addEventListener("click", function () {
// Redireciona para a página "contatos.html"
// window.location.href = "contatos.html";
//});
// Função para exibir mensagem de erro
