// charts-base.js

(function () {
  // 1) Verifica se o Chart.js está disponível
  if (typeof Chart === "undefined") {
    console.error("Chart.js não foi carregado antes de charts-base.js!");
    return;
  }

  // 2) Registro dos plugins globais (DataLabels, Zoom, etc.)
  if (typeof ChartDataLabels !== "undefined") {
    Chart.register(ChartDataLabels);
  } else {
    console.warn("chartjs-plugin-datalabels não foi encontrado.");
  }
  // if (typeof Zoom !== 'undefined') {
  //   Chart.register(Zoom);
  // }

  // 3) Função para obter variáveis CSS definidas no :root
  function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  // 4) Objeto com cores/textos das variáveis CSS
  const BASE_VARS = {
    corPrimaria1: getCSSVariable("--cor-primaria-1"),
    corPrimaria2: getCSSVariable("--cor-primaria-2"),
    corSecundaria1: getCSSVariable("--cor-secundaria-1"),
    corSecundaria2: getCSSVariable("--cor-secundaria-2"),
    corSecundaria3: getCSSVariable("--cor-secundaria-3"),
    corApoio1: getCSSVariable("--cor-apoio-1"),
    corApoio2: getCSSVariable("--cor-apoio-2"),
    txtSubtitulo: getCSSVariable("--txt-subtitulo"),
    txtTitulo: getCSSVariable("--txt-titulo"),
    txtDestaque: getCSSVariable("--txt-destaque"),
    borda: getCSSVariable("--borda"),
    divisor: getCSSVariable("--divisor"),
  };

  // 5) Função auxiliar para calcular percentual
  function calculatePercentage(value, total) {
    if (total === 0) return "0.00";
    return ((value / total) * 100).toFixed(2);
  }

  // 6) Opções base de todos os gráficos
  function getBaseChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 10,
            boxHeight: 10,
            padding: 20,
            color: BASE_VARS.txtSubtitulo,
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: 4,
          bodyColor: "#fff",
          displayColors: false,
          callbacks: {
            // Callback genérico (pode ser sobrescrito por cada função)
            label: function (context) {
              return context.formattedValue;
            },
          },
        },
        datalabels: {
          color: BASE_VARS.txtDestaque,
          font: { weight: "bold", size: 12 },
          anchor: "end",
          align: "end",
          clip: false, // Evita que o texto seja cortado
          formatter: (value, context) => {
            const chart = context.chart;
            const width = chart.width;
            const total = context.chart.data.datasets[
              context.datasetIndex
            ].data.reduce((a, b) => a + b, 0);
            if (width < 600) {
              const percentage = calculatePercentage(value, total);
              return percentage + "%";
            } else {
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            }
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutCubic",
      },
      layout: {
        padding: 0,
      },
    };
  }

  // Helper para mesclar opções específicas com as opções base
  function mergeOptions(base, custom) {
    return Chart.helpers.merge(base, custom);
  }

  /**
   * ========================================================
   * PIE CHART
   * ========================================================
   */
  function createPieChart(ctx, labels, dataValues, backgroundColors) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);
    const data = {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors || [
            BASE_VARS.corPrimaria1,
            BASE_VARS.corPrimaria2,
          ],
          borderColor: BASE_VARS.borda,
          borderWidth: 1,
        },
      ],
    };
    const pieCustom = {
      animation: {
        animateRotate: true,
        duration: 1200,
      },
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
          font: { weight: "bold", size: 14 },
          clip: false,
          formatter: (value) => value,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
    };
    const finalOptions = mergeOptions(getBaseChartOptions(), pieCustom);
    return new Chart(ctx, {
      type: "pie",
      data,
      options: finalOptions,
    });
  }

  /**
   * ========================================================
   * DOUGHNUT CHART
   * ========================================================
   */
  function createDoughnutChart(ctx, labels, dataValues, backgroundColors) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);
    const data = {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors || [
            BASE_VARS.corPrimaria1,
            BASE_VARS.corPrimaria2,
          ],
          borderColor: BASE_VARS.borda,
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
    };
    const doughnutCustom = {
      cutout: "60%",
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1200,
      },
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
          font: { weight: "bold", size: 14 },
          clip: false,
          formatter: (value) => value,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
    };
    const finalOptions = mergeOptions(getBaseChartOptions(), doughnutCustom);
    return new Chart(ctx, {
      type: "doughnut",
      data,
      options: finalOptions,
    });
  }

  /**
   * ========================================================
   * BAR CHART (Vertical)
   * ========================================================
   */
  function createBarChart(ctx, labels, dataValues, getColorFn) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);
    const data = {
      labels,
      datasets: [
        {
          label: "Dados",
          data: dataValues,
          backgroundColor: function (context) {
            if (typeof getColorFn === "function") {
              return getColorFn(context, BASE_VARS);
            }
            return BASE_VARS.corPrimaria1;
          },
          borderRadius: 6,
        },
      ],
    };
    const barCustom = {
      scales: {
        x: {
          grid: { color: BASE_VARS.divisor, borderColor: BASE_VARS.borda },
          ticks: { color: BASE_VARS.txtSubtitulo },
        },
        y: {
          beginAtZero: true,
          grid: { color: BASE_VARS.divisor, borderColor: BASE_VARS.borda },
          ticks: { color: BASE_VARS.txtSubtitulo },
        },
      },
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "center",
          align: "center",
          clip: false,
          font: { weight: "bold", size: 12 },
          // Exibe valor e percentual de forma responsiva
          formatter: function (value, context) {
            const chart = context.chart;
            const width = chart.width;
            if (width < 600) {
              const percentage = calculatePercentage(value, total);
              return percentage + "%";
            } else {
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            }
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutBounce",
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
        },
      },
    };
    const finalOptions = mergeOptions(getBaseChartOptions(), barCustom);
    return new Chart(ctx, {
      type: "bar",
      data,
      options: finalOptions,
    });
  }

  /**
   * ========================================================
   * LINE CHART
   * ========================================================
   */
  function createLineChart(ctx, labels, dataValues) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);
    const data = {
      labels,
      datasets: [
        {
          label: "Dados",
          data: dataValues,
          fill: false,
          borderColor: BASE_VARS.corPrimaria2,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHitRadius: 15,
          backgroundColor: function (context) {
            const chartArea = context.chart.chartArea;
            if (!chartArea) return BASE_VARS.corPrimaria1;

            const ctx2 = context.chart.ctx;
            const gradient = ctx2.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, BASE_VARS.corPrimaria1);
            gradient.addColorStop(1, BASE_VARS.corPrimaria2);
            return gradient;
          },
        },
      ],
    };
    const lineCustom = {
      interaction: { mode: "nearest", intersect: true },
      scales: {
        x: {
          grid: { display: false, borderColor: BASE_VARS.borda },
          ticks: { color: BASE_VARS.txtSubtitulo },
        },
        y: {
          beginAtZero: false,
          grid: { color: BASE_VARS.divisor, borderColor: BASE_VARS.borda },
          ticks: { color: BASE_VARS.txtSubtitulo },
        },
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
          clip: false,
          font: { weight: "bold", size: 12 },
          color: BASE_VARS.txtDestaque,
          // Exibe valor e percentual de forma responsiva
          formatter: function (value, context) {
            const chart = context.chart;
            const width = chart.width;
            if (width < 600) {
              const percentage = calculatePercentage(value, total);
              return percentage + "%";
            } else {
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            }
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeInOutCubic",
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
        },
      },
    };
    const finalOptions = mergeOptions(getBaseChartOptions(), lineCustom);
    return new Chart(ctx, {
      type: "line",
      data,
      options: finalOptions,
    });
  }

  /**
   * ========================================================
   * POLAR AREA CHART
   * ========================================================
   */
  function createPolarAreaChart(ctx, labels, dataValues, backgroundColors) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);
    const data = {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors || [
            BASE_VARS.corPrimaria1,
            BASE_VARS.corPrimaria2,
            BASE_VARS.corSecundaria1,
            BASE_VARS.corSecundaria2,
            BASE_VARS.corSecundaria3,
          ],
          borderColor: BASE_VARS.borda,
          borderWidth: 1,
        },
      ],
    };
    const polarCustom = {
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
      },
      scales: {
        r: {
          grid: { color: BASE_VARS.divisor },
          angleLines: { color: BASE_VARS.borda },
          ticks: {
            backdropColor: "transparent",
            color: BASE_VARS.txtSubtitulo,
          },
          pointLabels: {
            color: BASE_VARS.txtSubtitulo,
            font: { size: 12 },
          },
        },
      },
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
          font: { weight: "bold", size: 14 },
          clip: false,
          formatter: (value) => value,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Em PolarArea, o valor é context.raw
              const value = context.raw;
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
    };
    const finalOptions = mergeOptions(getBaseChartOptions(), polarCustom);
    return new Chart(ctx, {
      type: "polarArea",
      data,
      options: finalOptions,
    });
  }

  /**
   * ========================================================
   * RADAR CHART
   * ========================================================
   */
  function createRadarChart(ctx, labels, dataValues) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);
    const data = {
      labels,
      datasets: [
        {
          label: "Indicadores",
          data: dataValues,
          fill: true,
          borderColor: BASE_VARS.corPrimaria2,
          borderWidth: 2,
          backgroundColor: function (context) {
            const chartArea = context.chart.chartArea;
            if (!chartArea) return BASE_VARS.corPrimaria1;
            const ctx2 = context.chart.ctx;
            const gradient = ctx2.createLinearGradient(
              chartArea.left,
              chartArea.top,
              chartArea.right,
              chartArea.bottom
            );
            gradient.addColorStop(0, BASE_VARS.corPrimaria1);
            gradient.addColorStop(1, BASE_VARS.corPrimaria2);
            return gradient;
          },
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBorderColor: BASE_VARS.corPrimaria2,
        },
      ],
    };
    const radarCustom = {
      scales: {
        r: {
          angleLines: { color: BASE_VARS.borda },
          grid: { color: BASE_VARS.divisor },
          suggestedMin: 0,
          ticks: {
            backdropColor: "transparent",
            color: BASE_VARS.txtSubtitulo,
          },
          pointLabels: {
            color: BASE_VARS.txtSubtitulo,
            font: { size: 14 },
          },
        },
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
          clip: false,
          font: { weight: "bold", size: 12 },
          color: BASE_VARS.txtDestaque,
          // Exibe valor e percentual de forma responsiva
          formatter: function (value, context) {
            const chart = context.chart;
            const width = chart.width;
            const percentage = calculatePercentage(value, total);
            if (width < 600) {
              return percentage + "%";
            } else {
              return value + " - " + percentage + "%";
            }
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Em RadarChart, o valor fica em context.parsed.r
              const value = context.parsed.r;
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
      animation: {
        duration: 1200,
        easing: "easeInOutCubic",
      },
    };
    const finalOptions = mergeOptions(getBaseChartOptions(), radarCustom);
    return new Chart(ctx, {
      type: "radar",
      data,
      options: finalOptions,
    });
  }

  /**
   * ========================================================
   * HORIZONTAL BAR CHART (MODIFICADO)
   * ========================================================
   */
  function createHorizontalBarChart(ctx, labels, dataValues, getColorFn) {
    const total = dataValues.reduce((acc, curr) => acc + curr, 0);

    const data = {
      labels,
      datasets: [
        {
          label: "Indicadores",
          data: dataValues,
          backgroundColor: function (context) {
            if (typeof getColorFn === "function") {
              return getColorFn(context, BASE_VARS);
            }
            return BASE_VARS.corPrimaria1;
          },
          borderRadius: 6,
        },
      ],
    };

    const horizontalBarCustom = {
      indexAxis: "y", // BARRAS HORIZONTAIS
      scales: {
        y: {
          grid: { color: BASE_VARS.divisor, borderColor: BASE_VARS.borda },
          ticks: { color: BASE_VARS.txtSubtitulo },
        },
        x: {
          beginAtZero: true,
          grid: { color: BASE_VARS.divisor, borderColor: BASE_VARS.borda },
          ticks: { color: BASE_VARS.txtSubtitulo },
        },
      },
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "center",
          align: "center",
          clip: false,
          font: { weight: "bold", size: 12 },
          // Exibe valor e percentual de forma responsiva
          formatter: function (value, context) {
            const chart = context.chart;
            const width = chart.width;
            const percentage = calculatePercentage(value, total);
            if (width < 600) {
              return percentage + "%";
            } else {
              return value + " - " + percentage + "%";
            }
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed.x; // valor em x para horizontal
              const percentage = calculatePercentage(value, total);
              return value + " - " + percentage + "%";
            },
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutBounce",
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
        },
      },
    };

    const finalOptions = mergeOptions(
      getBaseChartOptions(),
      horizontalBarCustom
    );
    return new Chart(ctx, {
      type: "bar",
      data,
      options: finalOptions,
    });
  }

  // 7) Expondo as funções globalmente para uso em outras páginas
  window.ChartBase = {
    createPieChart,
    createDoughnutChart,
    createBarChart,
    createLineChart,
    createPolarAreaChart,
    createRadarChart,
    createHorizontalBarChart, // Horizontal Bar com datalabel "valor - percentual%"
  };
})();
