document.addEventListener("DOMContentLoaded", function () {
  var headerTemplate = document.querySelector(".header-template");
  var headerBack = document.querySelector(".header-back");
  var headerSearch = document.querySelector(".search-input");
  var headerSearchElement = document.querySelector(".header-search");

  function toggleBoxShadow(headerElement, shadowClass, textColorVar) {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 15) {
      headerElement.classList.add(shadowClass);
      headerSearchElement.style.transition = "color 0.3s ease";
      headerSearchElement.style.color = textColorVar;
    } else {
      headerElement.classList.remove(shadowClass);
      headerSearchElement.style.transition = "color 0.3s ease";
      headerSearchElement.style.color = textColorVar;
    }
  }

  // Chama a função toggleBoxShadow no carregamento inicial da página para cada elemento
  toggleBoxShadow(headerTemplate, "box-shadow-active", "var(--cor-12)");
  toggleBoxShadow(headerSearch, "scroll-active", "var(--cor-12)");

  window.addEventListener("scroll", function () {
    toggleBoxShadow(headerTemplate, "box-shadow-active", "var(--cor-6)");
    toggleBoxShadow(headerSearch, "scroll-active", "var(--cor-6)");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var homeHeaderTemplate = document.querySelector(".home-header-template");
  var homeHeaderTitle = document.querySelector(".home-header-title");

  function toggleBoxShadow() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 15) {
      homeHeaderTemplate.classList.add("box-shadow-active");
      homeHeaderTitle.style.transition = "color 0.3s ease";
      homeHeaderTitle.style.color = "var(--cor-12)";
    } else {
      homeHeaderTemplate.classList.remove("box-shadow-active");
      homeHeaderTitle.style.transition = "color 0.3s ease";
      homeHeaderTitle.style.color = "var(--cor-0)";
    }
  }

  // Chama função toggleBoxShadow no carregamento inicial da página
  toggleBoxShadow();

  window.addEventListener("scroll", function () {
    toggleBoxShadow();
  });
});
