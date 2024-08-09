document.addEventListener("DOMContentLoaded", function () {
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

  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let mouseMoved = false;
  const dragThreshold = 20;

  function handleScroll() {
    if (isDragging) return;

    requestAnimationFrame(() => {
      const scrollTop = scrollContainer.scrollTop;
      if (scrollTop > 0) {
        hideDashboard();
      }
    });
  }

  function handleStart(event) {
    if (event.target.closest(".bar-dragging-dashboard-container")) {
      startY = event.touches ? event.touches[0].clientY : event.clientY;
      isDragging = true;
      mouseMoved = false;
      barDraggingContainer.classList.add("dragging");
      event.preventDefault();

      // Adicionar eventos de mouse para toda a janela durante o arrasto
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
    }
  }

  function handleMove(event) {
    if (!isDragging) return;

    currentY = event.touches ? event.touches[0].clientY : event.clientY;
    mouseMoved = true;
    event.preventDefault();
  }

  function handleEnd(event) {
    if (!isDragging) return;

    const delta = currentY - startY;

    if (mouseMoved && Math.abs(delta) > dragThreshold) {
      requestAnimationFrame(() => {
        if (delta > 0) {
          showDashboard();
        } else if (delta < 0) {
          hideDashboard();
        }
      });
    }

    barDraggingContainer.classList.remove("dragging");
    isDragging = false;

    // Remover eventos de mouse da janela após o arrasto
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
  }

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

  function addEventListeners(element, events, handler) {
    events.forEach((event) => {
      element.addEventListener(event, handler);
    });
  }

  scrollContainer.addEventListener("scroll", handleScroll);

  const draggableElements = [
    swipeContainer,
    headerContainer,
    accountsListContainer,
    dashboardContainer,
    barDraggingContainer,
  ];

  // Adicionando suporte para eventos de toque e mouse
  draggableElements.forEach((element) => {
    addEventListeners(element, ["touchstart", "mousedown"], handleStart);
  });

  // Eventos de toque continuam nos elementos individuais
  draggableElements.forEach((element) => {
    addEventListeners(element, ["touchmove"], handleMove);
    addEventListeners(element, ["touchend"], handleEnd);
  });
});
