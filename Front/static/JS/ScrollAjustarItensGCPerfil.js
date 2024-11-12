document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.querySelector(
    ".container-abas-template-header"
  );
  const profileImage = document.querySelector(".img-perfil");
  const navElement = document.querySelector(
    ".container-abas-template-header .nav"
  );
  const cardSessionContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );
  const mainContainer = document.querySelector(
    ".main-gc .area-interna-containerContent-template"
  );

  // Armazenar estilos originais
  const originalStyles = {
    profileImageWidth: profileImage ? profileImage.style.width || "" : "",
    profileImageHeight: profileImage ? profileImage.style.height || "" : "",
    profileImageMarginBottom: profileImage
      ? profileImage.style.marginBottom || ""
      : "",
    navElementTransform: navElement ? navElement.style.transform || "" : "",
    mainContainerMaxHeight: mainContainer
      ? mainContainer.style.maxHeight || ""
      : "",
    headerContainerPadding: headerContainer
      ? headerContainer.style.padding || ""
      : "",
  };

  // Função para restaurar os estilos originais
  const restoreOriginalStyles = () => {
    if (profileImage) {
      profileImage.style.width = originalStyles.profileImageWidth;
      profileImage.style.height = originalStyles.profileImageHeight;
      profileImage.style.marginBottom = originalStyles.profileImageMarginBottom;
    }
    if (navElement)
      navElement.style.transform = originalStyles.navElementTransform;
    if (mainContainer)
      mainContainer.style.maxHeight = originalStyles.mainContainerMaxHeight;
    if (headerContainer)
      headerContainer.style.padding = originalStyles.headerContainerPadding;
  };

  // Função para aplicar os estilos ajustados
  const applyAdjustedStyles = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 900) {
      // Para telas menores (até 56.25rem ou 900px)
      if (profileImage) {
        profileImage.style.width = "60px";
        profileImage.style.height = "60px";
        profileImage.style.marginBottom = "0"; // Remove a margin-bottom
      }
      if (navElement) navElement.style.transform = "scale(0.85)";
      if (mainContainer)
        mainContainer.style.maxHeight =
          "calc(var(--vh, 1vh) * 100 - 11.285rem) !important";
      if (headerContainer) headerContainer.style.padding = "3px";
    } else {
      // Para telas maiores
      if (profileImage) {
        profileImage.style.width = "80px";
        profileImage.style.height = "80px";
        profileImage.style.marginBottom = "0"; // Remove a margin-bottom
      }
      if (navElement) navElement.style.transform = "scale(0.9)";
      if (mainContainer)
        mainContainer.style.maxHeight =
          "calc(var(--vh, 1vh) * 100 - 12.85rem) !important";
    }
  };

  let isAdjusted = false;

  // Função para ajustar a escala e padding ao rolar
  const adjustScaleOnScroll = () => {
    if (cardSessionContent.scrollTop > 0 && !isAdjusted) {
      applyAdjustedStyles();
      isAdjusted = true;
    }
  };

  // Função de manuseio do evento de scroll
  const handleScroll = () => {
    requestAnimationFrame(adjustScaleOnScroll);
  };

  // Variáveis para interações de toque
  let isTouching = false;
  let touchStartY = 0;
  const pullThreshold = 160;

  const onTouchStart = (e) => {
    isTouching = true;
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (!isTouching) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    if (
      deltaY > pullThreshold &&
      isAdjusted &&
      cardSessionContent.scrollTop === 0
    ) {
      // Usuário está puxando para baixo no topo
      restoreOriginalStyles();
      isAdjusted = false;
      e.preventDefault(); // Previne o pull-to-refresh
    }
  };

  const onTouchEnd = () => {
    isTouching = false;
  };

  // Variáveis para interações de mouse
  let isMouseDown = false;
  let mouseStartY = 0;

  const onMouseDown = (e) => {
    isMouseDown = true;
    mouseStartY = e.clientY;
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;

    const currentY = e.clientY;
    const deltaY = currentY - mouseStartY;

    if (
      deltaY > pullThreshold &&
      isAdjusted &&
      cardSessionContent.scrollTop === 0
    ) {
      // Usuário está puxando para baixo no topo
      restoreOriginalStyles();
      isAdjusted = false;
    }
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  // Evento 'wheel' para detectar tentativas de rolagem para cima no topo
  const onWheel = (e) => {
    if (cardSessionContent.scrollTop === 0 && e.deltaY < 0 && isAdjusted) {
      restoreOriginalStyles();
      isAdjusted = false;
    }
  };

  // Adicionar os event listeners
  if (cardSessionContent) {
    // Prevenir o pull-to-refresh em dispositivos móveis
    cardSessionContent.style.overscrollBehavior = "contain";

    cardSessionContent.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    cardSessionContent.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    cardSessionContent.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    cardSessionContent.addEventListener("touchend", onTouchEnd);

    cardSessionContent.addEventListener("mousedown", onMouseDown);
    cardSessionContent.addEventListener("mousemove", onMouseMove);
    cardSessionContent.addEventListener("mouseup", onMouseUp);

    cardSessionContent.addEventListener("wheel", onWheel, { passive: true });
  }
});
