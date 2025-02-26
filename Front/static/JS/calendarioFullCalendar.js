document.addEventListener("DOMContentLoaded", () => {
  // --- Dados necessários para o funcionamento do calendário ---
  // O Config já está disponível globalmente via config.js.
  // Definindo o template customizado da Agenda:
  let customAgendaTemplate = "";
  const customContainer = document.querySelector(
    "#calendar .area-interna-containerContent-template"
  );
  if (customContainer) {
    customAgendaTemplate = customContainer.innerHTML;
    customContainer.remove();
    console.log("Template customizado da Agenda armazenado.");
  } else {
    // Caso o elemento não exista, usamos um template padrão.
    customAgendaTemplate =
      '<div class="custom-agenda-content">Conteúdo customizado da Agenda</div>';
    console.warn(
      "Elemento com o template customizado não foi encontrado. Usando template padrão."
    );
  }

  // --- Configurações de API ---
  // Seleciona a base URL conforme o ambiente (ajuste se necessário)
  const baseURL = window.Config.BASE_URL[window.Config.ENVIRONMENT];
  const getAllEventsEndpoint = window.Config.API_ENDPOINTS.GET_ALL_EVENTS;

  // --- Variáveis de controle ---
  let isAgendaActive = false;
  // Para evitar o flash na primeira carga, escondemos o calendário
  const calendarEl = document.getElementById("calendar");
  calendarEl.style.visibility = "hidden";

  // --- Helper Functions ---
  const disableNavButtons = () => {
    document
      .querySelectorAll(".fc-prev-button, .fc-next-button, .fc-today-button")
      .forEach((btn) => {
        btn.disabled = true;
        btn.classList.add("disabled");
      });
  };

  const enableNavButtons = () => {
    document
      .querySelectorAll(".fc-prev-button, .fc-next-button, .fc-today-button")
      .forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove("disabled");
      });
  };

  const updateTodayButtonState = () => {
    const todayBtn = document.querySelector(".fc-today-button");
    if (!todayBtn) return;
    if (isAgendaActive) {
      todayBtn.disabled = true;
      return;
    }
    const view = calendar.view;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const viewStart = new Date(view.currentStart);
    viewStart.setHours(0, 0, 0, 0);
    const viewEnd = new Date(view.currentEnd);
    viewEnd.setHours(0, 0, 0, 0);
    todayBtn.disabled = today >= viewStart && today < viewEnd;
  };

  const updateActiveButton = () => {
    document
      .querySelectorAll(".fc-button")
      .forEach((btn) => btn.classList.remove("fc-button-active"));
    const viewType = calendar.view.type;
    if (viewType === "dayGridMonth") {
      const targetBtn = document.querySelector(".fc-dayGridMonth-button");
      if (targetBtn) targetBtn.classList.add("fc-button-active");
    } else if (viewType === "timeGridWeek") {
      const targetBtn = document.querySelector(".fc-timeGridWeek-button");
      if (targetBtn) targetBtn.classList.add("fc-button-active");
    } else if (viewType === "timeGridDay") {
      const targetBtn = document.querySelector(".fc-timeGridDay-button");
      if (targetBtn) targetBtn.classList.add("fc-button-active");
    }
  };

  const updateToolbarTitle = () => {
    const titleEl = document.querySelector(".fc-toolbar-title");
    if (titleEl) {
      titleEl.innerHTML = calendar.view.title;
    }
  };

  const applyAgendaCustomView = () => {
    const viewHarness = document.querySelector(
      "#calendar .fc-view-harness.fc-view-harness-active"
    );
    const titleEl = document.querySelector(".fc-toolbar-title");
    if (viewHarness) {
      while (viewHarness.firstChild) {
        viewHarness.removeChild(viewHarness.firstChild);
      }
      const customDiv = document.createElement("div");
      customDiv.className = "area-interna-containerContent-template";
      customDiv.innerHTML = customAgendaTemplate;
      viewHarness.appendChild(customDiv);
      viewHarness.classList.add("agenda-active");
      console.log("Custom Agenda aplicada.");
    } else {
      console.error(
        "Elemento .fc-view-harness.fc-view-harness-active não encontrado."
      );
    }
    if (titleEl) {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = month < 10 ? `0${month}` : month;
      titleEl.innerHTML = `seu dia - ${formattedDay}/${formattedMonth}`;
    }
    disableNavButtons();
    // Exibe o calendário após aplicar a customização da Agenda
    calendarEl.style.visibility = "visible";
  };

  const resetAgendaView = (targetView) => {
    isAgendaActive = false;
    enableNavButtons();
    document
      .querySelectorAll(".fc-button")
      .forEach((btn) => btn.classList.remove("fc-button-active"));
    const viewHarness = document.querySelector(
      "#calendar .fc-view-harness.fc-view-harness-active"
    );
    if (viewHarness) {
      while (viewHarness.firstChild) {
        viewHarness.removeChild(viewHarness.firstChild);
      }
      viewHarness.classList.remove("agenda-active");
    }
    updateToolbarTitle();
    console.log("Agenda view reset.");
    updateTodayButtonState();
    setTimeout(() => {
      calendar.changeView(targetView ? targetView : calendar.view.type);
      setTimeout(() => {
        updateActiveButton();
      }, 50);
    }, 10);
  };

  let ephemeralEvent = null;
  let ephemeralTimeout = null;

  const roundToNearest30 = (date) => {
    const newDate = new Date(date.getTime());
    const minutes = newDate.getMinutes();
    const remainder = minutes % 30;
    if (remainder < 15) {
      newDate.setMinutes(minutes - remainder);
    } else {
      newDate.setMinutes(minutes + (30 - remainder));
    }
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  const removeEphemeralEvent = () => {
    if (ephemeralEvent) {
      ephemeralEvent.remove();
      ephemeralEvent = null;
    }
    if (ephemeralTimeout) {
      clearTimeout(ephemeralTimeout);
      ephemeralTimeout = null;
    }
  };

  const createEphemeralEvent = (info) => {
    removeEphemeralEvent();
    const startDate = roundToNearest30(info.date);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
    ephemeralEvent = calendar.addEvent({
      title: "Livre",
      start: startDate,
      end: endDate,
      allDay: false,
      editable: false,
      durationEditable: false,
      startEditable: false,
      classNames: ["ephemeral-event"],
      extendedProps: { ephemeral: true },
    });
    ephemeralTimeout = setTimeout(removeEphemeralEvent, 2000);
  };

  const openDayEventsModal = (date) => {
    const weekdayLong = date.toLocaleDateString("pt-BR", {
      weekday: "long",
    });
    document.getElementById("modalDayEventsHeaderDate").textContent =
      weekdayLong;
    const subDate = date
      .toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
      .replace(".", "");
    document.getElementById("modalDayEventsSubDate").textContent = subDate;
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const dayEvents = calendar.getEvents().filter((event) => {
      if (event.extendedProps.ephemeral) return false;
      return event.start < dayEnd && event.end > dayStart;
    });
    const eventsListEl = document.getElementById("dayEventsList");
    eventsListEl.innerHTML = "";
    if (dayEvents.length > 0) {
      dayEvents.forEach((event) => {
        const markerClass = `cor-marc${event.extendedProps.markerType || 0}`;
        const category = event.extendedProps.category
          ? `${event.extendedProps.category} - `
          : "";
        const displayTitle = category + event.title;
        const li = document.createElement("li");
        if (event.allDay) {
          li.innerHTML = `
            <div class="event-line">
              <div class="event-marker-vertical ${markerClass}"></div>
              <span class="event-title">${displayTitle}</span>
            </div>
            <div class="event-range">Dia Todo</div>
          `;
        } else {
          const formattedStart = FullCalendar.formatDate(event.start, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const formattedEnd = event.end
            ? " - " +
              FullCalendar.formatDate(event.end, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "";
          li.innerHTML = `
            <div class="event-line">
              <div class="event-marker-vertical ${markerClass}"></div>
              <span class="event-title">${displayTitle}</span>
            </div>
            <div class="event-range">${formattedStart}${formattedEnd}</div>
          `;
        }
        li.addEventListener("click", (e) => {
          e.stopPropagation();
          window.location.href = "exibir-evento" + event.id + ".html";
        });
        eventsListEl.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Sem eventos";
      eventsListEl.appendChild(li);
    }
    document.getElementById("dayEventsModal").style.display = "block";
  };

  // --- API: Buscar eventos para as visões Mês, Semana e Dia ---
  const fetchEventsFromAPI = (fetchInfo, successCallback, failureCallback) => {
    // Se a visão Agenda estiver ativa, os dados já vêm renderizados.
    if (isAgendaActive) {
      successCallback([]);
      return;
    }
    const url = `${baseURL}${getAllEventsEndpoint}?start=${fetchInfo.startStr}&end=${fetchInfo.endStr}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        successCallback(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        failureCallback(error);
      });
  };

  // --- Inicialização do FullCalendar ---
  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "pt-br",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "agenda,dayGridMonth,timeGridWeek,timeGridDay",
    },
    customButtons: {
      agenda: {
        text: "Agenda",
        click: () => {
          console.log("Botão Agenda clicado. Aplicando customização.");
          isAgendaActive = true;
          document
            .querySelectorAll(".fc-button")
            .forEach((btn) => btn.classList.remove("fc-button-active"));
          const agendaBtn = document.querySelector(".fc-agenda-button");
          if (agendaBtn) {
            agendaBtn.classList.add("fc-button-active");
          }
          applyAgendaCustomView();
          updateTodayButtonState();
        },
      },
    },
    buttonText: {
      today: "Hoje",
      month: "Mês",
      week: "Semana",
      day: "Dia",
    },
    nowIndicator: true,
    scrollTime: `${new Date().getHours()}:00:00`,
    editable: true,
    selectable: true,
    // Carrega os eventos via API
    events: (fetchInfo, successCallback, failureCallback) =>
      fetchEventsFromAPI(fetchInfo, successCallback, failureCallback),
    datesSet: () => {
      removeEphemeralEvent();
      const titleEl = document.querySelector(".fc-toolbar-title");
      const viewHarness = document.querySelector(
        "#calendar .fc-view-harness.fc-view-harness-active"
      );
      if (isAgendaActive) {
        if (viewHarness) {
          while (viewHarness.firstChild) {
            viewHarness.removeChild(viewHarness.firstChild);
          }
          const customDiv = document.createElement("div");
          customDiv.className = "area-interna-containerContent-template";
          customDiv.innerHTML = customAgendaTemplate;
          viewHarness.appendChild(customDiv);
          viewHarness.classList.add("agenda-active");
        }
        if (titleEl) {
          const now = new Date();
          const day = now.getDate();
          const month = now.getMonth() + 1;
          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedMonth = month < 10 ? `0${month}` : month;
          titleEl.innerHTML = `seu dia | ${formattedDay}/${formattedMonth}`;
        }
        disableNavButtons();
      } else {
        if (viewHarness) {
          viewHarness.classList.remove("agenda-active");
        }
        if (titleEl) {
          titleEl.innerHTML = calendar.view.title;
        }
        enableNavButtons();
      }
      updateTodayButtonState();
    },
    windowResize: debounce(() => {
      calendar.updateSize();
      if (isAgendaActive) {
        applyAgendaCustomView();
      }
      updateTodayButtonState();
    }, 200),
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    eventClassNames: (arg) => {
      if (arg.event.extendedProps.markerType !== undefined) {
        return [`cor-marc${arg.event.extendedProps.markerType}`];
      }
      return [];
    },
    eventDidMount: (info) => {
      if (info.event.extendedProps.ephemeral) {
        info.el.innerHTML =
          '<div style="font-size: 10px; text-align: center; pointer-events: none;">Livre</div>';
        info.el.style.pointerEvents = "none";
        info.el.style.backgroundColor = "transparent";
        info.el.style.border = "none";
        info.el.style.boxShadow = "none";
        info.el.style.cursor = "default";
      }
    },
    eventClick: (info) => {
      info.jsEvent.preventDefault();
      openDayEventsModal(info.event.start);
    },
    dateClick: (info) => {
      if (info.view.type === "dayGridMonth") {
        openDayEventsModal(info.date);
      } else {
        createEphemeralEvent(info);
      }
    },
    views: {
      timeGridWeek: {
        dayHeaderContent: (arg) => {
          const weekday = new Date(arg.date).toLocaleDateString("pt-BR", {
            weekday: "short",
          });
          const day = new Date(arg.date).toLocaleDateString("pt-BR", {
            day: "numeric",
          });
          return { html: `${weekday}<br>${day}` };
        },
      },
      timeGridDay: {
        dayHeaderContent: (arg) => {
          const fullDay = new Date(arg.date).toLocaleDateString("pt-BR", {
            weekday: "long",
          });
          return { html: fullDay };
        },
      },
    },
  });

  calendar.render();

  // Simula clique no botão Agenda para que a visualização inicial seja a Agenda
  const agendaBtn = document.querySelector(".fc-agenda-button");
  if (agendaBtn) {
    // Pequeno delay para garantir que o calendário já renderizou
    setTimeout(() => {
      agendaBtn.click();
    }, 20);
  } else {
    console.error("Botão Agenda não encontrado.");
  }

  // Ao clicar em qualquer botão (exceto Agenda), se a Agenda estiver ativa, reseta seu estado
  document
    .querySelectorAll(".fc-button:not(.fc-agenda-button)")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        if (isAgendaActive) {
          let targetView = null;
          if (btn.classList.contains("fc-dayGridMonth-button")) {
            targetView = "dayGridMonth";
          } else if (btn.classList.contains("fc-timeGridWeek-button")) {
            targetView = "timeGridWeek";
          } else if (btn.classList.contains("fc-timeGridDay-button")) {
            targetView = "timeGridDay";
          } else if (btn.classList.contains("fc-today-button")) {
            targetView = calendar.view.type;
          }
          setTimeout(() => {
            resetAgendaView(targetView);
          }, 10);
          console.log("Modo Agenda desativado.");
        }
      });
    });

  // Fechamento do modal de eventos do dia
  document
    .querySelector("#dayEventsModal .close-modal-day")
    .addEventListener("click", () => {
      document.getElementById("dayEventsModal").style.display = "none";
    });
  window.addEventListener("click", (event) => {
    const dayEventsModal = document.getElementById("dayEventsModal");
    if (event.target === dayEventsModal) {
      dayEventsModal.style.display = "none";
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.getElementById("dayEventsModal").style.display = "none";
    }
  });

  // --- Debounce Function ---
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }
});
