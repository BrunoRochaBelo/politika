/* script.js */
document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     0) AOS INIT (Animações ao Scroll)
  ========================================== */
  AOS.init({
    duration: 800, // Duração das animações (ms)
    offset: 100, // Distância antes de iniciar a animação
    once: true, // Anima apenas na primeira vez que o elemento aparece
  });

  /* ==========================================
     1) HEADER FIXO AO ROLAR
  ========================================== */
  /* HEADER FIXO AO ROLAR */
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  /* ==========================================
     2) MENU MOBILE
  ========================================== */
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navList = document.querySelector(".nav-list");

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener("click", () => {
      navList.classList.toggle("active");
    });
  }

  /* ==========================================
     3) TABS DE RECURSOS
  ========================================== */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove 'active' de todos os botões e painéis
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      // Adiciona 'active' no botão clicado
      btn.classList.add("active");
      // Mostra o painel correspondente
      const targetTab = btn.getAttribute("data-tab");
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  /* ==========================================
     4) TROCA DE PREÇO (MENSAL/ANUAL)
  ========================================== */
  const pricingToggle = document.getElementById("pricing-toggle");
  const monthlyValues = document.querySelectorAll(".pricing-value.monthly");
  const yearlyValues = document.querySelectorAll(".pricing-value.yearly");
  const periodSpans = document.querySelectorAll(".pricing-period");

  if (pricingToggle) {
    pricingToggle.addEventListener("change", () => {
      const isYearly = pricingToggle.checked;

      // Alterna valores mensais e anuais
      monthlyValues.forEach((val) => val.classList.toggle("active", !isYearly));
      yearlyValues.forEach((val) => val.classList.toggle("active", isYearly));

      // Atualiza destaque no texto "Mensal" / "Anual"
      periodSpans.forEach((span) => {
        if (isYearly && span.dataset.period === "yearly") {
          span.classList.add("active");
        } else if (!isYearly && span.dataset.period === "monthly") {
          span.classList.add("active");
        } else {
          span.classList.remove("active");
        }
      });
    });
  }

  /* ==========================================
     5) CARROSSEL DE DEPOIMENTOS
  ========================================== */
  const track = document.querySelector(".testimonials-track");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  const testimonials = document.querySelectorAll(".testimonial-card");

  if (track && prevBtn && nextBtn && testimonials.length) {
    let currentIndex = 0;

    const updateSliderPosition = () => {
      // Largura de um card + gap (aprox. 32px)
      const cardWidth = testimonials[0].offsetWidth + 32;
      track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    };

    // Botão Anterior
    prevBtn.addEventListener("click", () => {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = testimonials.length - 1; // Loop
      }
      updateSliderPosition();
    });

    // Botão Próximo
    nextBtn.addEventListener("click", () => {
      currentIndex++;
      if (currentIndex >= testimonials.length) {
        currentIndex = 0; // Loop
      }
      updateSliderPosition();
    });
  }

  /* ==========================================
     6) MODAL (DEMONSTRAÇÃO)
  ========================================== */
  const demoModal = document.getElementById("demoModal");
  const modalClose = document.querySelector(".modal-close");
  const demoLinks = document.querySelectorAll('a[href="#demo"]');
  const floatingCtaButton = document.querySelector(".floating-cta-button");

  function openModal() {
    if (demoModal) {
      demoModal.style.display = "flex";
    }
  }
  function closeModal() {
    if (demoModal) {
      demoModal.style.display = "none";
    }
  }

  // Abre modal ao clicar nos links com href="#demo"
  demoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Abre modal ao clicar no botão flutuante
  if (floatingCtaButton) {
    floatingCtaButton.addEventListener("click", openModal);
  }

  // Fecha modal ao clicar no X
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Fecha modal ao clicar fora do conteúdo
  if (demoModal) {
    demoModal.addEventListener("click", (e) => {
      if (e.target === demoModal) {
        closeModal();
      }
    });
  }

  /* ==========================================
     7) FORMULÁRIOS
  ========================================== */
  // Formulário de Demonstração
  const demoForm = document.getElementById("demoForm");
  if (demoForm) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Aqui você poderia implementar um envio real via fetch/AJAX
      alert("Formulário de demonstração enviado com sucesso!");
      demoForm.reset();
      closeModal();
    });
  }

  // Formulário de Contato
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Aqui você poderia implementar um envio real via fetch/AJAX
      alert("Mensagem de contato enviada!");
      contactForm.reset();
    });
  }

  /* ==========================================
     8) CURSOR PERSONALIZADO (OPCIONAL)
  ========================================== */
  // Cursor customizado (já existente):
  const cursorFx = document.querySelector(".cursor-fx");
  const cursorFxFollower = document.querySelector(".cursor-fx-follower");

  // Verifica se o dispositivo suporta hover (não é touch) antes de exibir o cursor customizado
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    if (cursorFx && cursorFxFollower) {
      // Exibe o cursor customizado
      cursorFx.style.display = "block";
      cursorFxFollower.style.display = "block";

      // Move os cursores
      window.addEventListener("mousemove", (e) => {
        cursorFx.style.top = e.clientY + "px";
        cursorFx.style.left = e.clientX + "px";

        setTimeout(() => {
          cursorFxFollower.style.top = e.clientY + "px";
          cursorFxFollower.style.left = e.clientX + "px";
        }, 40);
      });

      // Animação de clique
      window.addEventListener("mousedown", () => {
        cursorFx.style.transform = "translate(-50%, -50%) scale(0.8)";
        cursorFxFollower.style.transform = "translate(-50%, -50%) scale(1.2)";
      });
      window.addEventListener("mouseup", () => {
        cursorFx.style.transform = "translate(-50%, -50%) scale(1)";
        cursorFxFollower.style.transform = "translate(-50%, -50%) scale(1)";
      });

      // Efeito hover em links e botões
      const interactiveEls = document.querySelectorAll("a, button");
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursorFx.classList.add("hover");
          cursorFxFollower.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
          cursorFx.classList.remove("hover");
          cursorFxFollower.classList.remove("hover");
        });
      });
    }
  } else {
    // Dispositivos que não suportam hover (touch) – esconde o cursor customizado
    if (cursorFx) cursorFx.style.display = "none";
    if (cursorFxFollower) cursorFxFollower.style.display = "none";
  }
});
