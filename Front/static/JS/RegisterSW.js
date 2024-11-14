// /Front/static/js/RegisterSW.js

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(Config.SERVICE_WORKER_PATH)
      .then((registration) => {
        console.log(
          "ServiceWorker registrado com sucesso: ",
          registration.scope
        );

        if (registration.waiting) {
          showUpdateNotification(registration.waiting);
        }

        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                showUpdateNotification(newWorker);
              } else {
                console.log("Conteúdo está disponível offline.");
              }
            }
          };
        };
      })
      .catch((err) => {
        console.log("Falha ao registrar o ServiceWorker: ", err);
      });

    // Eventos de conexão
    window.addEventListener("online", () => {
      document.body.classList.remove("offline");
      console.log("Você está online");
    });

    window.addEventListener("offline", () => {
      document.body.classList.add("offline");
      console.log("Você está offline");
    });

    // Estado inicial da conexão
    if (!navigator.onLine) {
      document.body.classList.add("offline");
    }
  }
});

// Função para mostrar a notificação de atualização
function showUpdateNotification(worker) {
  const notification = document.getElementById("update-notification");
  if (notification) {
    notification.classList.remove("hidden");

    const updateButton = document.getElementById("update-button");
    if (updateButton) {
      updateButton.addEventListener("click", () => {
        worker.postMessage({ action: "skipWaiting" });
        notification.classList.add("hidden");
      });
    }
  }
}

// Listener para mudanças de controlador do Service Worker
navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload();
});
