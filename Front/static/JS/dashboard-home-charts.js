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
    getCurrentColorPalette,
    // ... outras funções se necessário
  } = window.ChartBase;

  // --------------------------------------------------------
  // 1) Gráfico de Eventos (Doughnut) - Cores Sólidas
  // --------------------------------------------------------
  const ctxEventos = document.getElementById("chartEventos")?.getContext("2d");
  if (ctxEventos) {
    const palette = getCurrentColorPalette();
    const backgroundColors = [
      palette.colors[0], // Pendentes - Azul
      palette.colors[4], // Realizados - Verde
      palette.colors[3], // Em Andamento - Verde-água
    ];

    createDoughnutChart(ctxEventos, {
      labels: ["Pendentes", "Realizados", "Em Andamento"],
      datasets: [
        {
          data: [12, 8, 5],
          backgroundColor: backgroundColors,
          borderColor: palette.borderColor, // Utilizar borderColor da paleta
          borderWidth: 1,
          hoverOffset: 10, // Opcional
        },
      ],
      plugins: {
        legend: { display: false }, // Remover legenda para DoughnutChart
      },
    });
  }

  // --------------------------------------------------------
  // 2) Gráfico de Tarefas (Bar) - Cores Sólidas
  // --------------------------------------------------------
  const ctxTarefas = document.getElementById("chartTarefas")?.getContext("2d");
  if (ctxTarefas) {
    const palette = getCurrentColorPalette();
    const backgroundColors = [
      palette.colors[0], // Azul
      palette.colors[3], // Verde-água
      palette.colors[2], // Vermelho
      palette.colors[4], // Verde
    ];

    createBarChart(ctxTarefas, {
      labels: ["Novas", "Andamento", "Atrasadas", "Concluídas"],
      datasets: [
        {
          label: "Tarefas",
          data: [10, 15, 5, 20],
          backgroundColor: backgroundColors,
          borderRadius: 6,
          borderColor: palette.borderColor, // Utilizar borderColor da paleta
        },
      ],
      plugins: {
        legend: { display: false }, // Remover legenda para BarChart
      },
    });
  }

  // --------------------------------------------------------
  // 3) Gráfico de Pleitos (Doughnut) - Cores Sólidas
  // --------------------------------------------------------
  const ctxPleitos = document.getElementById("chartPleitos")?.getContext("2d");
  if (ctxPleitos) {
    const palette = getCurrentColorPalette();
    const backgroundColors = [
      palette.colors[0], // Atendidos - Azul Escuro
      palette.colors[1], // Parcialmente - Laranja Claro
      palette.colors[2], // Negado - Vermelho
      palette.colors[1], // Cancelado - Laranja Claro
    ];

    createDoughnutChart(ctxPleitos, {
      labels: ["Atendidos", "Parcialmente", "Negado", "Cancelado"],
      datasets: [
        {
          data: [8, 3, 2, 1],
          backgroundColor: backgroundColors,
          borderColor: palette.borderColor, // Utilizar borderColor da paleta
          borderWidth: 1,
          hoverOffset: 10, // Opcional
        },
      ],
      plugins: {
        legend: { display: false }, // Remover legenda para DoughnutChart
      },
    });
  }

  // --------------------------------------------------------
  // 4) Gráfico de Contatos (Line) - Cor Sólida e Responsivo com Zoom e Pan
  // --------------------------------------------------------
  const ctxContatos = document
    .getElementById("chartContatos")
    ?.getContext("2d");
  if (ctxContatos) {
    const palette = getCurrentColorPalette();
    const chartContatos = createLineChart(ctxContatos, {
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
          backgroundColor: palette.colors[0], // Azul Sólido para área preenchida
          borderColor: palette.colors[0], // Linha na cor do ponto
          pointBackgroundColor: palette.colors[0], // Pontos na cor do ponto
          hoverOffset: 10, // Opcional para consistência
        },
      ],
      plugins: {
        legend: { display: false }, // Remover legenda para LineChart
        // As configurações de zoom e pan já estão na base
      },
      scales: {
        x: {
          ticks: {
            color: palette.axisLabelColor, // Cor dinâmica para rótulos do eixo X
          },
        },
        y: {
          ticks: {
            color: palette.axisLabelColor, // Cor dinâmica para rótulos do eixo Y
          },
        },
      },
      // Garantir que o gráfico seja responsivo
      responsive: true,
      maintainAspectRatio: false,
    });

    // Botão de Reset de Zoom para Contatos
    const resetZoomBtn = document.getElementById("resetZoomContatos");
    if (resetZoomBtn && chartContatos) {
      resetZoomBtn.addEventListener("click", function () {
        chartContatos.resetZoom();
      });
    }

    // Feedback Visual durante Interações
    chartContatos.on("pan", () => {
      document.querySelector(".line-chart-container").classList.add("active");
    });

    chartContatos.on("zoom", () => {
      document.querySelector(".line-chart-container").classList.add("active");
    });

    chartContatos.on("pancomplete", () => {
      document
        .querySelector(".line-chart-container")
        .classList.remove("active");
    });

    chartContatos.on("zoomcomplete", () => {
      document
        .querySelector(".line-chart-container")
        .classList.remove("active");
    });
  }
});
