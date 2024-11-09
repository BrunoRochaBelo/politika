document.addEventListener("DOMContentLoaded", () => {
  const elementsToScale = document.querySelectorAll(
    ".nav, .header-menu, .header-notification, .header-search"
  );
  const headerContainers1 = document.querySelectorAll(
    ".container-abas-template-header"
  );
  const headerContainers2 = document.querySelectorAll(
    ".container-template-header"
  );
  const sidenavElement = document.querySelector(".main-sidenav");
  const navElement = document.querySelector(".nav");
  const bodyTemplate = document.querySelector(".body-template");
  const mainElements = document.querySelectorAll(
    ".area-interna-containerContent-template-content"
  );
  const originalStyles = new Map();

  const saveOriginalStyles = () => {
    elementsToScale.forEach((element) => {
      originalStyles.set(element, {
        transform: element.style.transform || "",
      });
    });

    headerContainers1.forEach((container) => {
      originalStyles.set(container, {
        padding: container.style.padding || "",
      });
    });

    headerContainers2.forEach((container) => {
      originalStyles.set(container, {
        padding: container.style.padding || "",
      });
    });

    if (sidenavElement) {
      originalStyles.set(sidenavElement, {
        top: sidenavElement.style.top || "",
      });
    }

    if (navElement) {
      originalStyles.set(navElement, {
        width: navElement.style.width || "",
        transform: navElement.style.transform || "",
      });
    }

    if (bodyTemplate) {
      originalStyles.set(bodyTemplate, {
        gridTemplateRows: bodyTemplate.style.gridTemplateRows || "",
      });
    }
  };

  const restoreOriginalStyles = () => {
    originalStyles.forEach((styles, element) => {
      Object.assign(element.style, styles);
    });
  };

  const applyReducedStyles = () => {
    elementsToScale.forEach((element) => {
      element.style.transform = "scale(0.95, 0.9)";
    });

    headerContainers1.forEach((container) => {
      container.style.padding = "0";
    });

    headerContainers2.forEach((container) => {
      container.style.padding = "0";
    });

    if (sidenavElement) {
      sidenavElement.style.top = "2.23rem";
    }

    if (navElement) {
      navElement.style.width = "320px";
      navElement.style.transform = "scale(0.95, 0.9)";
    }

    if (bodyTemplate) {
      bodyTemplate.style.gridTemplateRows = "2.5rem 1fr";
    }
  };

  let isReduced = false;

  const adjustScalePaddingTopAndNav = (scrollTop) => {
    if (scrollTop > 0 && !isReduced) {
      applyReducedStyles();
      isReduced = true;
    }
  };

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

  const handleScroll = throttle((event) => {
    const scrollTop = event.target.scrollTop;
    adjustScalePaddingTopAndNav(scrollTop);
  });

  // Variáveis para interações de toque
  let isTouching = false;
  let touchStartY = 0;
  const pullThreshold = 60;

  const onTouchStart = (e) => {
    isTouching = true;
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (!isTouching) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    if (deltaY > 0 && isReduced && e.target.scrollTop === 0) {
      // Usuário está puxando para baixo no topo
      restoreOriginalStyles();
      isReduced = false;
      e.preventDefault(); // Previne o pull-to-refresh
    }
  };

  const onTouchEnd = () => {
    isTouching = false;
  };

  // Variáveis para interações de mouse
  let isMouseDown = false;
  let mouseStartY = 0;

  const onMouseDown = (e) => {
    isMouseDown = true;
    mouseStartY = e.clientY;
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;

    const currentY = e.clientY;
    const deltaY = currentY - mouseStartY;

    if (deltaY > pullThreshold && isReduced && e.target.scrollTop === 0) {
      // Usuário está puxando para baixo no topo
      restoreOriginalStyles();
      isReduced = false;
    }
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  // Evento 'wheel' para detectar tentativas de rolagem para cima no topo
  const onWheel = (e) => {
    const scrollTop = e.target.scrollTop;

    if (scrollTop === 0 && e.deltaY < 0 && isReduced) {
      // Usuário está tentando rolar para cima no topo
      restoreOriginalStyles();
      isReduced = false;
    }
  };

  const handleResponsiveChange = (e) => {
    if (e.matches) {
      mainElements.forEach((mainElement) => {
        // Prevenir o pull-to-refresh em dispositivos móveis
        mainElement.style.overscrollBehavior = "contain";

        mainElement.addEventListener("scroll", handleScroll, { passive: true });
        mainElement.addEventListener("touchstart", onTouchStart, {
          passive: false,
        });
        mainElement.addEventListener("touchmove", onTouchMove, {
          passive: false,
        });
        mainElement.addEventListener("touchend", onTouchEnd);

        mainElement.addEventListener("mousedown", onMouseDown);
        mainElement.addEventListener("mousemove", onMouseMove);
        mainElement.addEventListener("mouseup", onMouseUp);

        mainElement.addEventListener("wheel", onWheel, { passive: true });
      });
    } else {
      mainElements.forEach((mainElement) => {
        mainElement.style.overscrollBehavior = "";

        mainElement.removeEventListener("scroll", handleScroll);
        mainElement.removeEventListener("touchstart", onTouchStart);
        mainElement.removeEventListener("touchmove", onTouchMove);
        mainElement.removeEventListener("touchend", onTouchEnd);

        mainElement.removeEventListener("mousedown", onMouseDown);
        mainElement.removeEventListener("mousemove", onMouseMove);
        mainElement.removeEventListener("mouseup", onMouseUp);

        mainElement.removeEventListener("wheel", onWheel);
      });
      restoreOriginalStyles();
      isReduced = false;
    }
  };

  const mediaQuery = window.matchMedia("(max-width: 56.25rem)");
  mediaQuery.addEventListener("change", handleResponsiveChange);

  saveOriginalStyles();
  handleResponsiveChange(mediaQuery);
});
