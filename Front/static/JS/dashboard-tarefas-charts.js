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
    getCurrentColorPalette, // Acessando a paleta atual
  } = window.ChartBase;

  // --------------------------------------------------------
  // Função para obter cores via CSS apenas para chartTarefasMarcadores
  // --------------------------------------------------------
  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // --------------------------------------------------------
  // 1) Tarefas por Status (Bar Vertical) - Utilizar Cores Sólidas
  // --------------------------------------------------------
  const ctxStatus = document
    .getElementById("chartTarefasStatus")
    ?.getContext("2d");
  if (ctxStatus) {
    const palette = getCurrentColorPalette();
    const labels = ["Novas", "Andamento", "Atrasadas", "Concluídas"];
    const dataValues = [15, 25, 10, 30];

    const backgroundColors = [
      palette.colors[0], // Azul
      palette.colors[3], // Verde-água
      palette.colors[2], // Vermelho
      palette.colors[4], // Verde
    ];

    createBarChart(ctxStatus, {
      labels,
      datasets: [
        {
          label: "Tarefas por Status",
          data: dataValues,
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
  // 2) Tarefas por Responsável (Line Chart) - Utilizar Cor Sólida
  // --------------------------------------------------------
  const ctxResp = document
    .getElementById("chartTarefasResponsaveis")
    ?.getContext("2d");
  if (ctxResp) {
    const palette = getCurrentColorPalette();
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
          backgroundColor: palette.colors[0], // Azul Sólido ou gradiente se configurado
          borderColor: palette.colors[0], // Linha na cor do ponto
          pointBackgroundColor: palette.colors[0], // Pontos na cor do ponto
          hoverOffset: 10, // Opcional
        },
      ],
      plugins: {
        legend: { display: false }, // Remover legenda para LineChart
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
      // Se desejar, pode ajustar a orientação: gradientOrientation: 'horizontal'
    });
  }

  // --------------------------------------------------------
  // 3) Tarefas por Marcadores (Bar Vertical) - Utilizar Variáveis CSS
  // --------------------------------------------------------
  const ctxMarcadores = document
    .getElementById("chartTarefasMarcadores")
    ?.getContext("2d");
  if (ctxMarcadores) {
    const palette = getCurrentColorPalette(); // Obter a paleta atual, se necessário
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
          backgroundColor: backgroundColors, // Utiliza Variáveis CSS
          borderRadius: 6,
          borderColor: palette.borderColor, // Preservar borderColor para este dataset
          preserveBorderColor: true, // Indica para o listener não alterar borderColor
        },
      ],
    });
  }
});
