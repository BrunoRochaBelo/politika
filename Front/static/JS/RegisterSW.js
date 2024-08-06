window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registrado com sucesso: ",
          registration.scope
        );

        if (registration.waiting) {
          notifyUserOfUpdate(registration.waiting);
        }

        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                notifyUserOfUpdate(newWorker);
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

    window.addEventListener("online", () => {
      document.body.classList.remove("offline");
      console.log("Você está online");
    });

    window.addEventListener("offline", () => {
      document.body.classList.add("offline");
      console.log("Você está offline");
    });

    if (!navigator.onLine) {
      document.body.classList.add("offline");
    }
  }
});

function notifyUserOfUpdate(worker) {
  const updateNotification = confirm(
    "Nova versão disponível. Deseja atualizar?"
  );
  if (updateNotification) {
    worker.postMessage({ action: "skipWaiting" });
  }
}

navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload();
});
