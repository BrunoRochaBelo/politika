// dashboard-contatos-charts.js

document.addEventListener("DOMContentLoaded", function () {
  if (!window.ChartBase) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent =
      "charts-base.js não foi carregado antes de dashboard-contatos-charts.js!";
    document.body.appendChild(errorContainer);
    return;
  }

  const {
    createBarChart,
    createLineChart,
    createPieChart,
    createDoughnutChart,
    createPolarAreaChart,
  } = window.ChartBase;

  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // --------------------------------------------------------
  // 1) Tipos de Contatos (Bar Chart)
  // --------------------------------------------------------
  const ctxTipos = document
    .getElementById("chartTiposContatos")
    ?.getContext("2d");
  if (ctxTipos) {
    const backgroundColors = [
      cssVar("--cor-primaria-1"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-3"),
      cssVar("--cor-apoio-2"),
      cssVar("--cor-secundaria-1"),
      cssVar("--cor-secundaria-3"),
      cssVar("--cor-apoio-1"),
    ];

    const labels = [
      "Eleitor",
      "Funcionário",
      "Fornecedor",
      "Comissionado",
      "Liderança",
      "Político",
    ];
    const dataValues = [150, 70, 30, 25, 60, 15];

    createBarChart(ctxTipos, {
      labels,
      datasets: [
        {
          label: "Tipos de Contatos",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderRadius: 6,
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 2) Perfil de Influência (PolarArea)
  // --------------------------------------------------------
  const ctxPerfil = document
    .getElementById("chartPerfilInfluencia")
    ?.getContext("2d");
  if (ctxPerfil) {
    const labels = [
      "1 Estrela",
      "2 Estrelas",
      "3 Estrelas",
      "4 Estrelas",
      "5 Estrelas",
    ];
    const dataValues = [30, 50, 90, 60, 10];

    function generateHSLColors(baseHue, baseSaturation, baseLightness, count) {
      const colors = [];
      const lightnessStep = 10;
      for (let i = 0; i < count; i++) {
        const lightness = baseLightness - i * lightnessStep;
        colors.push(`hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`);
      }
      return colors;
    }

    const backgroundColors = generateHSLColors(218, 90, 68, labels.length);

    createPolarAreaChart(ctxPerfil, {
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

  // --------------------------------------------------------
  // 3) Residências de Apoio (Line Chart)
  // --------------------------------------------------------
  const ctxResidencias = document
    .getElementById("chartResidencias")
    ?.getContext("2d");
  if (ctxResidencias) {
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    const dataValues = [12, 18, 22, 17, 25, 30];

    createLineChart(ctxResidencias, {
      labels,
      datasets: [
        {
          label: "Residências de Apoio",
          data: dataValues,
          backgroundColor: "gradient",
          borderColor: cssVar("--cor-primaria-2"),
          hoverOffset: 10, // Opcional
        },
      ],
    });
  }

  // --------------------------------------------------------
  // 4) Localidade (Bairro) (Pie Chart)
  // --------------------------------------------------------
  const ctxLocalidade = document
    .getElementById("chartLocalidade")
    ?.getContext("2d");
  if (ctxLocalidade) {
    const labels = ["Bairro A", "Bairro B", "Bairro C", "Bairro D"];
    const dataValues = [40, 30, 20, 10];

    function generateHSLColorsPie(
      baseHue,
      baseSaturation,
      baseLightness,
      count
    ) {
      const colors = [];
      const lightnessStep = 10;
      for (let i = 0; i < count; i++) {
        const lightness = baseLightness - i * lightnessStep;
        colors.push(`hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`);
      }
      return colors;
    }

    const backgroundColors = generateHSLColorsPie(218, 90, 68, labels.length);

    createPieChart(ctxLocalidade, {
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
