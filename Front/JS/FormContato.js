// Script JavaScript para o formulário
var form = document.getElementById("form");
var cep = document.getElementById("cep");
var uf = document.getElementById("uf");
var cidade = document.getElementById("cidade");
var rua = document.getElementById("rua");
var numero = document.getElementById("numero");
var complemento = document.getElementById("complemento");
var bairro = document.getElementById("bairro");
var nav_links = document.querySelectorAll(".nav li a");
var abas = document.querySelectorAll(".aba");
var proximos = document.querySelectorAll("[id^=proximo]");
var anteriores = document.querySelectorAll("[id^=anterior]");
var salvar = document.querySelectorAll("[id^=salvar]");
var links = document.querySelectorAll(".nav li a");

// Função para validar os campos obrigatórios de cada aba
function validarCampos(aba) {
  var campos = aba.querySelectorAll("input, select");
  var valido = true;

  campos.forEach(function (campo) {
    if (campo.required && campo.value.trim() === "") {
      valido = false;
      campo.style.borderColor = "red";
    } else {
      campo.style.borderColor = "#ccc";
    }
  });

  return valido;
}

// Função para mudar a aba ativa
function mudarAba(abaId) {
  abas.forEach(function (aba) {
    aba.style.display = "none";
  });

  var abaSelecionada = document.getElementById(abaId);
  abaSelecionada.style.display = "block";
  atualizarBotoesNavegacao(abaId);
}

// Função para buscar o endereço pelo CEP
function buscarEndereco(cep) {
  var url = "https://viacep.com.br/ws/" + cep + "/json/";
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resposta = JSON.parse(xhr.responseText);

      if (resposta.erro) {
        alert("CEP não encontrado!");
      } else {
        uf.value = resposta.uf;

        carregarCidades(uf.value, function () {
          cidade.value = resposta.localidade;

          carregarBairros(cidade.value, function () {
            bairro.value = resposta.bairro;
          });
        });

        rua.value = resposta.logradouro;
        complemento.value = resposta.complemento;
      }
    }
  };
  xhr.send();
}

// Função carregarBairros para buscar bairros diretamente da API do IBGE
function carregarBairros(cidade, callback) {
  var url =
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/" +
    cidade +
    "/distritos";
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resposta = JSON.parse(xhr.responseText);
      bairro.innerHTML = "<option value=''>Selecione</option>";

      resposta.forEach(function (distrito) {
        var option = document.createElement("option");
        option.value = distrito.nome;
        option.textContent = distrito.nome;
        bairro.appendChild(option);
      });

      if (callback) {
        callback();
      }
    }
  };
  xhr.send();
}

// Função para carregar as opções de cidade de acordo com o estado
function carregarCidades(estado, callback) {
  var url =
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" +
    estado +
    "/municipios";
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resposta = JSON.parse(xhr.responseText);
      cidade.innerHTML = "<option value=''>Selecione</option>";

      resposta.forEach(function (municipio) {
        var option = document.createElement("option");
        option.value = municipio.nome;
        option.textContent = municipio.nome;
        cidade.appendChild(option);
      });

      if (callback) {
        callback();
      }
    }
  };
  xhr.send();
}

// Função para ativar ou desativar os botões de navegação com base na aba atual
function atualizarBotoesNavegacao(abaAtual) {
  var indexAbaAtual = parseInt(abaAtual.charAt(3)) - 1;

  anteriores.forEach(function (anterior, index) {
    anterior.disabled = index === 0 || index > indexAbaAtual;
  });

  proximos.forEach(function (proximo, index) {
    proximo.disabled = index === proximos.length - 1 || index < indexAbaAtual;
  });

  salvar.forEach(function (botao) {
    botao.disabled = indexAbaAtual !== salvar.length - 1;
  });

  links.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("data-target") === "#" + abaAtual) {
      link.classList.add("active");
    }
  });
}

// Eventos para os botões de navegação entre as abas
proximo1.addEventListener("click", function () {
  if (validarCampos(aba1)) {
    location.hash = "aba2";
    mudarAba("aba2");
  } else {
    alert("Preencha todos os campos obrigatórios da aba Identificação!");
  }
});

anterior2.addEventListener("click", function () {
  location.hash = "aba1";
  mudarAba("aba1");
});

proximo2.addEventListener("click", function () {
  if (validarCampos(aba2)) {
    location.hash = "aba3";
    mudarAba("aba3");
  } else {
    alert("Preencha todos os campos obrigatórios da aba Endereço!");
  }
});

anterior3.addEventListener("click", function () {
  location.hash = "aba2";
  mudarAba("aba2");
});

// Evento para o botão de salvar o formulário
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (validarCampos(aba3)) {
    alert("Formulário salvo com sucesso!");
    // Aqui você pode enviar os dados do formulário para um servidor ou banco de dados
  } else {
    alert("Preencha todos os campos obrigatórios da aba Detalhes!");
  }
});

// Evento para o campo CEP
cep.addEventListener("blur", function () {
  var valor = cep.value.replace(/\D/g, ""); // Remove todos os não dígitos (pontos e traço)

  if (valor.length === 8) {
    // Se o CEP for válido
    buscarEndereco(valor);
  } else {
    alert("Digite um CEP válido!");
  }
});

// Evento para o campo UF
uf.addEventListener("change", function () {
  var valor = uf.value;
  if (valor != "") {
    carregarCidades(valor);
  }
});

// Evento para o campo Cidade
cidade.addEventListener("change", function () {
  var valor = cidade.value;
  if (valor != "") {
    carregarBairros(valor);
  }
});
cidade.addEventListener("change", function () {
  var valor = cidade.value;
  if (valor != "") {
    carregarBairros(valor);
  }
});

// Eventos para a mudança de aba
nav_links.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    var abaAtual = link.getAttribute("data-target").substring(1);
    mudarAba(abaAtual);
  });
});

// Adiciona a classe 'contato' aos campos de telefone e e-mail
var contatos = document.querySelectorAll(
  ".campo #celular, .campo #email, .campo #whatsapp, .campo #telefone"
);

contatos.forEach(function (contato) {
  contato.classList.add("contato");
});

// Função para validar os campos obrigatórios de cada aba
function validarCampos(aba) {
  var campos = aba.querySelectorAll("input, select");
  var valido = true;

  campos.forEach(function (campo) {
    if (campo.required && campo.value.trim() === "") {
      valido = false;
      campo.style.borderColor = "red";
    } else {
      campo.style.borderColor = "#ccc";
    }
  });

  // Adiciona validação para pelo menos um campo de contato preenchido
  if (!validarContato(aba)) {
    valido = false;
  }

  return valido;
}

// Função para validar pelo menos um campo de contato preenchido
function validarContato(aba) {
  var contatos = aba.querySelectorAll(".campo .contato");
  var peloMenosUmPreenchido = false;

  contatos.forEach(function (contato) {
    if (contato.value.trim() !== "") {
      peloMenosUmPreenchido = true;
    }
  });

  if (!peloMenosUmPreenchido) {
    alert("Preencha pelo menos um campo de contato (telefone ou e-mail)!");
    return false;
  }

  return true;
}
