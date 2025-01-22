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

  const { createBarChart, createDoughnutChart } = window.ChartBase;

  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // --------------------------------------------------------
  // 1) Tipo de Pleito (Bar Chart)
  // --------------------------------------------------------
  const ctxTipoPleito = document
    .getElementById("chartTipoPleito")
    ?.getContext("2d");
  if (ctxTipoPleito) {
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
      cssVar("--cor-primaria-1"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-2"),
      cssVar("--cor-apoio-1"),
      cssVar("--cor-secundaria-3"),
      cssVar("--cor-apoio-2"),
      cssVar("--cor-primaria-2"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-2"),
      cssVar("--cor-apoio-1"),
    ];

    createBarChart(ctxTipoPleito, {
      labels,
      datasets: [
        {
          label: "Tipo de Pleito",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderRadius: 6,
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 2) Status do Pleito (Doughnut)
  // --------------------------------------------------------
  const ctxStatusPleito = document
    .getElementById("chartStatusPleito")
    ?.getContext("2d");
  if (ctxStatusPleito) {
    const labels = ["Atendidos", "Parcialmente", "Negado", "Cancelado"];
    const dataValues = [8, 3, 2, 1];

    const backgroundColors = [
      cssVar("--cor-primaria-1"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-2"),
      cssVar("--cor-secundaria-3"),
    ];

    createDoughnutChart(ctxStatusPleito, {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          borderColor: cssVar("--borda"),
          borderWidth: 1,
          hoverOffset: 10, // Opcional
        },
      ],
    });
  }
});
