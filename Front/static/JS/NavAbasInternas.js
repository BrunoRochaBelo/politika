// Navegar entre abas
// Navegar entre abas pelos botões
function ativarAba(aba) {
  aba.classList.add("active");
}
function desativarTodasAbas(abas) {
  var navAba = document.querySelector("#navAba");

  abas.forEach((aba) => {
    aba.classList.remove("active");
    var idAba = aba.id.slice(3);
    var liCorrespondente = navAba.querySelector("#nav" + idAba);
    if (liCorrespondente) {
      liCorrespondente.classList.remove("indicador");
    }
  });
}
// Navegar entre abas pelas
function mostrarAba(id) {
  var abas = document.querySelectorAll(".aba-template");
  var navAba = document.querySelector("#navAba");

  abas.forEach(function (aba) {
    if (aba.id === id) {
      aba.classList.add("active");

      // Adiciona a classe 'indicador' à <li> correspondente na navegação
      var liCorrespondente = navAba.querySelector("#nav" + id.slice(3));
      if (liCorrespondente) {
        liCorrespondente.classList.add("indicador");
      }

      aba.style.display = "block";
    } else {
      aba.classList.remove("active");

      // Remove a classe 'indicador' da <li> correspondente na navegação
      var idAba = aba.id.slice(3);
      var liCorrespondente = navAba.querySelector("#nav" + idAba);
      if (liCorrespondente) {
        liCorrespondente.classList.remove("indicador");
      }

      aba.style.display = "none";
    }
  });
  window.scrollTo(0, 0);
}

function navegar(offset) {
  var abas = document.querySelectorAll(".aba-template");
  var abaAtual = Array.from(abas).findIndex(
    (aba) => getComputedStyle(aba).display !== "none"
  );

  var novaAba = abas[abaAtual + offset];

  if (novaAba) {
    desativarTodasAbas(abas);
    abas[abaAtual].style.display = "none";
    novaAba.style.display = "block";
    ativarAba(novaAba);

    // Adicionar ou remover a classe "indicador" na navegação
    var navAba = document.querySelector("#navAba");
    var idAba = novaAba.id.slice(3);

    Array.from(navAba.children).forEach((li, index) => {
      if (index === abaAtual + offset) {
        li.classList.add("indicador");
      } else {
        li.classList.remove("indicador");
      }
    });
  }
  window.scrollTo(0, 0);
}
function voltar() {
  navegar(-1);
  window.scrollTo(0, 0);
}
function avancar() {
  navegar(1);
  window.scrollTo(0, 0);
}
