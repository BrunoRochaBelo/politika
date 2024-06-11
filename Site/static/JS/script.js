// script.js
document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll("#como-potencializa ul li h4");
  headers.forEach((header) => {
    header.style.cursor = "pointer";
    header.addEventListener("click", function () {
      const detail = this.nextElementSibling;
      if (detail.style.display === "none" || detail.style.display === "") {
        detail.style.display = "block";
      } else {
        detail.style.display = "none";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const recursoItems = document.querySelectorAll(".recurso-item");

  recursoItems.forEach((item) => {
    item.addEventListener("click", function () {
      const isActive = item.classList.contains("active");

      // Remover classe active de todos os itens
      recursoItems.forEach((i) => i.classList.remove("active"));

      // Se o item clicado não estava ativo, ativá-lo
      if (!isActive) {
        item.classList.add("active");
      }
    });

    item.addEventListener("mouseover", function () {
      item.classList.add("hover");
    });

    item.addEventListener("mouseout", function () {
      item.classList.remove("hover");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleDetails = document.querySelectorAll("#sobre-nos .toggle-details");

  toggleDetails.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const detailContent = this.nextElementSibling;
      detailContent.classList.toggle("visible");
      this.classList.toggle("up");

      if (detailContent.classList.contains("visible")) {
        detailContent.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

let lastScrollTop = 0;

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scroll para baixo
    document.querySelector(".nav-menu").classList.add("hidden");
  } else {
    // Scroll para cima
    document.querySelector(".nav-menu").classList.remove("hidden");
  }

  // Verifica se o scroll é diferente de zero para mudar a cor
  if (currentScroll > 0) {
    document.querySelector(".nav-menu").classList.add("scrolled");
  } else {
    document.querySelector(".nav-menu").classList.remove("scrolled");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Para o caso de scroll no topo da página
});

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu-icon img");
  const menuList = document.querySelector(".menu-list");
  const menuItems = document.querySelectorAll(".menu-list li a");

  // Adiciona um ouvinte de evento de clique ao ícone do menu
  menuIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Impede que o clique no ícone do menu propague para o documento
    menuList.classList.toggle("show-menu");
  });

  // Adiciona um ouvinte de evento de clique ao documento inteiro
  document.addEventListener("click", function (event) {
    // Verifica se o clique ocorreu fora do menu e do ícone do menu
    if (!menuList.contains(event.target) && !menuIcon.contains(event.target)) {
      menuList.classList.remove("show-menu"); // Fecha o menu se o clique foi fora do menu e do ícone do menu
    }
  });

  // Adiciona um ouvinte de evento de clique a cada item do menu
  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener("click", function () {
      menuList.classList.remove("show-menu"); // Fecha o menu ao clicar em um item do menu
    });
  });
});
