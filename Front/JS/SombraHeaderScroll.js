document.addEventListener("DOMContentLoaded", function () {
  var headerTemplate = document.querySelector(".header-template");

  function toggleBoxShadow() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 0) {
      headerTemplate.classList.add("box-shadow-active");
    } else {
      headerTemplate.classList.remove("box-shadow-active");
    }
  }

  window.addEventListener("scroll", function () {
    toggleBoxShadow();
  });
});
