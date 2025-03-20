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
     8) CURSOR PERSONALIZADO (OPCIONAL)
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
   9) PARALLAX SCROLL FOR HIGHLIGHT SECTION - RESPONSIVO CALIBRADO
========================================== */
  const parallaxHighlight = document.getElementById("parallax-highlight");
  if (parallaxHighlight) {
    const updateParallax = () => {
      let factor;
      // Em telas muito pequenas, efeito quase imperceptível
      if (window.innerWidth < 768) {
        factor = 0.05;
      }
      // Em telas intermediárias, efeito sutil
      else if (window.innerWidth < 1024) {
        factor = 0.1;
      }
      // Em desktops, efeito padrão
      else {
        factor = 0.3;
      }

      const sectionTop = parallaxHighlight.offsetTop;
      const scrollY = window.pageYOffset;
      const relativeScroll = scrollY - sectionTop;

      // Mantém a imagem centralizada e aplica o deslocamento calculado
      parallaxHighlight.style.backgroundPosition = `center calc(50% + ${
        -relativeScroll * factor
      }px)`;
    };

    window.addEventListener("scroll", updateParallax);
    window.addEventListener("resize", updateParallax);
    updateParallax();
  }

  /* ==========================================
     10) EFEITO 3D NO HERO (IMAGEM E ELEMENTOS FLUTUANTES)
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

// Galeria FEATURES
document.addEventListener("DOMContentLoaded", () => {
  // Para cada .tab-panel (Planejamento, Comunicação, etc.)
  document.querySelectorAll(".tab-panel").forEach((tabPanel) => {
    // Pega as imagens do mini-slider
    const images = tabPanel.querySelectorAll(".slider-image");
    // Pega cada <li> da feature-list (onde está o h4)
    const featureItems = tabPanel.querySelectorAll(".feature-list li");

    // Botões de navegação (pode ser null se não existirem)
    const prevBtn = tabPanel.querySelector(".prev-btn");
    const nextBtn = tabPanel.querySelector(".next-btn");

    let currentIndex = 0; // Começamos na imagem 0

    // Função que atualiza a imagem ativa e o destaque no h4
    function updateSlide(index) {
      // Atualiza imagens
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
      // Atualiza destaque no h4 correspondente
      featureItems.forEach((item, i) => {
        const h4 = item.querySelector("h4");
        if (h4) {
          h4.classList.toggle("highlighted", i === index);
        }
      });
    }

    // Clique no botão "Anterior"
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlide(currentIndex);
      });
    }

    // Clique no botão "Próximo"
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide(currentIndex);
      });
    }

    // Inicia exibindo a imagem e h4 correspondentes ao índice 0
    updateSlide(currentIndex);
  });
});
