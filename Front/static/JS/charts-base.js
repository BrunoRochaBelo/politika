// charts-base.js
(function () {
  /**
   * Exibe erro amigável ao usuário, usando as classes CSS padrão do sistema.
   * Ex.: .message-error, .message-error.show
   * @param {string} msg Mensagem de erro a ser exibida
   */
  function showErrorMessage(msg) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent = msg;
    document.body.appendChild(errorContainer);
  }

  // --------------------------------------------------------------------------
  // 1) Verifica se o Chart.js está disponível
  // --------------------------------------------------------------------------
  if (typeof Chart === "undefined") {
    showErrorMessage("Chart.js não foi carregado antes de charts-base.js!");
    return;
  }

  // --------------------------------------------------------------------------
  // 2) Registro de plugins (DataLabels, Zoom, etc.)
  // --------------------------------------------------------------------------
  if (typeof ChartDataLabels !== "undefined") {
    Chart.register(ChartDataLabels);
  } else {
    console.warn("chartjs-plugin-datalabels não foi encontrado.");
  }
  // if (typeof Zoom !== 'undefined') { Chart.register(Zoom); }

  // --------------------------------------------------------------------------
  // 3) Variáveis CSS e refresh dinâmico
  // --------------------------------------------------------------------------
  let BASE_VARS = {};

  /**
   * Releitura das variáveis CSS para permitir troca de temas dinâmicos.
   * Esta função pode ser chamada novamente caso o tema seja alterado.
   */
  function updateBaseVars() {
    function getCSSVariable(varName) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    }
    BASE_VARS = {
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
  }

  // Faz a leitura inicial das variáveis CSS
  updateBaseVars();

  // --------------------------------------------------------------------------
  // 4) Função auxiliar para calcular o percentual
  // --------------------------------------------------------------------------
  function getPercentage(value, total) {
    if (!total || total === 0) return "0.00";
    return ((value / total) * 100).toFixed(2);
  }

  // --------------------------------------------------------------------------
  // 5) Configuração base (tooltips e datalabels)
  // --------------------------------------------------------------------------
  function getBaseChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        /**
         * Tooltip:
         *  - Título (primeira linha) => label do item (geralmente o label do eixo X ou o label da fatia)
         *  - Segunda linha => "valor real - percentual"
         */
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: 4,
          bodyColor: "#fff",
          displayColors: false,
          callbacks: {
            // Título => label do ponto/fatia
            title: (tooltipItems) => {
              if (tooltipItems.length > 0) {
                return tooltipItems[0].label || "";
              }
              return "";
            },
            // Segunda linha => "valor real - percentual%"
            label: (context) => {
              const ds = context.dataset;
              const index = context.dataIndex;

              // Valor real que está no array de dados
              const value = ds.data[index] ?? 0;

              // Soma total do dataset para gerar %
              let total = 0;
              if (Array.isArray(ds.data)) {
                total = ds.data.reduce((acc, v) => acc + (v || 0), 0);
              }

              const percentage = getPercentage(value, total);
              return `${value} - ${percentage}%`;
            },
          },
        },

        /**
         * DataLabels:
         *   - Exibe apenas o percentual
         *   - Para Pie/Doughnut, sobrescrevemos anchor/align localmente
         */
        datalabels: {
          color: BASE_VARS.txtDestaque,
          font: { weight: "bold", size: 12 },
          anchor: "end",
          align: "end",
          clip: false,
          formatter: (value, context) => {
            // "context.dataIndex" => índice do item
            // "context.dataset.data" => array de valores
            const ds = context.dataset;
            const index = context.dataIndex;
            const val = ds.data[index] ?? 0;

            let total = 0;
            if (Array.isArray(ds.data)) {
              total = ds.data.reduce((acc, v) => acc + (v || 0), 0);
            }

            const p = getPercentage(val, total);
            return p + "%";
          },
        },

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

  // --------------------------------------------------------------------------
  // 6) Helpers para mesclar opções e criar gradiente
  // --------------------------------------------------------------------------
  function mergeOptions(base, custom) {
    return Chart.helpers.merge(base, custom);
  }

  /**
   * Cria um gradiente de acordo com a orientação solicitada. Se nada for informado,
   * assume 'vertical'. Caso queira 'horizontal', basta passar 'horizontal'.
   *
   * @param {CanvasRenderingContext2D} ctx Contexto do canvas
   * @param {object} chartArea Objeto com dimensões do chart
   * @param {string} orientation 'vertical' | 'horizontal' (default: 'vertical')
   * @param {string} colorStart Cor inicial
   * @param {string} colorEnd   Cor final
   * @returns Gradiente para usar em backgroundColor / fillStyle
   */
  function createGradient(ctx, chartArea, orientation, colorStart, colorEnd) {
    if (!chartArea) return colorStart || "#ccc"; // fallback

    let gradient;
    if (orientation === "horizontal") {
      gradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0
      );
    } else {
      // default: vertical
      gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
    }
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  }

  // --------------------------------------------------------------------------
  // 7) Função genérica createChart
  // --------------------------------------------------------------------------
  function createChart(ctx, { type, labels, datasets, options }) {
    if (!ctx) {
      showErrorMessage("Não foi possível criar o gráfico: Canvas inválido.");
      return null;
    }
    if (!Array.isArray(datasets)) {
      showErrorMessage(
        "Não foi possível criar o gráfico: 'datasets' deve ser um array."
      );
      return null;
    }
    const baseOptions = getBaseChartOptions();
    const finalOptions = mergeOptions(baseOptions, options || {});
    return new Chart(ctx, {
      type,
      data: {
        labels: labels || [],
        datasets,
      },
      options: finalOptions,
    });
  }

  // --------------------------------------------------------------------------
  // 8) Funções especializadas
  // --------------------------------------------------------------------------

  /**
   * Pie Chart
   *  - dataLabels dentro da fatia => anchor: 'center', align: 'center'
   *  - Hover offset reativado
   */
  function createPieChart(ctx, { labels, datasets, options }) {
    const pieCustom = {
      animation: { animateRotate: true, duration: 1200 },
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
        },
      },
    };
    const finalOptions = mergeOptions(pieCustom, options || {});

    // Adiciona hoverOffset se não estiver definido
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      hoverOffset: ds.hoverOffset !== undefined ? ds.hoverOffset : 10, // Valor padrão
    }));

    return createChart(ctx, {
      type: "pie",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Doughnut Chart
   *  - dataLabels dentro da fatia => anchor: 'center', align: 'center'
   *  - Hover offset reativado
   */
  function createDoughnutChart(ctx, { labels, datasets, options }) {
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
        },
      },
    };
    const finalOptions = mergeOptions(doughnutCustom, options || {});

    // Adiciona hoverOffset se não estiver definido
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      hoverOffset: ds.hoverOffset !== undefined ? ds.hoverOffset : 10, // Valor padrão
    }));

    return createChart(ctx, {
      type: "doughnut",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Bar Chart (vertical)
   */
  function createBarChart(ctx, { labels, datasets, options }) {
    const defaultBar = {
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
        legend: { display: true },
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
    const finalOptions = mergeOptions(defaultBar, options || {});
    return createChart(ctx, {
      type: "bar",
      labels,
      datasets,
      options: finalOptions,
    });
  }

  /**
   * Line Chart
   */
  function createLineChart(
    ctx,
    { labels, datasets, options, gradientOrientation = "vertical" }
  ) {
    // Se backgroundColor === 'gradient', criaremos o gradiente dinâmico
    const augmentedDatasets = datasets.map((ds) => {
      const origBg = ds.backgroundColor;
      const origBorder = ds.borderColor || BASE_VARS.corPrimaria2;
      return {
        ...ds,
        borderColor: origBorder,
        fill: ds.fill !== undefined ? ds.fill : false,
        tension: ds.tension !== undefined ? ds.tension : 0.3,
        pointRadius: ds.pointRadius !== undefined ? ds.pointRadius : 4,
        pointHoverRadius:
          ds.pointHoverRadius !== undefined ? ds.pointHoverRadius : 6,
        pointHitRadius:
          ds.pointHitRadius !== undefined ? ds.pointHitRadius : 15,
        backgroundColor: function (context) {
          if (origBg === "gradient") {
            const chartArea = context.chart.chartArea;
            return createGradient(
              context.chart.ctx,
              chartArea,
              gradientOrientation,
              BASE_VARS.corPrimaria1,
              BASE_VARS.corPrimaria2
            );
          }
          return origBg;
        },
      };
    });

    const defaultLine = {
      interaction: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        x: {
          offset: true,
          grid: {
            display: false,
            borderColor: BASE_VARS.borda,
          },
          ticks: {
            color: BASE_VARS.txtSubtitulo,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            color: BASE_VARS.divisor,
            borderColor: BASE_VARS.borda,
          },
          ticks: {
            color: BASE_VARS.txtSubtitulo,
          },
          grace: "10%",
        },
      },
      layout: {
        padding: {
          top: 40,
          bottom: 30,
        },
      },
      animation: {
        duration: 1500,
        easing: "easeInOutCubic",
      },
    };
    const finalOptions = mergeOptions(defaultLine, options || {});
    return createChart(ctx, {
      type: "line",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Polar Area Chart
   */
  function createPolarAreaChart(ctx, { labels, datasets, options }) {
    const defaultPolar = {
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
    };
    const finalOptions = mergeOptions(defaultPolar, options || {});
    return createChart(ctx, {
      type: "polarArea",
      labels,
      datasets,
      options: finalOptions,
    });
  }

  /**
   * Radar Chart
   */
  function createRadarChart(ctx, { labels, datasets, options }) {
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      borderWidth: ds.borderWidth !== undefined ? ds.borderWidth : 2,
      backgroundColor: function (context) {
        const chartArea = context.chart.chartArea;
        if (!chartArea) return BASE_VARS.corPrimaria1;
        const gradient = context.chart.ctx.createLinearGradient(
          chartArea.left,
          chartArea.top,
          chartArea.right,
          chartArea.bottom
        );
        gradient.addColorStop(0, BASE_VARS.corPrimaria1);
        gradient.addColorStop(1, BASE_VARS.corPrimaria2);
        return gradient;
      },
    }));

    const defaultRadar = {
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
      animation: {
        duration: 1200,
        easing: "easeInOutCubic",
      },
    };
    const finalOptions = mergeOptions(defaultRadar, options || {});
    return createChart(ctx, {
      type: "radar",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Bar Chart (horizontal)
   */
  function createHorizontalBarChart(ctx, { labels, datasets, options }) {
    const defaultHorizontalBar = {
      indexAxis: "y",
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
        legend: { display: true },
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
    const finalOptions = mergeOptions(defaultHorizontalBar, options || {});
    return createChart(ctx, {
      type: "bar",
      labels,
      datasets,
      options: finalOptions,
    });
  }

  // --------------------------------------------------------------------------
  // Expondo funções globalmente
  // --------------------------------------------------------------------------
  window.ChartBase = {
    updateBaseVars, // Para atualizar variáveis CSS dinamicamente
    createPieChart,
    createDoughnutChart,
    createBarChart,
    createLineChart,
    createPolarAreaChart,
    createRadarChart,
    createHorizontalBarChart,
  };
})();
