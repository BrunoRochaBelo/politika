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
  const progressBars = document.querySelectorAll(".progress-bar-wrapper");
  const dashboardContent = document.querySelector(".dashboard-content");

  let startY = 0;
  let endY = 0;
  const swipeThreshold = 5;
  let isSwiping = false;

  function handleScroll() {
    const scrollTop = scrollContainer.scrollTop;
    if (scrollTop > 0) hideDashboard();
  }

  function handleStart(event) {
    if (isSwiping) return;
    startY = event.touches ? event.touches[0].clientY : event.clientY;
  }

  function handleEnd(event, isHeader = false) {
    if (isSwiping) return;
    endY = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;
    const scrollTop = scrollContainer.scrollTop;
    const delta = endY - startY;

    if (!isHeader && scrollTop === 0 && delta > swipeThreshold) {
      resetDashboard();
    } else if (isHeader && -delta > swipeThreshold) {
      hideDashboard();
    }
  }

  function handleAccountsListStart() {
    isSwiping = true;
  }

  function handleAccountsListEnd() {
    isSwiping = false;
  }

  function hideDashboard() {
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
  }

  function resetDashboard() {
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
  }

  function addEventListeners(element, events, handler) {
    events.forEach((event) => {
      element.addEventListener(event, handler);
    });
  }

  scrollContainer.addEventListener("scroll", handleScroll);

  addEventListeners(swipeContainer, ["touchstart", "mousedown"], handleStart);
  addEventListeners(swipeContainer, ["touchend", "mouseup"], (event) =>
    handleEnd(event)
  );

  addEventListeners(headerContainer, ["touchstart", "mousedown"], handleStart);
  addEventListeners(headerContainer, ["touchend", "mouseup"], (event) =>
    handleEnd(event, true)
  );

  addEventListeners(
    accountsListContainer,
    ["touchstart"],
    handleAccountsListStart
  );
  addEventListeners(accountsListContainer, ["touchend"], handleAccountsListEnd);
  addEventListeners(
    accountsListContainer,
    ["mousedown"],
    handleAccountsListStart
  );
  addEventListeners(accountsListContainer, ["mouseup"], handleAccountsListEnd);
});
