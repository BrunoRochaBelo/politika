document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const chartWrapper = document.querySelector(".chart-wrapper");
  const chartCenterText = document.querySelector(".chart-center-text");
  const availableValue = document.querySelector("#available-value");
  const accountsList = document.querySelector("#accounts-list");
  const progressBars = document.querySelectorAll(".progress-bar-wrapper");

  let lastScrollTop = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  function handleScroll() {
    const scrollTop = scrollContainer.scrollTop;

    if (scrollTop > 0) {
      chartWrapper.classList.add("dashboard-fade-out");
      chartCenterText.classList.add("dashboard-fade-out");
      availableValue.classList.remove("dashboard-hidden");
      accountsList.classList.add("horizontal-list");
      progressBars.forEach((bar) => bar.classList.add("dashboard-hidden"));
      setTimeout(() => {
        chartWrapper.classList.add("dashboard-hidden");
        availableValue.classList.add("dashboard-fade-in");
      }, 500);
    }
  }

  function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchEnd(event) {
    touchEndY = event.changedTouches[0].clientY;
    const scrollTop = scrollContainer.scrollTop;

    if (scrollTop === 0 && touchEndY > touchStartY) {
      availableValue.classList.remove("dashboard-fade-in");
      availableValue.classList.add("dashboard-fade-out");
      setTimeout(() => {
        availableValue.classList.add("dashboard-hidden");
        chartWrapper.classList.remove("dashboard-hidden");
        chartWrapper.classList.remove("dashboard-fade-out");
        chartCenterText.classList.remove("dashboard-fade-out");
        accountsList.classList.remove("horizontal-list");
        progressBars.forEach((bar) => bar.classList.remove("dashboard-hidden"));
      }, 500);
    }
  }

  scrollContainer.addEventListener("scroll", handleScroll);
  scrollContainer.addEventListener("touchstart", handleTouchStart);
  scrollContainer.addEventListener("touchend", handleTouchEnd);
});
