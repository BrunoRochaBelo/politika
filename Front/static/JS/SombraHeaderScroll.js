// Função para atualizar a variável CSS --vh
function setVhVariable() {
  if (window.innerHeight && document.documentElement.style.setProperty) {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
}

// Debounce para otimizar o evento de redimensionamento
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Verificar se addEventListener está disponível
if (window.addEventListener && document.addEventListener) {
  // Atualizar a variável --vh na inicialização e quando a janela é redimensionada
  const setVhVariableDebounced = debounce(setVhVariable, 100);
  window.addEventListener("resize", setVhVariableDebounced);
  document.addEventListener("DOMContentLoaded", setVhVariable);
} else if (window.attachEvent) {
  // Fallback para navegadores mais antigos que usam attachEvent
  window.attachEvent("onresize", setVhVariable);
  document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") {
      setVhVariable();
    }
  });
}

// Chamar a função imediatamente na inicialização
setVhVariable();

// ------------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const mainElement = document.querySelector(
    ".area-interna-containerContent-template-content"
  );

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

  const originalStyles = {};

  function saveOriginalStyles() {
    elementsToScale.forEach((element, index) => {
      originalStyles[`elementsToScale_${index}`] = {
        transform: element.style.transform || "",
      };
    });

    headerContainers1.forEach((container, index) => {
      originalStyles[`headerContainers1_${index}`] = {
        padding: container.style.padding || "",
      };
    });

    headerContainers2.forEach((container, index) => {
      originalStyles[`headerContainers2_${index}`] = {
        padding: container.style.padding || "",
      };
    });

    if (sidenavElement) {
      originalStyles.sidenavElement = {
        top: sidenavElement.style.top || "",
      };
    }

    if (navElement) {
      originalStyles.navElement = {
        width: navElement.style.width || "",
      };
    }

    originalStyles.bodyTemplate = {
      gridTemplateRows: bodyTemplate.style.gridTemplateRows || "",
    };
  }

  function restoreOriginalStyles() {
    elementsToScale.forEach((element, index) => {
      element.style.transform =
        originalStyles[`elementsToScale_${index}`].transform;
    });

    headerContainers1.forEach((container, index) => {
      container.style.padding =
        originalStyles[`headerContainers1_${index}`].padding;
    });

    headerContainers2.forEach((container, index) => {
      container.style.padding =
        originalStyles[`headerContainers2_${index}`].padding;
    });

    if (sidenavElement) {
      sidenavElement.style.top = originalStyles.sidenavElement.top;
    }

    if (navElement) {
      navElement.style.width = originalStyles.navElement.width;
    }

    bodyTemplate.style.gridTemplateRows =
      originalStyles.bodyTemplate.gridTemplateRows;
  }

  function adjustScalePaddingTopAndNav() {
    if (mainElement.scrollTop > 0) {
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
        navElement.style.transform = "scale(0.95, 0.9)"; // Adiciona a transformação de escala para .nav
      }

      bodyTemplate.style.gridTemplateRows = "2.5rem 1fr";
    } else {
      restoreOriginalStyles();
    }
  }

  function handleResponsiveChange(e) {
    if (e.matches) {
      mainElement.addEventListener("scroll", adjustScalePaddingTopAndNav);
      adjustScalePaddingTopAndNav();
    } else {
      mainElement.removeEventListener("scroll", adjustScalePaddingTopAndNav);
      restoreOriginalStyles();
    }
  }

  const mediaQuery = window.matchMedia("(max-width: 56.25rem)");
  mediaQuery.addEventListener("change", handleResponsiveChange);

  saveOriginalStyles();
  handleResponsiveChange(mediaQuery);
});
