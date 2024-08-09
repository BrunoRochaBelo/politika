// Funções de easing comuns
const easingFunctions = {
  linear: function (t) {
    return t;
  },
  easeInQuad: function (t) {
    return t * t;
  },
  easeOutQuad: function (t) {
    return t * (2 - t);
  },
  easeInOutQuad: function (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
};

// Função scrollToTop com suporte a função de easing personalizada
function scrollToTop(element, duration, easing, callback) {
  const startingY = element.scrollTop;
  const startTime = performance.now();
  const easingFunction = easingFunctions[easing] || easingFunctions.linear;

  function scrollStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easing = easingFunction(progress);

    element.scrollTop = startingY * (1 - easing);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    } else if (callback) {
      callback();
    }
  }

  requestAnimationFrame(scrollStep);
}

// Função de throttle para limitar a taxa de execuções
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Função changeSession ajustada para usar scrollToTop com easing
function changeSession(sessionNumber) {
  const sessions = document.querySelectorAll(".session");
  const selectedSession = document.getElementById("secao" + sessionNumber);
  const cards = document.querySelectorAll(".card-session");
  const selectedCard = cards[sessionNumber - 1];
  const areaContent =
    document.querySelector(".container-template-content") ||
    document.querySelector(".container-abas-template-content");

  if (!selectedSession || !areaContent) {
    console.error("Elementos necessários não encontrados.");
    return;
  }

  const selectedHeader = selectedCard.querySelector(
    ".secao-interna-template-header"
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
        const header = card.querySelector(".secao-interna-template-header");
        const arrow = header.querySelector(".arrow");
        header.classList.remove("active-header");
        arrow.classList.remove("up");
        arrow.classList.add("down");
        card.classList.remove("active");
      }
    });

    scrollToTop(areaContent, 300, "easeInOutQuad", function () {
      selectedSession.classList.add("active");
      selectedHeader.classList.add("active-header");
      selectedArrow.classList.remove("down");
      selectedArrow.classList.add("up");
      selectedCard.classList.add("active");
    });
  }
}

// Adicionar throttle à função changeSession
const throttledChangeSession = throttle(changeSession, 100);
