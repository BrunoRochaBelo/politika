// Navegar entre abas
function ativarAba(aba) {
  aba.classList.add("active");
}

function desativarTodasAbas(abas) {
  abas.forEach((aba) => {
    aba.classList.remove("active");
    var idAba = aba.id.slice(3);
    var aCorrespondente = document.querySelector("#nav" + idAba + " a");
    if (aCorrespondente) {
      aCorrespondente.classList.remove("indicador-2");
    }
  });
}

function mostrarAba(id) {
  var abas = document.querySelectorAll(".aba-template");

  abas.forEach(function (aba) {
    if (aba.id === id) {
      aba.classList.add("active");

      // Adiciona a classe 'indicador-2' à <a> correspondente na navegação
      var aCorrespondente = document.querySelector("#nav" + id.slice(3) + " a");
      if (aCorrespondente) {
        aCorrespondente.classList.add("indicador-2");
      }

      aba.style.display = "block";

      // Ativa o filtro correspondente à aba ativa
      if (id === "aba1") {
        if (document.getElementById("filtro1")) {
          document.getElementById("filtro1").classList.remove("inactiveFil");
          document.getElementById("filtro1").classList.add("activeFil");
        }
        if (document.getElementById("filtro2")) {
          document.getElementById("filtro2").classList.remove("activeFil");
          document.getElementById("filtro2").classList.add("inactiveFil");
        }
      } else if (id === "aba2") {
        if (document.getElementById("filtro2")) {
          document.getElementById("filtro2").classList.remove("inactiveFil");
          document.getElementById("filtro2").classList.add("activeFil");
        }
        if (document.getElementById("filtro1")) {
          document.getElementById("filtro1").classList.remove("activeFil");
          document.getElementById("filtro1").classList.add("inactiveFil");
        }
      }
    } else {
      aba.classList.remove("active");

      // Remove a classe 'indicador-2' da <a> correspondente na navegação
      var idAba = aba.id.slice(3);
      var aCorrespondente = document.querySelector("#nav" + idAba + " a");
      if (aCorrespondente) {
        aCorrespondente.classList.remove("indicador-2");
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

    // Adicionar ou remover a classe "indicador-2" na navegação
    var idAba = novaAba.id.slice(3);

    Array.from(document.querySelectorAll("#navAba li")).forEach((li, index) => {
      var aCorrespondente = li.querySelector("a");
      if (index === abaAtual + offset) {
        aCorrespondente.classList.add("indicador-2");
      } else {
        aCorrespondente.classList.remove("indicador-2");
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

var startX;
var startY;
var startTime;
var threshold = 100; // distância mínima para considerar como swipe
var allowedTime = 300; // tempo máximo permitido para o swipe

document.addEventListener(
  "touchstart",
  function (event) {
    var touch = event.changedTouches[0];
    startX = touch.pageX;
    startY = touch.pageY;
    startTime = new Date().getTime(); // tempo de início do swipe
  },
  false
);

document.addEventListener(
  "touchend",
  function (event) {
    var touch = event.changedTouches[0];
    var distX = touch.pageX - startX;
    var distY = touch.pageY - startY;
    var elapsedTime = new Date().getTime() - startTime;

    // Verifica se o tempo e a distância são suficientes para considerar como swipe
    if (
      elapsedTime <= allowedTime &&
      Math.abs(distX) >= threshold &&
      Math.abs(distY) <= 100
    ) {
      // Verifica a direção do swipe
      if (distX > 0) {
        voltar();
      } else {
        avancar();
      }
    } else {
      // Se o toque não for na área da nav-calendar, realiza o swipe normalmente
      var targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      );
      if (!targetElement.closest(".nav-calendar")) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= 100) {
          if (distX > 0) {
            voltar();
          } else {
            avancar();
          }
        }
      }
    }
  },
  false
);
