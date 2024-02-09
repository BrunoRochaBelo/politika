// Validações e formatação
// Função para validação do formulário
function validarFormulario() {
  let formValido = true;
  let camposNaoPreenchidos = [];

  function validarCampo(campoId, mensagem) {
    let valorCampo = document.getElementById(campoId).value.trim();
    if (valorCampo === "") {
      camposNaoPreenchidos.push(mensagem);
      formValido = false;
      return false;
    }
    return isValid;
  }

  // Validar aba1
  if (document.getElementById("aba1").style.display !== "none") {
    let tipoPessoaValido = validarCampo("tipo_pessoa", "Tipo de Pessoa");
    let nomeContatoValido = validarCampo("nome_contato", "Nome do Contato");
    let celularValido = validarCampo("celular", "Celular");
    let whatsappSim = document.getElementById("whatsapp_sim").checked;
    let whatsappValido = whatsappSim || validarCampo("whatsapp", "WhatsApp");
    let emailValido = validarCampo("email", "E-mail");
    let telefoneValido = validarCampo("telefone", "Telefone");
  }
  // Validar aba2
  if (document.getElementById("aba2").style.display !== "none") {
    let cepValido = validarCampo("cep", "CEP");
    let ufValido = validarCampo("uf", "UF");
    let cidadeValido = validarCampo("cidade", "Cidade");
    let bairroValido = validarCampo("bairro", "Bairro");
  }
  // Validar aba3
  if (document.getElementById("aba3").style.display !== "none") {
    let perfilInfluenciaValido = validarCampo(
      "perfil_influencia",
      "Perfil de Influência"
    );

    // Validação adicional para os campos específicos da aba3
    if (perfilInfluenciaValido) {
      let tipoContatoSelecionado = Array.from(
        document.querySelectorAll("#tipo_contato input[type='checkbox']")
      ).some((checkbox) => checkbox.checked);

      if (!tipoContatoSelecionado) {
        camposNaoPreenchidos.push("Selecione pelo menos um Tipo de Contato");
        formValido = false;
      }

      // Adicione mais validações conforme necessário para os campos da aba3
    } else {
      formValido = false;
    }
  }
  // Verificar se há campos não preenchidos e exibir alerta único
  if (camposNaoPreenchidos.length > 0) {
    alert(
      "Por favor, preencha os seguintes campos obrigatórios:\n" +
        camposNaoPreenchidos.join("\n")
    );
    formValido = false;
  }

  return formValido;
}
// Função para Validação dos campos
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
function formatarCelular(input) {
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
function formatarTelefone(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 9) {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(
      6
    )}`;
  } else {
    input.value = value;
  }
}
function formatarCEP(input) {
  let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (value.length > 5) {
    input.value = `${value.slice(0, 5)}-${value.slice(5)}`;
  } else {
    input.value = value;
  }
}
function checkEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    // Adicione aqui a lógica para avançar para o próximo campo ou realizar outra ação
  }
}

// Busca do endereço
// Função para buscar o endereço pelo CEP
async function buscarEndereco(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      console.log("CEP não encontrado");
      return;
    }

    document.getElementById("uf").value = data.uf;
    document.getElementById("cidade").value = data.localidade;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("rua").value = data.logradouro;
  } catch (error) {
    console.error("Erro na busca de endereço:", error);
  }
}

// Exibir campos de acordo com a resposta
// Função para mostrar campo de Whatsapp
function mostrarCampoWhatsapp() {
  var whatsappSim = document.getElementById("whatsapp_sim").checked;
  var campoWhatsapp = document.getElementById("campoWhatsapp");

  if (whatsappSim) {
    campoWhatsapp.style.display = "none";
    document.getElementById("whatsapp").value =
      document.getElementById("celular").value;
  } else {
    campoWhatsapp.style.display = "block";
    document.getElementById("whatsapp").value = ""; // Limpa o campo WhatsApp, se estiver preenchido
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
function mostrarCamposCargoComissionado() {
  var camposCargoComissionado = document.getElementById(
    "camposCargoComissionado"
  );
  if (camposCargoComissionado) {
    camposCargoComissionado.style.display = "block";
  }
}
function ocultarCamposCargoComissionado() {
  var camposCargoComissionado = document.getElementById(
    "camposCargoComissionado"
  );
  if (camposCargoComissionado) {
    camposCargoComissionado.style.display = "none";
  }
}

// Botoões
// Função para avançar para a próxima aba
function avancar() {
  var abas = document.querySelectorAll(".aba-template");
  var abaAtual = Array.from(abas).findIndex(
    (aba) => getComputedStyle(aba).display !== "none"
  );

  if (abaAtual < abas.length - 1) {
    abas[abaAtual].style.display = "none";
    abas[abaAtual + 1].style.display = "block";
  }
}
// Função para voltar para a aba anterior
function voltar() {
  var abas = document.querySelectorAll(".aba-template");
  var abaAtual = Array.from(abas).findIndex(
    (aba) => getComputedStyle(aba).display !== "none"
  );

  if (abaAtual > 0) {
    abas[abaAtual].style.display = "none";
    abas[abaAtual - 1].style.display = "block";
  }
}
// Evento de clique para os links de navegação
document.getElementById("navAba").addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    event.preventDefault();
    var targetAba = document.querySelector(
      event.target.getAttribute("data-target")
    );

    if (targetAba) {
      document.querySelectorAll(".aba-template").forEach(function (aba) {
        aba.style.display = "none";
      });

      targetAba.style.display = "block";
    }
  }
});
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

// Navegar entre abas
// Função para navegar entre abas
function mostrarAba(id) {
  // Remove a classe 'active' de todas as abas
  var abas = document.querySelectorAll(".aba-template");
  abas.forEach(function (aba) {
    aba.classList.remove("active");
  });

  // Adiciona a classe 'active' à aba alvo
  document.getElementById(id).classList.add("active");
}
