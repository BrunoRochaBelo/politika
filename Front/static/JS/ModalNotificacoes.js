// JavaScript

document.addEventListener("DOMContentLoaded", (event) => {
  const notificationIcon = document.getElementById("notification");
  const notificationCounter = document.getElementById("notificationCounter");
  const modal = document.getElementById("notificationModal");
  const modalContent = document.getElementById("modalContent");
  const closeButton = document.getElementById("closeButton");
  const notificationsContent = document.getElementById("notificationsContent");
  const markAllReadButton = document.getElementById("markAllReadButton");
  const notificationSound = document.getElementById("notificationSound");
  const noNotifications = document.getElementById("noNotifications");
  const headerNotification = document.querySelector(".header-notification");

  const token = "SEU_TOKEN_DE_AUTENTICACAO"; // Substitua por seu token de autenticação
  const apiURL = "URL_DA_SUA_API"; // Substitua 'URL_DA_SUA_API' pela URL da sua API
  let page = 1; // Página inicial
  const limit = 10; // Limite de notificações por página
  let lastUpdate =
    localStorage.getItem("lastUpdate") || new Date(0).toISOString(); // Data da última atualização
  let newNotificationsCount = 0; // Contador de novas notificações
  let notificationsCache = []; // Cache de notificações
  let totalNotifications = 0; // Total de notificações

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const updateNotificationCounter = (count) => {
    if (count >= 10) {
      notificationCounter.textContent = "0 a +9";
    } else {
      notificationCounter.textContent = count.toString();
    }
  };

  const renderNotifications = (notifications) => {
    notifications.forEach((notification) => {
      const notificationElement = document.createElement("li");
      notificationElement.classList.add("notification", notification.type);
      notificationElement.innerHTML = `
        ${notification.message}
        <button class="delete-button" data-id="${notification.id}">&times;</button>
      `;

      if (new Date(notification.date) > new Date(lastUpdate)) {
        notificationElement.classList.add("new");
        newNotificationsCount++;
      }

      notificationsContent.appendChild(notificationElement);
    });
    updateNotificationCounter(newNotificationsCount);
  };

  const fetchNotifications = async (reset = false) => {
    if (reset) {
      page = 1;
      notificationsContent.innerHTML = "";
      newNotificationsCount = 0;
      notificationsCache = [];
      totalNotifications = 0;
    }

    if (notificationsCache.length >= page * limit && !reset) {
      renderNotifications(
        notificationsCache.slice((page - 1) * limit, page * limit)
      );
      return;
    }

    try {
      const response = await fetch(
        `${apiURL}?page=${page}&limit=${limit}&since=${lastUpdate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }

      const { notifications, total } = await response.json();
      totalNotifications = total;

      if (!notifications || notifications.length === 0) {
        if (page === 1) {
          noNotifications.style.display = "block";
        }
        return;
      } else {
        noNotifications.style.display = "none";
      }

      notificationsCache = [...notificationsCache, ...notifications];

      renderNotifications(notifications);

      if (reset && notifications.length > 0) {
        notificationSound.play();
        notificationIcon.classList.add("new-notification");
      }

      if (notifications.length > 0) {
        lastUpdate = new Date().toISOString();
        localStorage.setItem("lastUpdate", lastUpdate);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      noNotifications.style.display = "block";
    }
  };

  const fetchNewNotifications = async () => {
    try {
      const response = await fetch(`${apiURL}?since=${lastUpdate}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar novas notificações");
      }

      const { notifications } = await response.json();

      if (notifications && notifications.length > 0) {
        notificationsCache = [...notifications, ...notificationsCache];
        renderNotifications(notifications);
        notificationSound.play();
        notificationIcon.classList.add("new-notification");
        lastUpdate = new Date().toISOString();
        localStorage.setItem("lastUpdate", lastUpdate);
      }
    } catch (error) {
      console.error("Erro ao buscar novas notificações:", error);
    }
  };

  const debouncedFetchNotifications = debounce(fetchNotifications, 300);

  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`${apiURL}/mark-read/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar notificação como lida");
      }

      const notificationElement = document.querySelector(
        `.delete-button[data-id="${id}"]`
      ).parentElement;
      notificationElement.classList.remove("new");
      notificationElement.classList.add("lida");

      newNotificationsCount--;
      updateNotificationCounter(newNotificationsCount);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${apiURL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir notificação");
      }

      const notificationElement = document.querySelector(
        `.delete-button[data-id="${id}"]`
      ).parentElement;
      notificationElement.classList.add("removing");

      setTimeout(() => {
        notificationElement.remove();
        fetchNotifications(true);
      }, 500);
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
    }
  };

  const openModal = () => {
    notificationIcon.querySelector("img").src =
      "./static/imagens/icones/notificação-select.svg";
    fetchNotifications(true);
    modal.classList.add("show");
    modalContent.classList.add("show");
    modalContent.classList.remove("hide");
    headerNotification.style.zIndex = 2005; // Alterar z-index quando o modal for exibido
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
        headerNotification.style.zIndex = 2002; // Voltar z-index ao valor original
      },
      { once: true }
    );
  };

  notificationIcon.addEventListener("click", () => {
    if (modal.classList.contains("show")) {
      closeModal();
    } else {
      openModal();
    }
  });

  closeButton.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  markAllReadButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${apiURL}/mark-all-read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar todas como lidas");
      }

      fetchNotifications(true);
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  });

  const handleScroll = () => {
    if (
      modalContent.scrollTop + modalContent.clientHeight >=
      modalContent.scrollHeight
    ) {
      if (notificationsCache.length < totalNotifications) {
        page++;
        fetchNotifications();
      }
    }
  };

  modalContent.addEventListener("scroll", handleScroll);

  setInterval(() => debouncedFetchNotifications(true), 300000);
  setInterval(fetchNewNotifications, 30000); // Checar novas notificações a cada 30 segundos

  notificationsContent.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
      const id = event.target.getAttribute("data-id");
      deleteNotification(id);
    } else if (event.target.classList.contains("notification")) {
      const id = event.target
        .querySelector(".delete-button")
        .getAttribute("data-id");
      markNotificationAsRead(id);
    }
  });
});
