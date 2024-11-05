document.addEventListener("DOMContentLoaded", function () {
  var elementsToScale = document.querySelectorAll(
    ".nav, .header-menu, .header-notification, .header-search"
  );
  var headerContainers1 = document.querySelectorAll(
    ".container-abas-template-header"
  );
  var headerContainers2 = document.querySelectorAll(
    ".container-template-header"
  );
  var sidenavElement = document.querySelector(".main-sidenav");
  var navElement = document.querySelector(".nav");
  var bodyTemplate = document.querySelector(".body-template");

  var originalStyles = {};

  function saveOriginalStyles() {
    for (var i = 0; i < elementsToScale.length; i++) {
      var element = elementsToScale[i];
      originalStyles["elementsToScale_" + i] = {
        transform: element.style.transform || "",
      };
    }

    for (var i = 0; i < headerContainers1.length; i++) {
      var container = headerContainers1[i];
      originalStyles["headerContainers1_" + i] = {
        padding: container.style.padding || "",
      };
    }

    for (var i = 0; i < headerContainers2.length; i++) {
      var container = headerContainers2[i];
      originalStyles["headerContainers2_" + i] = {
        padding: container.style.padding || "",
      };
    }

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
    for (var i = 0; i < elementsToScale.length; i++) {
      var element = elementsToScale[i];
      element.style.transform =
        originalStyles["elementsToScale_" + i].transform;
    }

    for (var i = 0; i < headerContainers1.length; i++) {
      var container = headerContainers1[i];
      container.style.padding =
        originalStyles["headerContainers1_" + i].padding;
    }

    for (var i = 0; i < headerContainers2.length; i++) {
      var container = headerContainers2[i];
      container.style.padding =
        originalStyles["headerContainers2_" + i].padding;
    }

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
    var scrollTop = this.scrollTop;

    if (scrollTop > 0) {
      for (var i = 0; i < elementsToScale.length; i++) {
        var element = elementsToScale[i];
        element.style.transform = "scale(0.95, 0.9)";
      }

      for (var i = 0; i < headerContainers1.length; i++) {
        var container = headerContainers1[i];
        container.style.padding = "0";
      }

      for (var i = 0; i < headerContainers2.length; i++) {
        var container = headerContainers2[i];
        container.style.padding = "0";
      }

      if (sidenavElement) {
        sidenavElement.style.top = "2.23rem";
      }

      if (navElement) {
        navElement.style.width = "320px";
        navElement.style.transform = "scale(0.95, 0.9)";
      }

      bodyTemplate.style.gridTemplateRows = "2.5rem 1fr";
    } else {
      restoreOriginalStyles();
    }
  }

  // Função de debounce
  function debounce(fn, delay) {
    var timer;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // Versão com debounce da função adjustScalePaddingTopAndNav
  var adjustScalePaddingTopAndNavDebounced = debounce(
    adjustScalePaddingTopAndNav,
    10
  );

  function handleScroll(event) {
    adjustScalePaddingTopAndNavDebounced.call(event.target);
  }

  function handleResponsiveChange(e) {
    var mainElements = document.querySelectorAll(
      ".area-interna-containerContent-template-content"
    );

    if (e.matches) {
      for (var i = 0; i < mainElements.length; i++) {
        var mainElement = mainElements[i];
        if (mainElement.addEventListener) {
          mainElement.addEventListener("scroll", handleScroll);
        } else if (mainElement.attachEvent) {
          mainElement.attachEvent("onscroll", handleScroll);
        }
      }
    } else {
      for (var i = 0; i < mainElements.length; i++) {
        var mainElement = mainElements[i];
        if (mainElement.removeEventListener) {
          mainElement.removeEventListener("scroll", handleScroll);
        } else if (mainElement.detachEvent) {
          mainElement.detachEvent("onscroll", handleScroll);
        }
      }
      restoreOriginalStyles();
    }
  }

  var mediaQuery = window.matchMedia("(max-width: 56.25rem)");
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleResponsiveChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleResponsiveChange);
  }

  saveOriginalStyles();
  handleResponsiveChange(mediaQuery);
});
