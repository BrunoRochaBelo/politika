document.addEventListener("DOMContentLoaded", () => {
  const mediaQuery = window.matchMedia("(max-width: 56.25rem)"); // 900px
  const bodyTemplate = document.querySelector(".body-template");
  const mainElements = document.querySelectorAll(
    ".area-interna-containerContent-template-content"
  );

  let isReduced = false;

  // Thresholds
  const MOUSE_PULL_THRESHOLD = 160;
  const TOUCH_PULL_THRESHOLD = 200; // Aumentado para reduzir sensibilidade

  // Função para adicionar ou remover a classe 'reduced'
  const handleReducedState = (reduce) => {
    if (reduce) {
      bodyTemplate.classList.add("reduced");
    } else {
      bodyTemplate.classList.remove("reduced");
    }
    isReduced = reduce;
  };

  // Função throttle usando requestAnimationFrame
  const throttle = (callback) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback(...args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  // Função para ajustar o estado baseado no scroll
  const adjustStateOnScroll = (scrollTop) => {
    if (scrollTop > 0 && !isReduced) {
      handleReducedState(true);
    }
  };

  // Callback de scroll com throttle
  const handleScroll = throttle((event) => {
    const scrollTop = event.target.scrollTop;
    adjustStateOnScroll(scrollTop);
  });

  // Variáveis para interações de toque
  let isTouching = false;
  let touchStartY = 0;

  // Funções para eventos de toque
  const onTouchStart = (e) => {
    isTouching = true;
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (!isTouching) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    // Verifica se o usuário está puxando para baixo
    if (
      deltaY > TOUCH_PULL_THRESHOLD &&
      isReduced &&
      e.target.scrollTop === 0
    ) {
      handleReducedState(false);
      isTouching = false;
      e.preventDefault(); // Previne o pull-to-refresh
    }
  };

  const onTouchEnd = () => {
    isTouching = false;
  };

  // Variáveis para interações de mouse
  let isMouseDown = false;
  let mouseStartY = 0;

  // Funções para eventos de mouse
  const onMouseDown = (e) => {
    isMouseDown = true;
    mouseStartY = e.clientY;
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;

    const currentY = e.clientY;
    const deltaY = currentY - mouseStartY;

    // Puxando para baixo
    if (
      deltaY > MOUSE_PULL_THRESHOLD &&
      isReduced &&
      e.target.scrollTop === 0
    ) {
      handleReducedState(false);
      isMouseDown = false;
    }
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  // Função para eventos de wheel
  const onWheel = (e) => {
    const scrollTop = e.target.scrollTop;

    if (scrollTop === 0 && e.deltaY < 0 && isReduced) {
      handleReducedState(false);
    }
  };

  // Função para adicionar event listeners
  const addEventListeners = (mainElement) => {
    mainElement.style.overscrollBehavior = "contain";

    mainElement.addEventListener("scroll", handleScroll, { passive: true });
    mainElement.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    mainElement.addEventListener("touchmove", onTouchMove, { passive: false });
    mainElement.addEventListener("touchend", onTouchEnd);

    mainElement.addEventListener("mousedown", onMouseDown);
    mainElement.addEventListener("mousemove", onMouseMove);
    mainElement.addEventListener("mouseup", onMouseUp);

    mainElement.addEventListener("wheel", onWheel, { passive: true });
  };

  // Função para remover event listeners
  const removeEventListeners = (mainElement) => {
    mainElement.style.overscrollBehavior = "";

    mainElement.removeEventListener("scroll", handleScroll);
    mainElement.removeEventListener("touchstart", onTouchStart);
    mainElement.removeEventListener("touchmove", onTouchMove);
    mainElement.removeEventListener("touchend", onTouchEnd);

    mainElement.removeEventListener("mousedown", onMouseDown);
    mainElement.removeEventListener("mousemove", onMouseMove);
    mainElement.removeEventListener("mouseup", onMouseUp);

    mainElement.removeEventListener("wheel", onWheel);
  };

  // Função para lidar com mudanças na media query
  const handleResponsiveChange = (e) => {
    if (e.matches) {
      mainElements.forEach(addEventListeners);
    } else {
      mainElements.forEach(removeEventListeners);
      handleReducedState(false); // Garante que o estado seja resetado
    }
  };

  // Adiciona o listener para mudanças na media query
  mediaQuery.addEventListener("change", handleResponsiveChange);

  // Inicializa o estado com base na media query atual
  handleResponsiveChange(mediaQuery);
});
