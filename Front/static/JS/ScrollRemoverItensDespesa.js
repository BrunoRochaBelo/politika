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

  let touchStartY = 0;
  let touchEndY = 0;
  let mouseDownY = 0;
  let mouseUpY = 0;
  const swipeThreshold = 5;
  let isSwiping = false;

  function handleScroll() {
    const scrollTop = scrollContainer.scrollTop;
    if (scrollTop > 0) hideDashboard();
  }

  function handleTouchStart(event) {
    if (isSwiping) return;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchEnd(event) {
    if (isSwiping) return;
    touchEndY = event.changedTouches[0].clientY;
    const scrollTop = scrollContainer.scrollTop;
    if (scrollTop === 0 && touchEndY - touchStartY > swipeThreshold)
      resetDashboard();
  }

  function handleMouseDown(event) {
    if (isSwiping) return;
    mouseDownY = event.clientY;
  }

  function handleMouseUp(event) {
    if (isSwiping) return;
    mouseUpY = event.clientY;
    const scrollTop = scrollContainer.scrollTop;
    if (scrollTop === 0 && mouseUpY - mouseDownY > swipeThreshold)
      resetDashboard();
  }

  function handleHeaderTouchStart(event) {
    if (isSwiping) return;
    touchStartY = event.touches[0].clientY;
  }

  function handleHeaderTouchEnd(event) {
    if (isSwiping) return;
    touchEndY = event.changedTouches[0].clientY;
    if (touchStartY - touchEndY > swipeThreshold) hideDashboard();
  }

  function handleHeaderMouseDown(event) {
    if (isSwiping) return;
    mouseDownY = event.clientY;
  }

  function handleHeaderMouseUp(event) {
    if (isSwiping) return;
    mouseUpY = event.clientY;
    if (mouseDownY - mouseUpY > swipeThreshold) hideDashboard();
  }

  function handleAccountsListTouchStart(event) {
    isSwiping = true;
  }

  function handleAccountsListTouchEnd(event) {
    isSwiping = false;
  }

  function handleAccountsListMouseDown(event) {
    isSwiping = true;
  }

  function handleAccountsListMouseUp(event) {
    isSwiping = false;
  }

  function updateAvailableValueColor() {
    const percentage = parseFloat(availableValue.textContent);
    if (percentage > 90) {
      availableValue.style.color = "#dc3545";
    } else if (percentage > 70) {
      availableValue.style.color = "#ffc107";
    } else {
      availableValue.style.color = "#28a745";
    }
  }

  function hideDashboard() {
    chartWrapper.classList.add("dashboard-fade-out-down");
    chartCenterText.classList.add("dashboard-fade-out-down");
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
    }, 500);
  }

  function resetDashboard() {
    availableValue.classList.remove("dashboard-fade-in-up");
    availableValue.classList.add("dashboard-fade-out-down");
    setTimeout(() => {
      availableValue.classList.add("dashboard-hidden");
      chartWrapper.classList.remove("dashboard-hidden");
      chartWrapper.classList.remove("dashboard-fade-out-down");
      chartCenterText.classList.remove("dashboard-fade-out-down");
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
    }, 500);
  }

  scrollContainer.addEventListener("scroll", handleScroll);
  swipeContainer.addEventListener("touchstart", handleTouchStart);
  swipeContainer.addEventListener("touchend", handleTouchEnd);
  swipeContainer.addEventListener("mousedown", handleMouseDown);
  swipeContainer.addEventListener("mouseup", handleMouseUp);

  headerContainer.addEventListener("touchstart", handleHeaderTouchStart);
  headerContainer.addEventListener("touchend", handleHeaderTouchEnd);
  headerContainer.addEventListener("mousedown", handleHeaderMouseDown);
  headerContainer.addEventListener("mouseup", handleHeaderMouseUp);

  accountsListContainer.addEventListener(
    "touchstart",
    handleAccountsListTouchStart
  );
  accountsListContainer.addEventListener(
    "touchend",
    handleAccountsListTouchEnd
  );
  accountsListContainer.addEventListener(
    "mousedown",
    handleAccountsListMouseDown
  );
  accountsListContainer.addEventListener("mouseup", handleAccountsListMouseUp);

  updateAvailableValueColor();
});
