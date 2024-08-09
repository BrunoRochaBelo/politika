// NavAbasInternas.js

class Abas {
  constructor(containerSelector, abaSelector) {
    this.container = document.querySelector(containerSelector);
    this.abas = document.querySelectorAll(abaSelector);
    this.lastExecution = 0; // Timestamp da última execução para throttling
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadInitialAba();
  }

  bindEvents() {
    // Adiciona evento de clique para navegação por abas
    this.container.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        event.preventDefault();
        const id = event.target.getAttribute("href").substring(1);
        this.mostrarAba(id);
      }
    });

    // Adiciona evento de tecla para navegação por teclado
    document.addEventListener("keydown", (event) => {
      if (document.activeElement.closest("#navAba")) {
        if (event.key === "ArrowRight") {
          this.navegar(1);
        } else if (event.key === "ArrowLeft") {
          this.navegar(-1);
        }
      }
    });

    // Adiciona eventos de toque para navegação por swipe
    document.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
      false
    );
    document.addEventListener(
      "touchend",
      this.handleTouchEnd.bind(this),
      false
    );
  }

  handleTouchStart(event) {
    const touch = event.changedTouches[0];
    this.startX = touch.pageX; // Posição inicial do toque em X
    this.startY = touch.pageY; // Posição inicial do toque em Y
    this.startTime = new Date().getTime(); // Tempo inicial do toque
  }

  handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const distX = touch.pageX - this.startX; // Distância do movimento em X
    const distY = touch.pageY - this.startY; // Distância do movimento em Y
    const elapsedTime = new Date().getTime() - this.startTime; // Tempo decorrido do toque

    // Verifica se o movimento é um swipe válido
    if (
      elapsedTime <= 300 &&
      Math.abs(distX) >= 100 &&
      Math.abs(distY) <= 100
    ) {
      if (distX > 0) {
        this.voltar();
      } else {
        this.avancar();
      }
    }
  }

  loadInitialAba() {
    const hash = window.location.hash.substring(1); // Obtém o hash da URL
    if (hash) {
      this.mostrarAba(hash);
    } else if (this.abas.length > 0) {
      const primeiraAba = this.abas[0];
      this.mostrarAba(primeiraAba.id);
    }
  }

  desativarTodasAbas() {
    this.abas.forEach((aba) => {
      aba.classList.remove("active");
      const idAba = aba.id.slice(3);
      const aCorrespondente = document.querySelector(`#nav${idAba} a`);
      if (aCorrespondente) {
        aCorrespondente.classList.remove("indicador-2");
        aCorrespondente.setAttribute("aria-selected", "false");
        aCorrespondente.setAttribute("tabindex", "-1");
      }
      aba.style.display = "none"; // Esconde a aba
    });
  }

  ativarAba(aba) {
    aba.classList.add("active");
    const idAba = aba.id.slice(3);
    const aCorrespondente = document.querySelector(`#nav${idAba} a`);
    if (aCorrespondente) {
      aCorrespondente.classList.add("indicador-2");
      aCorrespondente.setAttribute("aria-selected", "true");
      aCorrespondente.setAttribute("tabindex", "0");
    }
    aba.style.display = "block"; // Mostra a aba
    aba.style.opacity = "0"; // Define opacidade inicial para animação
    requestAnimationFrame(() => {
      aba.style.opacity = "1"; // Anima a opacidade
      aba.style.transition = "opacity 0.3s ease"; // Define a transição
    });
    window.location.hash = aba.id; // Atualiza o hash na URL
  }

  mostrarAba(id) {
    const aba = document.getElementById(id);
    if (aba) {
      this.desativarTodasAbas();
      this.ativarAba(aba);
    }
  }

  navegar(offset) {
    const now = Date.now();
    if (now - this.lastExecution < 100) return; // Throttling: limita a execução a 10 vezes por segundo
    this.lastExecution = now;

    const abaAtualIndex = Array.from(this.abas).findIndex(
      (aba) => getComputedStyle(aba).display !== "none"
    );

    const novaAbaIndex = abaAtualIndex + offset;
    if (novaAbaIndex >= 0 && novaAbaIndex < this.abas.length) {
      const novaAba = this.abas[novaAbaIndex];
      this.desativarTodasAbas();
      this.ativarAba(novaAba);
    }
  }

  voltar() {
    this.navegar(-1); // Navega para a aba anterior
    window.scrollTo(0, 0); // Rolagem para o topo da página
  }

  avancar() {
    this.navegar(1); // Navega para a próxima aba
    window.scrollTo(0, 0); // Rolagem para o topo da página
  }
}

// Inicializa a navegação por abas após o carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {
  new Abas("#navAba", ".aba-template");
});
