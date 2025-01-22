// dashboard-home-charts.js

document.addEventListener("DOMContentLoaded", function () {
  if (!window.ChartBase) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent =
      "charts-base.js não foi carregado antes de dashboard-home-charts.js!";
    document.body.appendChild(errorContainer);
    return;
  }

  const {
    createDoughnutChart,
    createBarChart,
    createLineChart,
    createPieChart,
    createPolarAreaChart,
  } = window.ChartBase;

  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // --------------------------------------------------------
  // 1) GRÁFICO DE EVENTOS (Doughnut)
  // --------------------------------------------------------
  const ctxEventos = document.getElementById("chartEventos")?.getContext("2d");
  if (ctxEventos) {
    const backgroundColors = [
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-primaria-2"),
      cssVar("--cor-secundaria-2"),
    ];

    createDoughnutChart(ctxEventos, {
      labels: ["Pendentes", "Realizados", "Em Andamento"],
      datasets: [
        {
          data: [12, 8, 5],
          backgroundColor: backgroundColors,
          borderColor: cssVar("--borda"),
          borderWidth: 1,
          hoverOffset: 10, // Opcional: pode ser omitido para usar o padrão
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 2) GRÁFICO DE TAREFAS (Bar)
  // --------------------------------------------------------
  const ctxTarefas = document.getElementById("chartTarefas")?.getContext("2d");
  if (ctxTarefas) {
    const backgroundColors = [
      cssVar("--cor-primaria-1"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-3"),
      cssVar("--cor-apoio-1"),
    ];

    createBarChart(ctxTarefas, {
      labels: ["Novas", "Andamento", "Atrasadas", "Concluídas"],
      datasets: [
        {
          label: "Tarefas",
          data: [10, 15, 5, 20],
          backgroundColor: backgroundColors,
          borderRadius: 6,
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 3) GRÁFICO DE PLEITOS (Doughnut)
  // --------------------------------------------------------
  const ctxPleitos = document.getElementById("chartPleitos")?.getContext("2d");
  if (ctxPleitos) {
    const backgroundColors = [
      cssVar("--cor-primaria-1"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-2"),
      cssVar("--cor-secundaria-3"),
    ];

    createDoughnutChart(ctxPleitos, {
      labels: ["Atendidos", "Parcialmente", "Negado", "Cancelado"],
      datasets: [
        {
          data: [8, 3, 2, 1],
          backgroundColor: backgroundColors,
          borderColor: cssVar("--borda"),
          borderWidth: 1,
          hoverOffset: 10, // Opcional: pode ser omitido para usar o padrão
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 4) GRÁFICO DE CONTATOS (Line)
  // --------------------------------------------------------
  const ctxContatos = document
    .getElementById("chartContatos")
    ?.getContext("2d");
  if (ctxContatos) {
    createLineChart(ctxContatos, {
      labels: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      datasets: [
        {
          label: "Contatos",
          data: [100, 120, 150, 130, 180, 200, 170, 160, 190, 210, 230, 250],
          backgroundColor: "gradient", // Gera gradiente
          borderColor: cssVar("--cor-primaria-2"),
          hoverOffset: 10, // Opcional para consistência
        },
      ],
      // Se quiser, pode ajustar orientacao: gradientOrientation: 'horizontal'
    });
  }
});
