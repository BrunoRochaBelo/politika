document.addEventListener("DOMContentLoaded", function () {
  /* ================== CÓDIGO EXISTENTE DE INTERAÇÃO ================== */
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const orgListContainers = document.querySelectorAll(".org-list-container");

  orgListContainers.forEach((container) => {
    const orgList = container.querySelector(".org-list");
    let isDragging = false;
    let startX, scrollLeft;

    orgList.addEventListener("mousedown", (e) => {
      isDragging = true;
      container.classList.add("active");
      startX = e.pageX - orgList.offsetLeft;
      scrollLeft = orgList.scrollLeft;
    });

    orgList.addEventListener("mouseleave", () => {
      isDragging = false;
      container.classList.remove("active");
    });

    orgList.addEventListener("mouseup", () => {
      isDragging = false;
      container.classList.remove("active");
    });

    orgList.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - orgList.offsetLeft;
      const walk = (x - startX) * 1;
      orgList.scrollLeft = scrollLeft - walk;
      updateShadows();
    });

    function updateShadows() {
      if (orgList.scrollLeft > 0) {
        container.classList.add("shadow-left");
      } else {
        container.classList.remove("shadow-left");
      }
    }
    orgList.addEventListener("scroll", updateShadows);
    updateShadows();
  });

  toggleButtons.forEach(function (button) {
    function toggleSublist() {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const controlledSublistId = button.getAttribute("aria-controls");
      const controlledSublist = document.getElementById(controlledSublistId);
      const parentItem = button.closest(".org-item");

      if (controlledSublist) {
        if (isExpanded) {
          // Inicia o colapso
          controlledSublist.classList.remove("expanding");
          controlledSublist.classList.add("collapsing");
          button.classList.add("rotated");
          button.setAttribute("aria-expanded", "false");
          parentItem.setAttribute("aria-expanded", "false");

          const onTransitionEnd = function () {
            controlledSublist.classList.add("hidden");
            controlledSublist.classList.remove("collapsing");
            controlledSublist.removeEventListener(
              "transitionend",
              onTransitionEnd
            );
            updateCards();
          };
          controlledSublist.addEventListener("transitionend", onTransitionEnd);
        } else {
          // Inicia a expansão
          controlledSublist.classList.remove("hidden");
          void controlledSublist.offsetWidth;
          controlledSublist.classList.remove("collapsing");
          controlledSublist.classList.add("expanding");
          button.classList.remove("rotated");
          button.setAttribute("aria-expanded", "true");
          parentItem.setAttribute("aria-expanded", "true");

          const onTransitionEnd = function () {
            controlledSublist.classList.remove("expanding");
            controlledSublist.removeEventListener(
              "transitionend",
              onTransitionEnd
            );
            updateCards();
          };
          controlledSublist.addEventListener("transitionend", onTransitionEnd);
        }
      }
    }
    button.addEventListener("click", toggleSublist);
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSublist();
      }
    });
  });

  const orgListContainersAll = document.querySelectorAll(".org-list-container");
  orgListContainersAll.forEach((container) => {
    const orgList = container.querySelector(".org-list");

    orgList.addEventListener("keydown", function (e) {
      const focusableElements = orgList.querySelectorAll(
        ".toggle-btn, .org-name"
      );
      const focusArray = Array.prototype.slice.call(focusableElements);
      const currentIndex = focusArray.indexOf(document.activeElement);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < focusArray.length - 1) {
            focusArray[currentIndex + 1].focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            focusArray[currentIndex - 1].focus();
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (document.activeElement.classList.contains("toggle-btn")) {
            if (
              document.activeElement.getAttribute("aria-expanded") !== "true"
            ) {
              document.activeElement.click();
            }
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (document.activeElement.classList.contains("toggle-btn")) {
            if (
              document.activeElement.getAttribute("aria-expanded") === "true"
            ) {
              document.activeElement.click();
            }
          }
          break;
        default:
          break;
      }
    });
  });

  document.querySelectorAll(".org-item").forEach(function (item) {
    const svgPath = item.querySelector(".arrow-org path");
    const sublist = item.querySelector(".org-sublist");
    if (!sublist) {
      svgPath.setAttribute("fill", "transparent");
    } else {
      svgPath.setAttribute("fill", "currentColor");
    }
  });

  /* ================== FIM DO CÓDIGO EXISTENTE ================== */

  /* ================== NOVA ABORDAGEM PARA GRID DINÂMICO ================== */

  // Configurações do grid para cada layout
  const desktopGridRows = [
    "organograma-medium-card-nivel-nivel-hierarquia organograma-medium-card-nome_unidade organograma-medium-card-sigla_unidade",
    "organograma-medium-card-designacao organograma-medium-card-designacao organograma-medium-card-nivel-salarial",
    "organograma-medium-card-nome_titular organograma-medium-card-nome_titular organograma-medium-card-nome_titular",
  ];
  // Removíveis no desktop: índices 1 e 2 (sempre pulando a primeira linha)
  const desktopRemovable = [
    {
      rowIndex: 1,
      selectors: [
        ".organograma-medium-card-designacao",
        ".organograma-medium-card-nivel-salarial",
      ],
    },
    { rowIndex: 2, selectors: [".organograma-medium-card-nome_titular"] },
  ];

  const responsiveGridRows = [
    "organograma-medium-card-nivel-nivel-hierarquia organograma-medium-card-sigla_unidade",
    "organograma-medium-card-nome_unidade organograma-medium-card-nome_unidade",
    "organograma-medium-card-designacao organograma-medium-card-designacao",
    "organograma-medium-card-nivel-salarial organograma-medium-card-nivel-salarial",
    "organograma-medium-card-nome_titular organograma-medium-card-nome_titular",
    "organograma-medium-card-info-pub organograma-medium-card-info-pub",
    "organograma-medium-card-editar organograma-medium-card-editar",
  ];
  // Removíveis no responsivo: índices 2 a 6
  const responsiveRemovable = [
    { rowIndex: 2, selectors: [".organograma-medium-card-designacao"] },
    { rowIndex: 3, selectors: [".organograma-medium-card-nivel-salarial"] },
    { rowIndex: 4, selectors: [".organograma-medium-card-nome_titular"] },
    { rowIndex: 5, selectors: [".organograma-medium-card-info-pub"] },
    { rowIndex: 6, selectors: [".organograma-medium-card-editar"] },
  ];

  // Contador global de linhas removidas
  let removedLines = 0;

  // Retorna o grid original e o array de linhas removíveis conforme o layout atual
  function getGridConfig() {
    if (window.innerWidth <= 768) {
      return { gridRows: responsiveGridRows, removable: responsiveRemovable };
    } else {
      return { gridRows: desktopGridRows, removable: desktopRemovable };
    }
  }

  // Atualiza todos os cards (expandido ou não)
  function updateCards() {
    const { gridRows, removable } = getGridConfig();
    const maxRemovals = removable.length;
    if (removedLines > maxRemovals) removedLines = maxRemovals;
    if (removedLines < 0) removedLines = 0;

    const cards = document.querySelectorAll(".organograma-medium-card");
    cards.forEach((card) => {
      if (card.classList.contains("organograma-medium-card-expanded")) {
        // Se estiver expandido, zera as modificações dinâmicas
        card.style.removeProperty("grid-template-areas");
        card
          .querySelectorAll(".hidden-row")
          .forEach((el) => el.classList.remove("hidden-row"));
      } else {
        // Aplica a configuração dinâmica para os cards não expandidos
        card
          .querySelectorAll(".hidden-row")
          .forEach((el) => el.classList.remove("hidden-row"));
        const removalsToApply = removable
          .slice(0, removedLines)
          .map((item) => item.rowIndex);
        const newGridRows = gridRows.filter(
          (row, index) => !removalsToApply.includes(index)
        );
        card.style.gridTemplateAreas = newGridRows
          .map((row) => `"${row}"`)
          .join(" ");
        removable.forEach((group, idx) => {
          group.selectors.forEach((selector) => {
            const elements = card.querySelectorAll(selector);
            if (idx < removedLines) {
              elements.forEach((el) => el.classList.add("hidden-row"));
            } else {
              elements.forEach((el) => el.classList.remove("hidden-row"));
            }
          });
        });
      }
    });
  }

  // Observador para detectar mudanças na classe dos cards (expandido/collapsed)
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.attributeName === "class") {
        updateCards();
      }
    }
  });
  document.querySelectorAll(".organograma-medium-card").forEach((card) => {
    observer.observe(card, { attributes: true, attributeFilter: ["class"] });
  });

  // Processa o scroll com Ctrl para ajustar removedLines
  function handleWheelEvent(e) {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY > 0) {
        removedLines++;
      } else if (e.deltaY < 0) {
        removedLines--;
      }
      updateCards();
    }
  }
  document.addEventListener("wheel", handleWheelEvent, { passive: false });

  /* ================== IMPLEMENTAÇÃO APRIMORADA DOS GESTOS DE PINÇA ================== */

  // Variáveis para controle do gesto de pinça aprimorado
  let previousPinchDistance = null;
  let pinchAccumulatedDelta = 0;
  const pinchThreshold = 20; // Limiar ajustado para uma sensibilidade mais suave

  function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      // Previne o zoom nativo do navegador
      e.preventDefault();
      previousPinchDistance = getDistance(e.touches);
      pinchAccumulatedDelta = 0;
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2 && previousPinchDistance !== null) {
      // Previne o zoom nativo
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const delta = currentDistance - previousPinchDistance;
      pinchAccumulatedDelta += delta;
      previousPinchDistance = currentDistance;

      if (pinchAccumulatedDelta > pinchThreshold) {
        // Pinch out: reintegra uma linha (equivalente a Ctrl+scroll para cima)
        removedLines--;
        updateCards();
        pinchAccumulatedDelta -= pinchThreshold;
      } else if (pinchAccumulatedDelta < -pinchThreshold) {
        // Pinch in: remove uma linha
        removedLines++;
        updateCards();
        pinchAccumulatedDelta += pinchThreshold;
      }
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) {
      previousPinchDistance = null;
      pinchAccumulatedDelta = 0;
    }
  }

  document.addEventListener("touchstart", handleTouchStart, { passive: false });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });
  document.addEventListener("touchcancel", handleTouchEnd, { passive: true });

  // Atualiza os cards ao redimensionar a janela
  window.addEventListener("resize", updateCards);

  // Inicializa os cards
  updateCards();
});
