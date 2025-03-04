// home-financeiro-charts.js
document.addEventListener("DOMContentLoaded", function () {
  if (!window.ChartBase) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent =
      "charts-base.js não foi carregado antes de home-financeiro-charts.js!";
    document.body.appendChild(errorContainer);
    return;
  }

  const {
    createBarChart,
    createLineChart,
    createDoughnutChart,
    getCurrentColorPalette,
  } = window.ChartBase;

  // --------------------------------------------------------
  // 1) Gráfico de Despesas (Bar Chart)
  // --------------------------------------------------------
  const ctxDespesas = document
    .getElementById("chartDespesas")
    ?.getContext("2d");
  if (ctxDespesas) {
    const palette = getCurrentColorPalette();
    const labels = ["Aluguel", "Supermercado", "Contas", "Transporte", "Lazer"];
    const dataValues = [1200, 500, 300, 200, 150];

    createBarChart(ctxDespesas, {
      labels,
      datasets: [
        {
          label: "Despesas",
          data: dataValues,
          backgroundColor: [
            palette.colors[0],
            palette.colors[1],
            palette.colors[2],
            palette.colors[3],
            palette.colors[4],
          ],
          borderColor: palette.borderColor,
          borderRadius: 6,
        },
      ],
      plugins: {
        legend: { display: false },
      },
    });
  }

  // --------------------------------------------------------
  // 2) Gráfico da Conta-Corrente (Line Chart)
  // --------------------------------------------------------
  const ctxConta = document
    .getElementById("chartContaCorrente")
    ?.getContext("2d");
  if (ctxConta) {
    const palette = getCurrentColorPalette();
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    const dataValues = [1000, 800, 1200, 900, 1100, 1300];

    createLineChart(ctxConta, {
      labels,
      datasets: [
        {
          label: "Conta Corrente",
          data: dataValues,
          backgroundColor: "gradient", // Ativa gradiente dinâmico
          borderColor: palette.colors[0],
          pointBackgroundColor: palette.colors[0],
          hoverOffset: 10,
        },
      ],
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { color: palette.axisLabelColor } },
        y: { ticks: { color: palette.axisLabelColor } },
      },
      responsive: true,
      maintainAspectRatio: false,
    });
  }

  // --------------------------------------------------------
  // 3) Gráfico de Receitas (Doughnut Chart)
  // --------------------------------------------------------
  const ctxReceitas = document
    .getElementById("chartReceitas")
    ?.getContext("2d");
  if (ctxReceitas) {
    const palette = getCurrentColorPalette();
    const labels = ["Salário", "Investimentos", "Freelance", "Outros"];
    const dataValues = [3000, 800, 400, 200];

    createDoughnutChart(ctxReceitas, {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: [
            palette.colors[0],
            palette.colors[1],
            palette.colors[2],
            palette.colors[3],
          ],
          borderColor: palette.borderColor,
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
      plugins: {
        legend: { display: false },
      },
    });
  }
});
