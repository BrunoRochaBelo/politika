document.addEventListener("DOMContentLoaded", () => {
  // Elementos relevantes para o modal e ajustes visuais
  const notificationIcon = document.getElementById("notification");
  const modal = document.getElementById("notificationModal");
  const modalContent = document.getElementById("modalContent");
  const closeButton = document.getElementById("closeButton");
  const headerNotification = document.querySelector(".header-notification");

  const openModal = () => {
    notificationIcon.querySelector("img").src =
      "./static/imagens/icones/notificação-select.svg";
    modal.classList.add("show");
    modalContent.classList.add("show");
    modalContent.classList.remove("hide");
    headerNotification.style.zIndex = 2005;
    notificationIcon.classList.remove("new-notification");
  };

  const closeModal = () => {
    modalContent.classList.add("hide");
    modalContent.classList.remove("show");
    modalContent.addEventListener(
      "animationend",
      () => {
        modal.classList.remove("show");
        notificationIcon.querySelector("img").src =
          "./static/imagens/icones/notificação.svg";
        headerNotification.style.zIndex = 2002;
      },
      { once: true }
    );
  };

  notificationIcon.addEventListener("click", () => {
    if (modal.classList.contains("show")) {
      closeModal();
    } else {
      openModal();
      notificationIcon.classList.add("shake-animation");
      setTimeout(
        () => notificationIcon.classList.remove("shake-animation"),
        500
      );
    }
  });

  closeButton.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
});
