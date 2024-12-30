document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modalMaisApps");
  const appButton = document.querySelector(".apps a");
  const headerNav = document.querySelector(".header-nav, .home-header-nav");
  const originalZIndex = headerNav.style.zIndex || "2000"; // Salva o z-index original
  const modalContent = document.querySelector(".modal-mais-apps-content");

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  appButton.addEventListener("click", function (event) {
    event.preventDefault();
    toggleModal();
  });

  // Eventos de toque
  modalContent.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  modalContent.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  modalContent.addEventListener("touchend", handleTouchEnd);

  // Eventos de mouse
  modalContent.addEventListener("mousedown", handleMouseStart);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseEnd);

  // Evento de teclado
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModalFunction();
    }
  });

  function handleTouchStart(event) {
    if (event.touches.length === 1) {
      startY = event.touches[0].clientY;
      isDragging = true;
      modalContent.classList.add("dragging");
    }
  }

  function handleTouchMove(event) {
    if (isDragging) {
      currentY = event.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        modalContent.style.transform = `translateY(${deltaY}px)`;
        event.preventDefault(); // Previne o comportamento de atualização do navegador
      }
    }
  }

  function handleTouchEnd(event) {
    if (isDragging) {
      const deltaY = currentY - startY;
      modalContent.classList.remove("dragging");
      if (deltaY > 100) {
        closeModalFunction();
      } else {
        modalContent.style.transition = "transform 0.5s ease-in-out";
        modalContent.style.transform = "translateY(0)";
      }
      isDragging = false;
    }
  }

  function handleMouseStart(event) {
    startY = event.clientY;
    isDragging = true;
    modalContent.classList.add("dragging");
  }

  function handleMouseMove(event) {
    if (isDragging) {
      currentY = event.clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        modalContent.style.transform = `translateY(${deltaY}px)`;
      }
    }
  }

  function handleMouseEnd(event) {
    if (isDragging) {
      const deltaY = currentY - startY;
      modalContent.classList.remove("dragging");
      if (deltaY > 100) {
        closeModalFunction();
      } else {
        modalContent.style.transition = "transform 0.5s ease-in-out";
        modalContent.style.transform = "translateY(0)";
      }
      isDragging = false;
    }
  }

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModalFunction();
    }
  });

  function toggleModal() {
    if (modal.classList.contains("show")) {
      closeModalFunction();
    } else {
      openModalFunction();
    }
  }

  function openModalFunction() {
    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);
    appButton.querySelector("img").src =
      "./static/imagens/icones/apps-select.svg";
    updateHeaderIcons(false);
    headerNav.style.zIndex = 2007;
    headerNav.classList.add("modal-open"); // Adiciona a classe para mudar a cor de fundo
  }

  function closeModalFunction() {
    modal.classList.remove("show");
    modalContent.classList.add("hide"); // Adiciona a classe para animação de gaveta
    setTimeout(() => {
      modal.style.display = "none";
      modalContent.classList.remove("hide"); // Remove a classe após o fechamento
      modalContent.style.transform = "translateY(0)"; // Reseta a posição
      headerNav.style.zIndex = originalZIndex; // Retorna ao z-index original após a animação de fechamento
      headerNav.classList.remove("modal-open"); // Remove a classe para restaurar a cor de fundo
    }, 500); // Tempo igual ao de transição
    appButton.querySelector("img").src = "./static/imagens/icones/apps.svg";
    updateHeaderIcons(true);
  }

  function updateHeaderIcons(reset) {
    const indicadores = document.querySelectorAll(".indicador img");
    indicadores.forEach((indicador) => {
      if (reset) {
        indicador.src = indicador.src.replace(".svg", "-select.svg").trim();
      } else {
        indicador.src = indicador.src.replace("-select.svg", ".svg").trim();
      }
    });
  }
});
