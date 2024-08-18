document.addEventListener("DOMContentLoaded", function () {
  const swipeContainer = document.querySelector(
    ".area-interna-containerContent-template-header"
  );
  const scrollContainer = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const chartWrapper = document.querySelector(".chart-wrapper");
  const chartCenterText = document.querySelector(".chart-center-text");
  const availableValue = document.querySelector("#available-value");
  const accountsList = document.querySelector("#accounts-list");
  const accountsListContainer = document.querySelector(
    ".accounts-list-container"
  );
  const progressBars = document.querySelectorAll(
    ".account-progress-bar-wrapper"
  );
  const dashboardContent = document.querySelector(".dashboard-content");
  const barDraggingContainer = document.querySelector(
    ".bar-dragging-dashboard-container"
  );
  const costCenterSelect = document.querySelector("#cost-center-select");

  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let isAnimating = false; // Bloqueio de estado
  let maxHeight = 300; // Altura máxima padrão para telas maiores
  let minHeight = 0; // Altura mínima padrão
  let initialHeight = maxHeight; // Assume que a dashboard começa aberta
  const moveThreshold = 10; // Limite para considerar como arrasto
  const snapThreshold = 0.3; // Ponto de snap como porcentagem da altura máxima
  const animationDuration = 300; // Duração da animação em milissegundos

  // Função debounce para limitar a frequência de execução
  function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // Ajustar a altura máxima e padding com base na largura da tela
  function adjustLayout() {
    if (window.innerWidth <= 900) {
      // Considerando max-width: 56.25rem
      maxHeight = 340; // Altura no modo responsivo
      dashboardContent.style.flexDirection = "column";
      dashboardContent.style.alignItems = "flex-start";
      dashboardContent.style.padding = "7px";
    } else {
      maxHeight = 300; // Altura padrão
      dashboardContent.style.flexDirection = "row";
      dashboardContent.style.alignItems = "center";
      dashboardContent.style.padding = "20px";
    }
  }

  // Função para salvar a seleção do cost-center-select no localStorage
  function saveCostCenterSelection() {
    const selectedOption = costCenterSelect.value;
    localStorage.setItem("selectedCostCenter", selectedOption);
  }

  // Função para restaurar a seleção do cost-center-select do localStorage
  function restoreCostCenterSelection() {
    const savedOption = localStorage.getItem("selectedCostCenter");
    if (savedOption) {
      costCenterSelect.value = savedOption;
    }
  }

  // Inicializar a seleção do cost-center-select
  restoreCostCenterSelection();
  costCenterSelect.addEventListener("change", saveCostCenterSelection);

  // Chame a função para ajustar o layout com base no tamanho da tela
  adjustLayout();
  window.addEventListener("resize", debounce(adjustLayout, 50));

  function handleScroll() {
    if (isDragging || isAnimating) return;

    requestAnimationFrame(() => {
      const scrollTop = scrollContainer.scrollTop;
      if (scrollTop > 0) {
        hideDashboard(true);
      }
    });
  }

  function handleStart(event) {
    if (isAnimating) return; // Bloquear novas interações durante a animação

    const touchEvent = event.touches ? event.touches[0] : event;

    if (event.target.closest(".bar-dragging-dashboard-container")) {
      startY = touchEvent.clientY;
      initialHeight = dashboardContent.offsetHeight;
      isDragging = true;
      barDraggingContainer.classList.add("dragging");
      event.preventDefault();

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    }
  }

  const handleMove = debounce(function (event) {
    if (!isDragging) return;

    const touchEvent = event.touches ? event.touches[0] : event;
    currentY = touchEvent.clientY;
    const delta = startY - currentY; // Delta invertido para arrastar para cima diminuir a altura

    // Prevenir a rolagem padrão para evitar pull-to-refresh
    if (Math.abs(delta) > moveThreshold) {
      event.preventDefault();
    }

    let newHeight = initialHeight - delta;

    // Limitar a altura dentro do intervalo permitido
    if (newHeight < minHeight) newHeight = minHeight;
    if (newHeight > maxHeight) newHeight = maxHeight;

    // Ajustar altura e opacidade em tempo real
    dashboardContent.style.height = `${newHeight}px`;
    dashboardContent.style.opacity = newHeight / maxHeight;

    // Reduzir padding quando o painel estiver oculto
    if (newHeight <= minHeight) {
      dashboardContent.style.padding = "7px";
    } else {
      adjustLayout(); // Ajustar o layout com base no modo responsivo
    }

    // Mostrar ou ocultar o availableValue e aplicar animações
    if (newHeight < maxHeight * 0.5) {
      availableValue.classList.remove("dashboard-hidden");
      availableValue.classList.add("dashboard-fade-in-up");
      chartWrapper.classList.add("dashboard-fade-out-up");
      chartCenterText.classList.add("dashboard-fade-out-up");
    } else {
      availableValue.classList.add("dashboard-hidden");
      availableValue.classList.remove("dashboard-fade-in-up");
      chartWrapper.classList.remove("dashboard-fade-out-up");
      chartCenterText.classList.remove("dashboard-fade-out-up");
    }
  }, 16); // Debounce a cada 16ms para sincronizar com os frames de 60fps

  function handleEnd(event) {
    if (!isDragging) return;

    const finalHeight = dashboardContent.offsetHeight;
    const snapPoint = maxHeight * snapThreshold; // Ponto de "snap" como 30% da altura máxima

    isDragging = false;
    isAnimating = true; // Bloquear novas interações durante a animação

    if (finalHeight > snapPoint) {
      if (finalHeight > initialHeight) {
        showDashboard(); // Se estava abaixo do snap, abre completamente
      } else {
        hideDashboard(); // Se estava acima do snap, fecha completamente
      }
    } else {
      // Voltar para a posição inicial se não atingir o ponto de snap
      if (initialHeight > minHeight) {
        showDashboard();
      } else {
        hideDashboard();
      }
    }

    barDraggingContainer.classList.remove("dragging");
  }

  function hideDashboard(fromScroll = false) {
    dashboardContent.style.transition = `height ${animationDuration}ms ease-in-out, opacity ${animationDuration}ms ease-in-out`;
    dashboardContent.style.height = `${minHeight}px`;
    dashboardContent.style.padding = "7px"; // Reduzir o padding ao esconder
    dashboardContent.style.opacity = 0;
    availableValue.classList.remove("dashboard-hidden");
    availableValue.classList.add("dashboard-fade-in-up");

    // Outras animações de fechamento
    chartWrapper.classList.add("dashboard-fade-out-up");
    chartCenterText.classList.add("dashboard-fade-out-up");
    accountsList.classList.add("horizontal-list");

    dashboardContent.addEventListener(
      "transitionend",
      function () {
        // Verifica se o painel está completamente fechado
        if (dashboardContent.style.height === `${minHeight}px`) {
          chartWrapper.classList.add("dashboard-hidden");
          if (accountsListContainer.querySelector("h2")) {
            accountsListContainer
              .querySelector("h2")
              .classList.add("dashboard-hidden");
          }
          progressBars.forEach((bar) => bar.classList.add("dashboard-hidden"));
          accountsListContainer.style.width = "100%";
        }
        isAnimating = false; // Liberar o bloqueio de interação
        reinitializeChartAfterAnimation(); // Reinitialize the chart after hiding
      },
      { once: true }
    ); // Certifique-se de que o evento seja executado apenas uma vez
  }

  function showDashboard() {
    dashboardContent.style.transition = `height ${animationDuration}ms ease-in-out, opacity ${animationDuration}ms ease-in-out`;
    dashboardContent.style.height = `${maxHeight}px`;
    adjustLayout(); // Restaurar as configurações do layout apropriado
    dashboardContent.style.opacity = 1;
    availableValue.classList.add("dashboard-hidden");
    availableValue.classList.remove("dashboard-fade-in-up");

    // Outras animações de abertura
    chartWrapper.classList.remove("dashboard-hidden");
    chartWrapper.classList.remove("dashboard-fade-out-up");
    chartCenterText.classList.remove("dashboard-fade-out-up");
    accountsList.classList.remove("horizontal-list");
    progressBars.forEach((bar) => bar.classList.remove("dashboard-hidden"));
    if (accountsListContainer.querySelector("h2")) {
      accountsListContainer
        .querySelector("h2")
        .classList.remove("dashboard-hidden");
    }
    accountsListContainer.style.width = "";

    dashboardContent.addEventListener(
      "transitionend",
      function () {
        // Verifica se o painel está completamente aberto
        if (dashboardContent.style.height === `${maxHeight}px`) {
          // Assegurar que todos os elementos estão visíveis
          chartWrapper.classList.remove("dashboard-hidden");
          progressBars.forEach((bar) =>
            bar.classList.remove("dashboard-hidden")
          );
          if (accountsListContainer.querySelector("h2")) {
            accountsListContainer
              .querySelector("h2")
              .classList.remove("dashboard-hidden");
          }
        }
        isAnimating = false; // Liberar o bloqueio de interação
        reinitializeChartAfterAnimation(); // Reinitialize the chart after showing
      },
      { once: true }
    ); // Certifique-se de que o evento seja executado apenas uma vez
  }

  function reinitializeChartAfterAnimation() {
    if (!chartWrapper.classList.contains("dashboard-hidden")) {
      initializeDashboard(); // Certifique-se de que essa função está disponível
    }
  }

  function addEventListeners(element, events, handler) {
    events.forEach((event) => {
      element.addEventListener(event, handler);
    });
  }

  scrollContainer.addEventListener("scroll", handleScroll);

  const draggableElements = [swipeContainer, barDraggingContainer];

  draggableElements.forEach((element) => {
    addEventListeners(element, ["touchstart", "mousedown"], handleStart);
  });

  draggableElements.forEach((element) => {
    addEventListeners(element, ["touchmove"], handleMove);
    addEventListeners(element, ["touchend"], handleEnd);
  });
});
