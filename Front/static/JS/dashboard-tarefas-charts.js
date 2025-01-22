// dashboard-tarefas-charts.js

document.addEventListener("DOMContentLoaded", function () {
  if (!window.ChartBase) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent =
      "charts-base.js não foi carregado antes de dashboard-tarefas-charts.js!";
    document.body.appendChild(errorContainer);
    return;
  }

  const {
    createBarChart,
    createLineChart,
    createDoughnutChart,
    // createHorizontalBarChart, ...
  } = window.ChartBase;

  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // --------------------------------------------------------
  // 1) Tarefas por Status (Bar Vertical)
  // --------------------------------------------------------
  const ctxStatus = document
    .getElementById("chartTarefasStatus")
    ?.getContext("2d");
  if (ctxStatus) {
    const labels = ["Novas", "Andamento", "Atrasadas", "Concluídas"];
    const dataValues = [15, 25, 10, 30];

    const backgroundColors = [
      cssVar("--cor-primaria-1"),
      cssVar("--cor-apoio-1"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-apoio-2"),
    ];

    createBarChart(ctxStatus, {
      labels,
      datasets: [
        {
          label: "Tarefas por Status",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderRadius: 6,
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 2) Tarefas por Responsável (Line Chart)
  // --------------------------------------------------------
  const ctxResp = document
    .getElementById("chartTarefasResponsaveis")
    ?.getContext("2d");
  if (ctxResp) {
    const labels = [
      "Ana",
      "Bruno",
      "Carla",
      "Daniel",
      "Erica",
      "Fábio",
      "Glória",
      "Heitor",
      "Iara",
      "Jonas",
    ];
    const dataValues = [10, 5, 7, 12, 4, 6, 9, 3, 8, 11];

    createLineChart(ctxResp, {
      labels,
      datasets: [
        {
          label: "Tarefas por Responsável",
          data: dataValues,
          backgroundColor: "gradient",
          borderColor: cssVar("--cor-primaria-2"),
          hoverOffset: 10, // Opcional
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 3) Tarefas por Marcadores (Bar Vertical)
  // --------------------------------------------------------
  const ctxMarcadores = document
    .getElementById("chartTarefasMarcadores")
    ?.getContext("2d");
  if (ctxMarcadores) {
    const labels = [
      "M0",
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
      "M11",
    ];
    const dataValues = [5, 8, 3, 10, 4, 2, 6, 12, 9, 1, 7, 11];

    const backgroundColors = [
      cssVar("--cor-marcador-0"),
      cssVar("--cor-marcador-1"),
      cssVar("--cor-marcador-2"),
      cssVar("--cor-marcador-3"),
      cssVar("--cor-marcador-4"),
      cssVar("--cor-marcador-5"),
      cssVar("--cor-marcador-6"),
      cssVar("--cor-marcador-7"),
      cssVar("--cor-marcador-8"),
      cssVar("--cor-marcador-9"),
      cssVar("--cor-marcador-10"),
      cssVar("--cor-marcador-11"),
    ];

    createBarChart(ctxMarcadores, {
      labels,
      datasets: [
        {
          label: "Tarefas por Marcador",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderRadius: 6,
        },
      ],
    });
  }
});
