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

  let isMobile = window.innerWidth <= 768;

  // Função para determinar o heightOffset com base no tamanho da tela
  const updateHeightOffset = () => {
    document.documentElement.style.setProperty(
      "--height-offset",
      isMobile ? "1.5rem" : "2rem"
    );
  };

  // Inicializa o heightOffset
  updateHeightOffset();

  // Função para adicionar ou remover o estado compacto
  const setCompact = (compact) => {
    if (compact) {
      containerHeader.classList.add("compact");
      mainContainer.classList.add("compact");
    } else {
      containerHeader.classList.remove("compact");
      mainContainer.classList.remove("compact");
    }
  };

  // Função para verificar se o contêiner está scrollado
  const isScrolled = () => containerContent.scrollTop > 0;

  // Função para atualizar o layout com throttle
  const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const updateLayout = () => {
    if (isScrolled()) {
      setCompact(true);
    } else {
      setCompact(false);
    }
  };

  const throttledUpdateLayout = throttle(updateLayout, 100);

  // Adiciona o listener de scroll com throttle
  containerContent.addEventListener("scroll", throttledUpdateLayout, {
    passive: true,
  });

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

    if (deltaY > pullThreshold && containerContent.scrollTop === 0) {
      // Usuário está puxando para baixo no topo
      setCompact(false);
      isTouching = false;
      e.preventDefault(); // Previne o pull-to-refresh
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

    if (deltaY < -pullThreshold) {
      // Usuário está puxando para cima
      setCompact(true);
      isMouseDown = false;
    } else if (deltaY > pullThreshold && containerContent.scrollTop === 0) {
      // Usuário está puxando para baixo no topo
      setCompact(false);
      isMouseDown = false;
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

  // Função para lidar com o evento 'wheel'
  const onWheel = (e) => {
    if (e.deltaY < 0 && containerContent.scrollTop === 0) {
      // Usuário está rolando para cima no topo (puxando para baixo o conteúdo)
      accumulatedDeltaY += e.deltaY; // deltaY é negativo quando rolando para cima

      if (accumulatedDeltaY <= -wheelThreshold) {
        // Remover classe 'compact'
        setCompact(false);
        accumulatedDeltaY = 0;
      }
    } else if (e.deltaY > 0) {
      // Usuário está rolando para baixo (puxando para cima o conteúdo)
      accumulatedDeltaY += e.deltaY; // deltaY é positivo quando rolando para baixo

      if (accumulatedDeltaY >= wheelThreshold) {
        // Adicionar classe 'compact'
        setCompact(true);
        accumulatedDeltaY = 0;
      }
    } else {
      // Resetar accumulatedDeltaY se o usuário não estiver rolando
      accumulatedDeltaY = 0;
    }
  };

  containerContent.addEventListener("wheel", onWheel, { passive: true });

  // Função para atualizar o estado mobile e recalcular heightOffset
  const handleResize = throttle(() => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      updateHeightOffset();
      // Opcional: Atualizar o layout caso necessário
      updateLayout();
    }
  }, 200);

  // Adiciona listener para resize com throttle
  window.addEventListener("resize", handleResize);

  // Inicializa o layout ao carregar a página
  updateLayout();
});
