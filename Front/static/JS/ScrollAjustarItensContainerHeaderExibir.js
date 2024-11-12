document.addEventListener("DOMContentLoaded", () => {
  // Seleção dos elementos do DOM
  const containerContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const containerHeader = document.querySelector(
    ".area-interna-containerContent-template-header"
  );
  const mainContainer = document.querySelector(
    ".main-exibir .container-template-content .area-interna-containerContent-template"
  );

  if (!containerContent || !containerHeader || !mainContainer) {
    return; // Encerra o script se os elementos não existirem
  }

  let ticking = false;
  let isMobile = window.innerWidth <= 768;

  // Função para obter o offset de altura baseado no estado mobile
  const getHeightOffset = () => (isMobile ? "1.5rem" : "2rem");

  // Função para atualizar o layout com base na rolagem
  const updateLayout = () => {
    const isScrolled = containerContent.scrollTop > 0;
    const heightOffset = getHeightOffset();

    if (isScrolled) {
      if (!containerHeader.classList.contains("compact")) {
        containerHeader.classList.add("compact");
        mainContainer.style.height = `calc(var(--vh, 1vh) * 100 - ${heightOffset})`;
        mainContainer.style.transition = "height 0.5s ease-in-out";
      }
    }

    ticking = false;
  };

  // Função de callback para o evento de scroll utilizando requestAnimationFrame
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateLayout);
      ticking = true;
    }
  };

  // Adiciona o listener de scroll com opção passive
  containerContent.addEventListener("scroll", onScroll, { passive: true });

  // Variáveis para rastrear interações de toque
  let isTouching = false;
  let touchStartY = 0;
  const pullThreshold = 160;

  // Função para lidar com touchstart
  const onTouchStart = (e) => {
    isTouching = true;
    touchStartY = e.touches[0].clientY;
  };

  // Função para lidar com touchmove
  const onTouchMove = (e) => {
    if (!isTouching) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    if (deltaY > 0 && containerContent.scrollTop === 0) {
      // Usuário está puxando para baixo no topo
      if (deltaY > pullThreshold) {
        // Remover classe 'compact' e redefinir o tamanho
        containerHeader.classList.remove("compact");
        mainContainer.style.height = "";
        mainContainer.style.transition = "";
      }
      // Prevenir pull-to-refresh
      e.preventDefault();
    }
  };

  // Função para lidar com touchend
  const onTouchEnd = () => {
    isTouching = false;
  };

  // Adiciona event listeners de toque
  containerContent.addEventListener("touchstart", onTouchStart, {
    passive: false,
  });
  containerContent.addEventListener("touchmove", onTouchMove, {
    passive: false,
  });
  containerContent.addEventListener("touchend", onTouchEnd);

  // Variáveis para rastrear interações de mouse
  let isMouseDown = false;
  let mouseStartY = 0;

  // Função para lidar com mousedown
  const onMouseDown = (e) => {
    isMouseDown = true;
    mouseStartY = e.clientY;
  };

  // Função para lidar com mousemove
  const onMouseMove = (e) => {
    if (!isMouseDown) return;

    const currentY = e.clientY;
    const deltaY = currentY - mouseStartY;

    if (deltaY < 0) {
      // Usuário está puxando para cima
      if (deltaY < -pullThreshold) {
        // Adicionar classe 'compact' e ajustar o tamanho
        if (!containerHeader.classList.contains("compact")) {
          containerHeader.classList.add("compact");
          const heightOffset = getHeightOffset();
          mainContainer.style.height = `calc(var(--vh, 1vh) * 100 - ${heightOffset})`;
          mainContainer.style.transition = "height 0.5s ease-in-out";
        }
      }
    } else if (deltaY > 0 && containerContent.scrollTop === 0) {
      // Usuário está puxando para baixo no topo
      if (deltaY > pullThreshold) {
        // Remover classe 'compact' e redefinir o tamanho
        containerHeader.classList.remove("compact");
        mainContainer.style.height = "";
        mainContainer.style.transition = "";
      }
    }
  };

  // Função para lidar com mouseup
  const onMouseUp = () => {
    isMouseDown = false;
  };

  // Adiciona event listeners de mouse
  containerContent.addEventListener("mousedown", onMouseDown);
  containerContent.addEventListener("mousemove", onMouseMove);
  containerContent.addEventListener("mouseup", onMouseUp);

  // Variável para acumular deltaY no evento 'wheel'
  let accumulatedDeltaY = 0;
  const wheelThreshold = 120; // Threshold para scroll

  // Adiciona listener para o evento 'wheel' para detectar tentativas de rolagem
  const onWheel = (e) => {
    if (e.deltaY < 0 && containerContent.scrollTop === 0) {
      // Usuário está rolando para cima no topo (puxando para baixo o conteúdo)
      accumulatedDeltaY += e.deltaY; // deltaY é negativo quando rolando para cima

      if (accumulatedDeltaY <= -wheelThreshold) {
        // Remover classe 'compact' e redefinir o tamanho
        containerHeader.classList.remove("compact");
        mainContainer.style.height = "";
        mainContainer.style.transition = "";

        // Resetar accumulatedDeltaY
        accumulatedDeltaY = 0;
      }
      // Não prevenir o comportamento padrão aqui
    } else if (e.deltaY > 0) {
      // Usuário está rolando para baixo (puxando para cima o conteúdo)
      accumulatedDeltaY += e.deltaY; // deltaY é positivo quando rolando para baixo

      if (accumulatedDeltaY >= wheelThreshold) {
        // Adicionar classe 'compact' e ajustar o tamanho
        if (!containerHeader.classList.contains("compact")) {
          containerHeader.classList.add("compact");
          const heightOffset = getHeightOffset();
          mainContainer.style.height = `calc(var(--vh, 1vh) * 100 - ${heightOffset})`;
          mainContainer.style.transition = "height 0.5s ease-in-out";
        }

        // Resetar accumulatedDeltaY
        accumulatedDeltaY = 0;
      }
      // Não prevenir o comportamento padrão aqui
    } else {
      // Resetar accumulatedDeltaY se o usuário não estiver rolando
      accumulatedDeltaY = 0;
    }
    // Permitir o comportamento padrão de scroll
  };

  containerContent.addEventListener("wheel", onWheel, { passive: true });

  // Usa ResizeObserver para detectar mudanças no tamanho da janela
  const resizeObserver = new ResizeObserver(() => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      updateLayout();
    }
  });

  resizeObserver.observe(document.body);

  // Inicializa o layout ao carregar a página
  updateLayout();
});
