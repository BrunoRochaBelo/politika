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

      // Adiciona 'active' no botão clicado e exibe o painel correspondente
      btn.classList.add("active");
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
  (() => {
    const track = document.querySelector(".testimonials-track");
    const prevBtn = document.querySelector(".nav-btn.prev");
    const nextBtn = document.querySelector(".nav-btn.next");
    const testimonials = document.querySelectorAll(".testimonial-card");

    if (!track || !prevBtn || !nextBtn || testimonials.length === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    const gap = 32; // confere se esse valor bate com o definido no CSS
    let cardWidth = testimonials[0].offsetWidth + gap; // usamos let pra atualizar conforme a tela muda

    // Atualiza a posição do slider, com ou sem animação
    const updateSliderPosition = (animate = true) => {
      track.style.transition = animate ? "transform 0.3s ease" : "none";
      track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    };

    // Recalcula o cardWidth sempre que a tela for redimensionada
    window.addEventListener("resize", () => {
      cardWidth = testimonials[0].offsetWidth + gap;
      updateSliderPosition(false);
    });

    // Eventos dos botões de navegação
    prevBtn.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateSliderPosition();
    });
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateSliderPosition();
    });

    // Funções para arrastar
    const onDragStart = (e) => {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      updateSliderPosition(false);
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX);
      const diff = currentX - startX;
      track.style.transform = `translateX(${
        -currentIndex * cardWidth + diff
      }px)`;
    };

    const onDragEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX =
        e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
      const diff = endX - startX;
      // Se o arrasto for maior que 50px, muda o índice
      if (Math.abs(diff) > 50) {
        currentIndex =
          diff < 0
            ? (currentIndex + 1) % testimonials.length
            : (currentIndex - 1 + testimonials.length) % testimonials.length;
      }
      updateSliderPosition();
    };

    // Suporte para pointer events, touch e mouse
    if (window.PointerEvent) {
      track.addEventListener("pointerdown", onDragStart);
      track.addEventListener("pointermove", onDragMove);
      track.addEventListener("pointerup", onDragEnd);
      track.addEventListener("pointercancel", onDragEnd);
    } else {
      track.addEventListener("mousedown", onDragStart);
      track.addEventListener("mousemove", onDragMove);
      track.addEventListener("mouseup", onDragEnd);
      track.addEventListener("mouseleave", onDragEnd);
      track.addEventListener("touchstart", onDragStart);
      track.addEventListener("touchmove", onDragMove);
      track.addEventListener("touchend", onDragEnd);
    }

    // Inicializa o slider
    updateSliderPosition();
  })();

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

  // Fecha modal ao clicar no X ou fora do conteúdo
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
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
      alert("Mensagem de contato enviada!");
      contactForm.reset();
    });
  }

  /* ==========================================
     8) CURSOR PERSONALIZADO
  ========================================== */
  const cursorFx = document.querySelector(".cursor-fx");
  const cursorFxFollower = document.querySelector(".cursor-fx-follower");

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
    if (cursorFx) cursorFx.style.display = "none";
    if (cursorFxFollower) cursorFxFollower.style.display = "none";
  }

  /* ==========================================
     9) EFEITO 3D NO HERO (IMAGEM E ELEMENTOS FLUTUANTES)
  ========================================== */
  const container = document.querySelector(".hero-image-container");
  if (container) {
    const animatedDashboard = container.querySelector(".animated-dashboard");
    const floatingElements = container.querySelectorAll(".floating-element");

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;

      // Calcula rotação leve (máx de 5 graus)
      const rotateY = ((offsetX - halfWidth) / halfWidth) * 5;
      const rotateX = -((offsetY - halfHeight) / halfHeight) * 5;

      if (animatedDashboard) {
        animatedDashboard.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }

      // Aplica movimento parallax nos elementos flutuantes
      floatingElements.forEach((el) => {
        el.style.transform = `translate3d(${rotateY * 2}px, ${
          rotateX * 2
        }px, 0)`;
      });
    });

    container.addEventListener("mouseleave", () => {
      if (animatedDashboard) {
        animatedDashboard.style.transform = "";
      }
      floatingElements.forEach((el) => {
        el.style.transform = "";
      });
    });
  }
});

/* ==========================================
     10) Galeria FEATURES
  ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab-panel").forEach((tabPanel) => {
    const images = tabPanel.querySelectorAll(".slider-image");
    const featureItems = tabPanel.querySelectorAll(".feature-list li");
    const indicatorItems = tabPanel.querySelectorAll(
      ".slider-indicator .indicator-item"
    );

    const prevBtn = tabPanel.querySelector(".prev-btn");
    const nextBtn = tabPanel.querySelector(".next-btn");

    let currentIndex = 0;

    // Atualiza slide e destaca elementos correspondentes
    function updateSlide(index) {
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
      featureItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
        const h4 = item.querySelector("h4");
        if (h4) h4.classList.toggle("highlighted", i === index);
      });
      indicatorItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlide(currentIndex);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide(currentIndex);
      });
    }

    // Código de drag/swipe com Pointer Events
    const slider = tabPanel.querySelector(".image-slider");
    if (slider) {
      let isDragging = false;
      let startX = 0;

      slider.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX;
        slider.setPointerCapture(e.pointerId);
      });

      slider.addEventListener("pointerup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        let endX = e.clientX;
        handleSwipe(startX, endX);
        slider.releasePointerCapture(e.pointerId);
      });

      slider.addEventListener("pointercancel", (e) => {
        isDragging = false;
        slider.releasePointerCapture(e.pointerId);
      });

      function handleSwipe(start, end) {
        const diff = start - end;
        if (Math.abs(diff) > 50) {
          // limiar para considerar swipe
          if (diff > 0) {
            currentIndex = (currentIndex + 1) % images.length;
          } else {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
          }
          updateSlide(currentIndex);
        }
      }
    }

    // Exibe o primeiro slide na inicialização
    updateSlide(currentIndex);
  });
});

/* ==========================================
     11) Animação Botão Flutuante
  ========================================== */
document.addEventListener("DOMContentLoaded", function () {
  const ctaButton = document.querySelector(".floating-cta-button");
  const ctaText = document.querySelector(".floating-cta-button .text");

  let lastTriggerScrollY = window.scrollY;
  const scrollDeltaThreshold = 15; // sensibilidade do scroll
  const mobileBreakpoint = 768; // efeito só para telas menores que 768px

  // Função pra minimizar (ocultar) o texto e ajustar o botão
  function minimize() {
    if (!ctaButton.classList.contains("minimized")) {
      ctaButton.classList.add("minimized");
    }
  }

  // Função pra restaurar o botão ao estado completo
  function restore() {
    if (ctaButton.classList.contains("minimized")) {
      ctaButton.classList.remove("minimized");
      if (window.getComputedStyle(ctaText).display === "none") {
        ctaText.style.display = "inline-block";
        void ctaText.offsetWidth;
      }
    }
  }

  // Ao término da transição do texto, se minimizado, define display none
  ctaText.addEventListener("transitionend", function (event) {
    if (
      event.propertyName === "transform" &&
      ctaButton.classList.contains("minimized") &&
      getComputedStyle(ctaText).opacity === "0"
    ) {
      ctaText.style.display = "none";
    }
  });

  window.addEventListener("scroll", function () {
    // Se estiver em telas maiores, sempre restaura o botão
    if (window.innerWidth >= mobileBreakpoint) {
      restore();
      lastTriggerScrollY = window.scrollY;
      return;
    }

    const currentScrollY = window.scrollY;

    // Se o scroll estiver zerado (topo), restaura o botão
    if (currentScrollY === 0) {
      restore();
      lastTriggerScrollY = currentScrollY;
    }
    // Se rolou pra baixo mais que o threshold, minimiza o botão
    else if (currentScrollY - lastTriggerScrollY > scrollDeltaThreshold) {
      minimize();
      lastTriggerScrollY = currentScrollY;
    }
    // Se o usuário rolar para cima, mas sem chegar ao topo, mantém o estado minimizado
    else {
      lastTriggerScrollY = currentScrollY;
    }
  });

  // Opcional: ao redimensionar a tela, força a restauração se sair do mobile
  window.addEventListener("resize", function () {
    if (window.innerWidth >= mobileBreakpoint) {
      restore();
    }
  });
});
