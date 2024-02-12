document.addEventListener("DOMContentLoaded", function () {
  var headerTemplate = document.querySelector(".header-template");
  var headerTitle = document.querySelector(".header-title");

  function toggleBoxShadow() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 0) {
      headerTemplate.classList.add("box-shadow-active");
      headerTitle.style.transition = "color 0.3s ease";
      headerTitle.style.color = "var(--cor-12)";
    } else {
      headerTemplate.classList.remove("box-shadow-active");
      headerTitle.style.transition = "color 0.3s ease";
      headerTitle.style.color = "var(--cor-0)";
    }
  }

  // Chama função toggleBoxShadow no carregamento inicial da página
  toggleBoxShadow();

  window.addEventListener("scroll", function () {
    toggleBoxShadow();
  });
});
