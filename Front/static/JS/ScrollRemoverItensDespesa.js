document.addEventListener("DOMContentLoaded", function () {
  // Seletores dos elementos da interface
  const swipeContainer = document.querySelector(
    ".area-interna-containerContent-template"
  );
  const scrollContainer = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const headerContainer = document.querySelector(
    ".area-interna-containerContent-template-header"
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
  const dashboardContainer = document.querySelector(".dashboard-container");
  const barDraggingContainer = document.querySelector(
    ".bar-dragging-dashboard-container"
  );

  // Variáveis para controle de arrasto e limiar
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let isThrottled = false;
  const dragThreshold = 20; // Define a distância mínima de arrasto em pixels

  // Função para lidar com o evento de rolagem
  function handleScroll() {
    // Evita a execução contínua da função durante a rolagem
    if (isThrottled) return;
    isThrottled = true;

    // Usando requestAnimationFrame para otimizar o desempenho da rolagem
    requestAnimationFrame(() => {
      const scrollTop = scrollContainer.scrollTop;
      if (scrollTop > 0) {
        hideDashboard(); // Oculta o dashboard ao rolar para baixo
      }
      isThrottled = false;
    });
  }

  // Função para lidar com o início do toque/arrasto
  function handleStart(event) {
    // Verifica se o toque/arrasto foi iniciado no barDraggingContainer
    if (event.target === barDraggingContainer) {
      startY = event.touches ? event.touches[0].clientY : event.clientY;
      isDragging = true;

      // Adiciona a classe de arrasto para feedback visual
      barDraggingContainer.classList.add("dragging");

      // Previne o comportamento padrão do navegador durante o arrasto
      event.preventDefault();
    }
  }

  // Função para lidar com o movimento do toque/arrasto
  function handleMove(event) {
    if (!isDragging) return;
    currentY = event.touches ? event.touches[0].clientY : event.clientY;

    // Previne o comportamento padrão durante o arrasto
    event.preventDefault();
  }

  // Função para lidar com o final do toque/arrasto
  function handleEnd(event) {
    if (!isDragging) return;
    const delta = currentY - startY;

    // Verifica se o arrasto excedeu o limiar definido
    if (Math.abs(delta) > dragThreshold) {
      requestAnimationFrame(() => {
        // Determina a direção do arrasto e chama a função apropriada
        if (event.target === barDraggingContainer) {
          if (delta > 0) {
            showDashboard(); // Mostra o dashboard se o arrasto foi para baixo
          } else if (delta < 0) {
            hideDashboard(); // Oculta o dashboard se o arrasto foi para cima
          }
        }
      });
    }

    // Remove a classe de arrasto ao finalizar o arrasto
    barDraggingContainer.classList.remove("dragging");
    isDragging = false;
  }

  // Função para ocultar o dashboard com animação
  function hideDashboard() {
    requestAnimationFrame(() => {
      chartWrapper.classList.add("dashboard-fade-out-up");
      chartCenterText.classList.add("dashboard-fade-out-up");
      availableValue.classList.remove("dashboard-hidden");
      accountsList.classList.add("horizontal-list");
      setTimeout(() => {
        chartWrapper.classList.add("dashboard-hidden");
        availableValue.classList.add("dashboard-fade-in-up");
        if (accountsListContainer.querySelector("h2")) {
          accountsListContainer
            .querySelector("h2")
            .classList.add("dashboard-hidden");
        }
        progressBars.forEach((bar) => bar.classList.add("dashboard-hidden"));
        accountsListContainer.style.width = "100%";
        dashboardContent.style.padding = "7px";
      }, 300);
    });
  }

  // Função para mostrar o dashboard com animação
  function showDashboard() {
    requestAnimationFrame(() => {
      availableValue.classList.remove("dashboard-fade-in-up");
      availableValue.classList.add("dashboard-fade-out-down");
      setTimeout(() => {
        availableValue.classList.add("dashboard-hidden");
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
        dashboardContent.style.padding = "";
        availableValue.classList.remove("dashboard-fade-out-down");
        accountsListContainer.classList.add("vertical-list-animation");
        setTimeout(() => {
          accountsListContainer.classList.remove("vertical-list-animation");
        }, 300);
      }, 300);
    });
  }

  // Função auxiliar para adicionar múltiplos ouvintes de eventos a um elemento
  function addEventListeners(element, events, handler) {
    events.forEach((event) => {
      element.addEventListener(event, handler);
    });
  }

  // Adiciona o ouvinte de eventos de rolagem ao scrollContainer
  scrollContainer.addEventListener("scroll", handleScroll);

  // Adiciona os ouvintes de eventos de toque e clique para iniciar, mover e finalizar o arrasto
  addEventListeners(swipeContainer, ["touchstart", "mousedown"], handleStart);
  addEventListeners(swipeContainer, ["touchmove", "mousemove"], handleMove);
  addEventListeners(swipeContainer, ["touchend", "mouseup"], handleEnd);

  addEventListeners(headerContainer, ["touchstart", "mousedown"], handleStart);
  addEventListeners(headerContainer, ["touchmove", "mousemove"], handleMove);
  addEventListeners(headerContainer, ["touchend", "mouseup"], handleEnd);

  addEventListeners(accountsListContainer, ["touchstart"], handleStart);
  addEventListeners(accountsListContainer, ["touchmove"], handleMove);
  addEventListeners(accountsListContainer, ["touchend"], handleEnd);
  addEventListeners(accountsListContainer, ["mousedown"], handleStart);
  addEventListeners(accountsListContainer, ["mousemove"], handleMove);
  addEventListeners(accountsListContainer, ["mouseup"], handleEnd);

  addEventListeners(
    dashboardContainer,
    ["touchstart", "mousedown"],
    handleStart
  );
  addEventListeners(dashboardContainer, ["touchmove", "mousemove"], handleMove);
  addEventListeners(dashboardContainer, ["touchend", "mouseup"], handleEnd);

  // Adiciona os ouvintes de eventos ao barDraggingContainer para o comportamento de arrasto
  barDraggingContainer.addEventListener("touchstart", handleStart);
  barDraggingContainer.addEventListener("touchmove", handleMove);
  barDraggingContainer.addEventListener("touchend", handleEnd);
  barDraggingContainer.addEventListener("mousedown", handleStart);
  barDraggingContainer.addEventListener("mousemove", handleMove);
  barDraggingContainer.addEventListener("mouseup", handleEnd);
});
