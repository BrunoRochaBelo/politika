// dashboard-pleitos-charts.js

document.addEventListener("DOMContentLoaded", function () {
  if (!window.ChartBase) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent =
      "charts-base.js não foi carregado antes de dashboard-pleitos-charts.js!";
    document.body.appendChild(errorContainer);
    return;
  }

  const { createBarChart, createDoughnutChart, getCurrentColorPalette } =
    window.ChartBase;

  // --------------------------------------------------------
  // 1) Tipo de Pleito (Bar Chart) - Cores Sólidas
  // --------------------------------------------------------
  const ctxTipoPleito = document
    .getElementById("chartTipoPleito")
    ?.getContext("2d");
  if (ctxTipoPleito) {
    const palette = getCurrentColorPalette();
    const labels = [
      "Emprego",
      "Educação e Capacitação",
      "Infraestrutura",
      "Jurídico",
      "Mobilidade",
      "Outros",
      "Político",
      "Recursos Financeiros",
      "Saúde",
      "Segurança",
    ];
    const dataValues = [50, 30, 20, 15, 25, 10, 5, 40, 35, 20];

    const backgroundColors = [
      palette.colors[0], // Emprego - Azul
      palette.colors[3], // Educação e Capacitação - Verde-água
      palette.colors[2], // Infraestrutura - Vermelho
      palette.colors[4], // Jurídico - Verde
      palette.colors[5], // Mobilidade - Amarelo
      palette.colors[1], // Outros - Laranja
      palette.colors[6], // Político - Roxo
      palette.colors[7], // Recursos Financeiros - Rosa
      palette.colors[8], // Saúde - Marrom
      palette.colors[9], // Segurança - Cinza
    ];

    createBarChart(ctxTipoPleito, {
      labels,
      datasets: [
        {
          label: "Tipo de Pleito",
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
  // 2) Status do Pleito (Doughnut) - Cores Sólidas em Azul
  // --------------------------------------------------------
  const ctxStatusPleito = document
    .getElementById("chartStatusPleito")
    ?.getContext("2d");
  if (ctxStatusPleito) {
    const palette = getCurrentColorPalette();
    const labels = ["Atendidos", "Parcialmente", "Negado", "Cancelado"];
    const dataValues = [8, 3, 2, 1];

    // Definindo cores sólidas em tons de azul para cada status usando colorPalette
    const backgroundColors = [
      palette.colors[0], // Atendidos - Azul Escuro
      palette.colors[1], // Parcialmente - Laranja Claro
      palette.colors[2], // Negado - Vermelho
      palette.colors[1], // Cancelado - Laranja Claro
    ];

    createDoughnutChart(ctxStatusPleito, {
      labels,
      datasets: [
        {
          data: dataValues,
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
});
