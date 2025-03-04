document.addEventListener("DOMContentLoaded", () => {
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

  if (!dashboardContent) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let isAnimating = false;
  let maxHeight = 345;
  const minHeight = 0;
  let initialHeight = maxHeight;
  const moveThreshold = 10;
  const snapThreshold = 0.3;
  const animationDuration = 300;

  const adjustLayout = () => {
    if (window.innerWidth <= 900) {
      maxHeight = 355;
      Object.assign(dashboardContent.style, {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "7px",
      });
    } else {
      maxHeight = 345;
      Object.assign(dashboardContent.style, {
        flexDirection: "row",
        alignItems: "center",
        padding: "20px",
      });
    }
  };

  const saveCostCenterSelection = () => {
    const selectedOption = costCenterSelect.value;
    localStorage.setItem("selectedCostCenter", selectedOption);
  };

  const restoreCostCenterSelection = () => {
    const savedOption = localStorage.getItem("selectedCostCenter");
    if (savedOption) {
      costCenterSelect.value = savedOption;
    }
  };

  restoreCostCenterSelection();
  costCenterSelect.addEventListener("change", saveCostCenterSelection);

  adjustLayout();
  window.addEventListener("resize", adjustLayout);

  const handleScroll = () => {
    if (isDragging || isAnimating) return;

    const scrollTop = scrollContainer.scrollTop;
    if (scrollTop > 0) {
      hideDashboard(true);
    }
  };

  const handleStart = (event) => {
    if (isAnimating) return;

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
  };

  const handleMove = (event) => {
    if (!isDragging) return;

    const touchEvent = event.touches ? event.touches[0] : event;
    currentY = touchEvent.clientY;
    const delta = startY - currentY;

    if (Math.abs(delta) > moveThreshold) {
      event.preventDefault();
    }

    let newHeight = initialHeight - delta;

    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

    dashboardContent.style.height = `${newHeight}px`;
    dashboardContent.style.opacity = newHeight / maxHeight;

    if (newHeight <= minHeight) {
      dashboardContent.style.padding = "7px";
    } else {
      adjustLayout();
    }

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
  };

  const handleEnd = (event) => {
    if (!isDragging) return;

    const finalHeight = dashboardContent.offsetHeight;
    const snapPoint = maxHeight * snapThreshold;

    isDragging = false;
    isAnimating = true;

    if (finalHeight > snapPoint) {
      if (finalHeight > initialHeight) {
        showDashboard();
      } else {
        hideDashboard();
      }
    } else {
      if (initialHeight > minHeight) {
        showDashboard();
      } else {
        hideDashboard();
      }
    }

    barDraggingContainer.classList.remove("dragging");

    // Remover eventos adicionados
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("touchend", handleEnd);
  };

  const hideDashboard = (fromScroll = false) => {
    dashboardContent.style.transition = `height ${animationDuration}ms ease-in-out, opacity ${animationDuration}ms ease-in-out`;
    dashboardContent.style.height = `${minHeight}px`;
    dashboardContent.style.padding = "7px";
    dashboardContent.style.opacity = 0;
    availableValue.classList.remove("dashboard-hidden");
    availableValue.classList.add("dashboard-fade-in-up");

    chartWrapper.classList.add("dashboard-fade-out-up");
    chartCenterText.classList.add("dashboard-fade-out-up");
    accountsList.classList.add("horizontal-list");

    const onTransitionEnd = () => {
      if (dashboardContent.style.height === `${minHeight}px`) {
        chartWrapper.classList.add("dashboard-hidden");
        const h2Element = accountsListContainer.querySelector("h2");
        if (h2Element) {
          h2Element.classList.add("dashboard-hidden");
        }
        progressBars.forEach((bar) => bar.classList.add("dashboard-hidden"));
        accountsListContainer.style.width = "100%";
      }
      isAnimating = false;
      reinitializeChartAfterAnimation();
      dashboardContent.removeEventListener("transitionend", onTransitionEnd);
    };

    dashboardContent.addEventListener("transitionend", onTransitionEnd);
  };

  const showDashboard = () => {
    dashboardContent.style.transition = `height ${animationDuration}ms ease-in-out, opacity ${animationDuration}ms ease-in-out`;
    dashboardContent.style.height = `${maxHeight}px`;
    adjustLayout();
    dashboardContent.style.opacity = 1;
    availableValue.classList.add("dashboard-hidden");
    availableValue.classList.remove("dashboard-fade-in-up");

    chartWrapper.classList.remove("dashboard-hidden");
    chartWrapper.classList.remove("dashboard-fade-out-up");
    chartCenterText.classList.remove("dashboard-fade-out-up");
    accountsList.classList.remove("horizontal-list");
    progressBars.forEach((bar) => bar.classList.remove("dashboard-hidden"));
    const h2Element = accountsListContainer.querySelector("h2");
    if (h2Element) {
      h2Element.classList.remove("dashboard-hidden");
    }
    accountsListContainer.style.width = "";

    const onTransitionEnd = () => {
      if (dashboardContent.style.height === `${maxHeight}px`) {
        chartWrapper.classList.remove("dashboard-hidden");
        progressBars.forEach((bar) => bar.classList.remove("dashboard-hidden"));
        if (h2Element) {
          h2Element.classList.remove("dashboard-hidden");
        }
      }
      isAnimating = false;
      reinitializeChartAfterAnimation();
      dashboardContent.removeEventListener("transitionend", onTransitionEnd);
    };

    dashboardContent.addEventListener("transitionend", onTransitionEnd);
  };

  const reinitializeChartAfterAnimation = () => {
    if (!chartWrapper.classList.contains("dashboard-hidden")) {
      initializeDashboard();
    }
  };

  const addEventListeners = (element, events, handler) => {
    events.forEach((event) => {
      element.addEventListener(event, handler);
    });
  };

  scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

  const draggableElements = [swipeContainer, barDraggingContainer];

  draggableElements.forEach((element) => {
    addEventListeners(element, ["touchstart", "mousedown"], handleStart);
    addEventListeners(element, ["touchmove", "mousemove"], handleMove);
    addEventListeners(element, ["touchend", "mouseup"], handleEnd);
  });
});
