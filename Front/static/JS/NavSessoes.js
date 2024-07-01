function scrollToTop(element, duration) {
  const startingY = element.scrollTop;
  const startTime = performance.now();

  function scrollStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easing =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2; // EaseInOutQuad

    element.scrollTop = startingY * (1 - easing);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  return new Promise((resolve) => {
    function animateScroll() {
      requestAnimationFrame(function step(timestamp) {
        scrollStep(timestamp);
        if (element.scrollTop === 0) {
          resolve();
        }
      });
    }

    animateScroll();
  });
}

async function changeSession(sessionNumber) {
  const sessions = document.querySelectorAll(".session");
  const selectedSession = document.getElementById("sessao" + sessionNumber);
  const cards = document.querySelectorAll(".cad-session");
  const selectedCard = cards[sessionNumber - 1]; // Assumindo que a ordem é a mesma
  const areaContent =
    document.querySelector(".area-container-template-content") ||
    document.querySelector(".area-container-abas-template-content");

  const selectedHeader = selectedCard.querySelector(
    ".area-template-sessao-int-header"
  );
  const selectedArrow = selectedHeader.querySelector(".arrow");

  if (selectedSession.classList.contains("active")) {
    selectedSession.classList.remove("active");
    selectedHeader.classList.remove("active-header");
    selectedArrow.classList.remove("up");
    selectedArrow.classList.add("down");
    selectedCard.classList.remove("active");
  } else {
    sessions.forEach(function (session, index) {
      if (session.classList.contains("active")) {
        session.classList.remove("active");
        const card = cards[index];
        const header = card.querySelector(".area-template-sessao-int-header");
        const arrow = header.querySelector(".arrow");
        header.classList.remove("active-header");
        arrow.classList.remove("up");
        arrow.classList.add("down");
        card.classList.remove("active");
      }
    });

    await scrollToTop(areaContent, 300);

    selectedSession.classList.add("active");
    selectedHeader.classList.add("active-header");
    selectedArrow.classList.remove("down");
    selectedArrow.classList.add("up");
    selectedCard.classList.add("active");
  }
}
