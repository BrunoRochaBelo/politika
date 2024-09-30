document.addEventListener("DOMContentLoaded", function () {
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
  function restoreOriginalStyles() {
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
  }

  // Função para ajustar a escala e padding ao rolar
  function adjustScaleOnScroll() {
    const screenWidth = window.innerWidth;

    if (this.scrollTop > 0) {
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
    } else {
      restoreOriginalStyles();
    }
  }

  // Função de manuseio do evento de scroll
  function handleScroll() {
    requestAnimationFrame(adjustScaleOnScroll.bind(this));
  }

  // Verifica se o conteúdo de sessão existe e aplica o listener de scroll
  if (cardSessionContent) {
    cardSessionContent.addEventListener("scroll", handleScroll);
  }
});
