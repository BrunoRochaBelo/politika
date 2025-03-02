// charts-base.js
(function () {
  /**
   * Exibe um erro amigável ao usuário.
   * @param {string} msg - Mensagem de erro a ser exibida.
   */
  function showErrorMessage(msg) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent = msg;
    document.body.appendChild(errorContainer);
  }

  // --------------------------------------------------------------------------
  // 1) Verificação da Disponibilidade do Chart.js
  // --------------------------------------------------------------------------
  if (typeof Chart === "undefined") {
    showErrorMessage("Chart.js não foi carregado antes de charts-base.js!");
    return;
  }

  // --------------------------------------------------------------------------
  // 2) Registro de Plugins (DataLabels, etc.)
  // --------------------------------------------------------------------------
  if (typeof ChartDataLabels !== "undefined") {
    Chart.register(ChartDataLabels);
  } else {
    console.warn("chartjs-plugin-datalabels não foi encontrado.");
  }

  // --------------------------------------------------------------------------
  // 3) Definição das Paletas de Cores para Claro e Escuro com Novas Propriedades
  // --------------------------------------------------------------------------
  const colorPaletteLight = {
    colors: [
      "hsl(215, 65%, 45%)", // Primária 1
      "hsl(30, 80%, 55%)", // Secundária 1
      "hsl(215, 60%, 65%)", // Primária 2
      "hsl(30, 80%, 50%)", // Secundária 2
      "hsl(215, 70%, 60%)", // Primária 3
      "hsl(30, 65%, 35%)", // Secundária 3
      "hsl(215, 20%, 80%)", // Apoio 1
      "hsl(215, 20%, 85%)", // Apoio 2
      "hsl(218, 100%, 22%)", // Destaque Texto
      "hsl(0, 70%, 50%)", // Erro
    ],
    textColor: "#333333", // Textos e números no modo claro
    borderColor: "hsl(215, 25%, 70%)", // Bordas no modo claro
    axisLabelColor: "hsl(215, 10%, 46%)", // Rótulos dos eixos no modo claro
    tooltipBackgroundColor: "rgba(255, 255, 255, 0.9)", // Tooltip no modo claro
    tooltipBodyColor: "#333333", // Texto da tooltip no modo claro
    tooltipTitleColor: "#333333", // Título da tooltip no modo claro
  };

  const colorPaletteDark = {
    colors: [
      "hsl(218, 85%, 68%)", // Primária 1
      "hsl(30, 75%, 58%)", // Secundária 1
      "hsl(218, 60%, 58%)", // Primária 2
      "hsl(30, 70%, 50%)", // Secundária 2
      "hsl(218, 80%, 72%)", // Primária 3
      "hsl(30, 65%, 40%)", // Secundária 3
      "hsl(215, 25%, 20%)", // Apoio 1
      "hsl(215, 20%, 16%)", // Apoio 2
      "hsl(218, 100%, 90%)", // Destaque Texto
      "hsl(0, 60%, 45%)", // Erro
    ],
    textColor: "#ffffff", // Textos e números no modo escuro
    borderColor: "hsl(215, 30%, 32%)", // Bordas no modo escuro
    axisLabelColor: "hsl(215, 18%, 78%)", // Rótulos dos eixos no modo escuro
    tooltipBackgroundColor: "hsla(215, 50%, 8%, 0.8)", // Tooltip no modo escuro
    tooltipBodyColor: "#ffffff", // Texto da tooltip no modo escuro
    tooltipTitleColor: "#ffffff", // Título da tooltip no modo escuro
  };

  /**
   * Retorna a paleta de cores atual com base no tema.
   * @returns {object} - Objeto da paleta de cores atual.
   */
  function getCurrentColorPalette() {
    return document.documentElement.classList.contains("light-mode")
      ? colorPaletteLight
      : colorPaletteDark;
  }

  // --------------------------------------------------------------------------
  // 4) Função Auxiliar para Calcular Percentual
  // --------------------------------------------------------------------------
  function getPercentage(value, total) {
    if (!total || total === 0) return "0.00";
    return ((value / total) * 100).toFixed(2);
  }

  // --------------------------------------------------------------------------
  // 5) Configuração Base dos Gráficos
  // --------------------------------------------------------------------------
  function getBaseChartOptions() {
    const palette = getCurrentColorPalette();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: palette.tooltipBackgroundColor, // Cor dinâmica do tooltip
          borderRadius: 4,
          bodyColor: palette.tooltipBodyColor, // Cor do texto do tooltip
          titleColor: palette.tooltipTitleColor, // Cor do título do tooltip
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              if (tooltipItems.length > 0) {
                return tooltipItems[0].label || "";
              }
              return "";
            },
            label: (context) => {
              const ds = context.dataset;
              const index = context.dataIndex;
              const value = ds.data[index] ?? 0;
              const total = Array.isArray(ds.data)
                ? ds.data.reduce((acc, v) => acc + (v || 0), 0)
                : 0;
              const percentage = getPercentage(value, total);
              return [`Qnt: ${value}`, `Percent: ${percentage}%`]; // Retorna array para múltiplas linhas
            },
          },
        },
        datalabels: {
          color: palette.textColor, // Atualizar cor dos datalabels
          font: { weight: "bold", size: 12 },
          anchor: "end",
          align: "end",
          clip: false,
          formatter: (value, context) => {
            const ds = context.dataset;
            const index = context.dataIndex;
            const val = ds.data[index] ?? 0;
            const total = Array.isArray(ds.data)
              ? ds.data.reduce((acc, v) => acc + (v || 0), 0)
              : 0;
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
            color: palette.textColor, // Atualizar cor das legendas
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
  // 6) Função Auxiliar para Mesclar Opções
  // --------------------------------------------------------------------------
  function mergeOptions(base, custom) {
    return Chart.helpers.merge(base, custom);
  }

  // --------------------------------------------------------------------------
  // 7) Função Auxiliar para Criar Gradiente
  // --------------------------------------------------------------------------
  /**
   * Cria um gradiente linear.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} chartArea - Objeto com dimensões do chart.
   * @param {string} orientation - 'vertical' ou 'horizontal'.
   * @param {string} colorStart - Cor inicial do gradiente.
   * @param {string} colorEnd - Cor final do gradiente.
   * @returns {CanvasGradient|string} - Gradiente criado ou cor fixa.
   */
  function createGradient(ctx, chartArea, orientation, colorStart, colorEnd) {
    if (!chartArea) return colorStart || "#ccc"; // Fallback

    let gradient;
    if (orientation === "horizontal") {
      gradient = ctx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0
      );
    } else {
      // Default: vertical
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
  // 8) Função Genérica para Criar Gráficos
  // --------------------------------------------------------------------------
  /**
   * Cria um gráfico genérico.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações do gráfico.
   * @returns {Chart|null} - Instância do Chart.js ou null em caso de erro.
   */
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
    const chartInstance = new Chart(ctx, {
      type,
      data: {
        labels: labels || [],
        datasets,
      },
      options: finalOptions,
    });
    window.ChartBase.charts.push(chartInstance); // Armazenar referência
    return chartInstance;
  }

  // --------------------------------------------------------------------------
  // 9) Funções Especializadas para Cada Tipo de Gráfico
  // --------------------------------------------------------------------------

  /**
   * Cria um Pie Chart.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Pie Chart.
   * @returns {Chart|null} - Instância do Pie Chart ou null em caso de erro.
   */
  function createPieChart(ctx, { labels, datasets, options }) {
    const pieCustom = {
      animation: { animateRotate: true, duration: 1200 },
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
        },
        legend: {
          display: true, // Manter legendas para PieChart
        },
      },
      scales: {}, // Remover escalas para PieChart
    };
    const finalOptions = mergeOptions(pieCustom, options || {});

    // Adiciona hoverOffset se não estiver definido
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      hoverOffset: ds.hoverOffset !== undefined ? ds.hoverOffset : 10, // Valor padrão
      backgroundColor: ds.backgroundColor || colorPaletteLight.colors, // Utiliza a nova paleta
    }));

    return createChart(ctx, {
      type: "pie",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Cria um Doughnut Chart.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Doughnut Chart.
   * @returns {Chart|null} - Instância do Doughnut Chart ou null em caso de erro.
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
        legend: {
          display: true, // Manter legendas para DoughnutChart
        },
      },
      scales: {}, // Remover escalas para DoughnutChart
    };
    const finalOptions = mergeOptions(doughnutCustom, options || {});

    // Adiciona hoverOffset se não estiver definido
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      hoverOffset: ds.hoverOffset !== undefined ? ds.hoverOffset : 10, // Valor padrão
      backgroundColor: ds.backgroundColor || colorPaletteDark.colors, // Utiliza a nova paleta
    }));

    return createChart(ctx, {
      type: "doughnut",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Cria um Bar Chart (vertical).
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Bar Chart.
   * @returns {Chart|null} - Instância do Bar Chart ou null em caso de erro.
   */
  function createBarChart(ctx, { labels, datasets, options }) {
    const palette = getCurrentColorPalette();
    const defaultBar = {
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: palette.axisLabelColor }, // Cor dinâmica para rótulos do eixo X
        },
        y: {
          beginAtZero: true,
          grid: { display: false },
          ticks: { color: palette.axisLabelColor }, // Cor dinâmica para rótulos do eixo Y
        },
      },
      plugins: {
        legend: { display: false }, // Remover legenda para BarChart
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
      datasets: {
        backgroundColor: palette.colors, // Utiliza a nova paleta
        borderColor: palette.borderColor,
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
   * Cria um Line Chart.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Line Chart.
   * @returns {Chart|null} - Instância do Line Chart ou null em caso de erro.
   */
  function createLineChart(
    ctx,
    { labels, datasets, options, gradientOrientation = "vertical" }
  ) {
    // Se backgroundColor === 'gradient', criaremos o gradiente dinâmico
    const augmentedDatasets = datasets.map((ds) => {
      const origBg = ds.backgroundColor;
      // Usar palette.colors[0] para a linha e os pontos
      const lineColor = getCurrentColorPalette().colors[0];
      return {
        ...ds,
        borderColor: lineColor, // Linha na cor do ponto
        pointBackgroundColor: lineColor, // Pontos na cor do ponto
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
            const palette = getCurrentColorPalette();
            return createGradient(
              context.chart.ctx,
              chartArea,
              gradientOrientation,
              palette.colors[0], // Azul ou equivalente no tema atual
              palette.colors[1] // Verde-água ou equivalente no tema atual
            );
          }
          return origBg;
        },
      };
    });

    const palette = getCurrentColorPalette();
    const defaultLine = {
      interaction: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        x: {
          offset: true,
          grid: { display: false },
          ticks: { color: palette.axisLabelColor }, // Cor dinâmica para rótulos do eixo X
        },
        y: {
          beginAtZero: false,
          grid: { display: false },
          ticks: { color: palette.axisLabelColor }, // Cor dinâmica para rótulos do eixo Y
          grace: "10%",
        },
      },
      plugins: {
        legend: { display: false }, // Remover legenda para LineChart
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
   * Cria um Polar Area Chart.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Polar Area Chart.
   * @returns {Chart|null} - Instância do Polar Area Chart ou null em caso de erro.
   */
  function createPolarAreaChart(ctx, { labels, datasets, options }) {
    const palette = getCurrentColorPalette();
    const defaultPolar = {
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
      },
      plugins: {
        legend: {
          display: true, // Manter legendas para PolarAreaChart
          labels: {
            color: palette.textColor, // Cor dinâmica para legendas
          },
        },
      },
      scales: {
        r: {
          grid: { display: false },
          angleLines: { display: false },
          ticks: { display: false },
          pointLabels: { display: false },
        },
      },
    };
    const finalOptions = mergeOptions(defaultPolar, options || {});
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || palette.colors, // Utiliza a nova paleta
    }));
    return createChart(ctx, {
      type: "polarArea",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  /**
   * Cria um Radar Chart.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Radar Chart.
   * @returns {Chart|null} - Instância do Radar Chart ou null em caso de erro.
   */
  function createRadarChart(ctx, { labels, datasets, options }) {
    const palette = getCurrentColorPalette();
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      borderWidth: ds.borderWidth !== undefined ? ds.borderWidth : 2,
      backgroundColor: function (context) {
        const chartArea = context.chart.chartArea;
        if (!chartArea) return palette.colors[0]; // Cor fixa
        const gradient = context.chart.ctx.createLinearGradient(
          chartArea.left,
          chartArea.top,
          chartArea.right,
          chartArea.bottom
        );
        gradient.addColorStop(0, palette.colors[0]); // Primária 1
        gradient.addColorStop(1, palette.colors[1]); // Secundária 1
        return gradient;
      },
      borderColor: palette.colors[0],
    }));

    const defaultRadar = {
      plugins: {
        legend: {
          display: true, // Manter legenda para RadarChart
          labels: {
            color: palette.textColor, // Cor dinâmica para legendas
          },
        },
      },
      animation: {
        duration: 1200,
        easing: "easeInOutCubic",
      },
      scales: {}, // Remover escalas para RadarChart
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
   * Cria um Bar Chart (horizontal).
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações específicas do Horizontal Bar Chart.
   * @returns {Chart|null} - Instância do Horizontal Bar Chart ou null em caso de erro.
   */
  function createHorizontalBarChart(ctx, { labels, datasets, options }) {
    const palette = getCurrentColorPalette();
    const defaultHorizontalBar = {
      indexAxis: "y",
      scales: {
        y: {
          grid: { display: false },
          ticks: { color: palette.axisLabelColor }, // Cor dinâmica para rótulos do eixo Y
        },
        x: {
          beginAtZero: true,
          grid: { display: false },
          ticks: { color: palette.axisLabelColor }, // Cor dinâmica para rótulos do eixo X
        },
      },
      plugins: {
        legend: { display: false }, // Remover legenda para HorizontalBarChart
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
      datasets: {
        backgroundColor: palette.colors, // Utiliza a nova paleta
        borderColor: palette.borderColor,
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
  // 10) NOVAS FUNÇÕES: Gráficos de Barra de Progresso (Vertical e Horizontal)
  // --------------------------------------------------------------------------

  /**
   * Cria um gráfico de barra de progresso vertical.
   * Ideal para exibir percentuais (0 a 100) sem a exibição de eixos e legendas.
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações do gráfico: { labels, datasets, options }.
   * @returns {Chart|null} - Instância do gráfico ou null em caso de erro.
   */
  function createVerticalProgressBarChart(ctx, { labels, datasets, options }) {
    const palette = getCurrentColorPalette();
    const defaultVerticalProgress = {
      indexAxis: "x", // Barras verticais
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          display: false,
          beginAtZero: true,
          max: 100, // Valor máximo padrão (100%); pode ser sobrescrito via options
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          display: true,
          color: palette.textColor,
          font: { weight: "bold", size: 12 },
          formatter: (value) => value + "%",
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutCubic",
      },
      layout: {
        padding: {
          top: 5,
          bottom: 5,
        },
      },
    };
    const finalOptions = mergeOptions(defaultVerticalProgress, options || {});
    return createChart(ctx, {
      type: "bar",
      labels,
      datasets,
      options: finalOptions,
    });
  }

  /**
   * Cria um gráfico de barra de progresso horizontal com estilo adaptado.
   * A ideia é aproximar o visual do gráfico ao dos elementos HTML (ex.: .account-progress-bar-wrapper e .account-progress-bar).
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas.
   * @param {object} config - Configurações do gráfico: { labels, datasets, options }.
   * @returns {Chart|null} - Instância do gráfico ou null em caso de erro.
   */
  function createHorizontalProgressBarChart(
    ctx,
    { labels, datasets, options }
  ) {
    const palette = getCurrentColorPalette();
    const defaultHorizontalProgress = {
      indexAxis: "y", // Gráfico horizontal
      scales: {
        x: {
          display: false,
          beginAtZero: true,
          max: 100, // Percentual máximo (100%)
          grid: { display: false },
        },
        y: {
          display: false,
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          display: true,
          color: palette.textColor,
          font: { weight: "bold", size: 12 },
          formatter: (value) => value + "%",
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutCubic",
      },
      layout: {
        padding: {
          top: 5,
          bottom: 5,
        },
      },
      // Configurações para aproximar o visual da barra ao estilo CSS desejado:
      datasets: {
        barThickness: 16, // Altura fixa similar à .account-progress-bar-wrapper
        borderRadius: 10, // Arredondamento similar ao border-radius definido
      },
    };
    const finalOptions = mergeOptions(defaultHorizontalProgress, options || {});

    // Garante que cada dataset utilize as propriedades definidas caso não estejam definidas individualmente.
    const augmentedDatasets = datasets.map((ds) => ({
      ...ds,
      borderRadius: ds.borderRadius !== undefined ? ds.borderRadius : 10,
      barThickness: ds.barThickness !== undefined ? ds.barThickness : 16,
    }));

    return createChart(ctx, {
      type: "bar",
      labels,
      datasets: augmentedDatasets,
      options: finalOptions,
    });
  }

  // --------------------------------------------------------------------------
  // 11) Exportação das Funções Reutilizáveis
  // --------------------------------------------------------------------------
  window.ChartBase = {
    charts: [],
    createPieChart,
    createDoughnutChart,
    createBarChart,
    createLineChart,
    createPolarAreaChart,
    createRadarChart,
    createHorizontalBarChart,
    createVerticalProgressBarChart, // Novo: Progress Bar Vertical
    createHorizontalProgressBarChart, // Novo: Progress Bar Horizontal
    getCurrentColorPalette, // Função para acessar a paleta atual
  };

  // --------------------------------------------------------------------------
  // 12) Listener para Mudanças de Tema
  // --------------------------------------------------------------------------
  document.addEventListener("themeChanged", () => {
    const palette = getCurrentColorPalette();
    window.ChartBase.charts.forEach((chart) => {
      // Atualizar cores de legendas
      if (
        chart.options.plugins &&
        chart.options.plugins.legend &&
        chart.options.plugins.legend.labels
      ) {
        chart.options.plugins.legend.labels.color = palette.textColor;
      }

      // Atualizar cores dos datalabels
      if (chart.options.plugins && chart.options.plugins.datalabels) {
        chart.options.plugins.datalabels.color = palette.textColor;
      }

      // Atualizar tooltips
      if (chart.options.plugins && chart.options.plugins.tooltip) {
        chart.options.plugins.tooltip.bodyColor = palette.tooltipBodyColor; // Cor do texto do tooltip
        chart.options.plugins.tooltip.titleColor = palette.tooltipTitleColor; // Cor do título do tooltip
        chart.options.plugins.tooltip.backgroundColor =
          palette.tooltipBackgroundColor; // Cor do background do tooltip
      }

      // Atualizar cores dos eixos
      if (chart.options.scales) {
        if (chart.options.scales.x && chart.options.scales.x.ticks) {
          chart.options.scales.x.ticks.color = palette.axisLabelColor;
        }
        if (chart.options.scales.y && chart.options.scales.y.ticks) {
          chart.options.scales.y.ticks.color = palette.axisLabelColor;
        }
        // Adicione outros eixos se necessário
      }

      // Atualizar cores dos datasets (se não usarem funções para gradientes)
      chart.data.datasets.forEach((dataset, index) => {
        if (dataset.preserveBorderColor) {
          // Não alterar borderColor
          return;
        }

        if (Array.isArray(dataset.backgroundColor)) {
          // Atualizar cada cor no array usando a paleta atual
          dataset.backgroundColor = dataset.backgroundColor.map(
            (color, i) => palette.colors[i % palette.colors.length]
          );
        } else if (typeof dataset.backgroundColor === "function") {
          // Se usar função para gradiente, o gradiente será recriado automaticamente no próximo update
          // Nenhuma ação necessária aqui
        } else {
          // Atualizar cor sólida
          dataset.backgroundColor = palette.colors[0];
          dataset.borderColor = palette.borderColor;
        }

        // Atualizar borderColor se for uma cor sólida
        if (typeof dataset.borderColor === "string") {
          dataset.borderColor = palette.borderColor;
        }
      });

      chart.update();
    });
  });
})();
