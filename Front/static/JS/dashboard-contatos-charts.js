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
    createDoughnutChart,
    createPolarAreaChart,
    createPieChart, // Certifique-se de incluir createPieChart
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
  // 1) Tipos de Contatos (Bar Chart) - Cores Sólidas
  // --------------------------------------------------------
  const ctxTipos = document
    .getElementById("chartTiposContatos")
    ?.getContext("2d");
  if (ctxTipos) {
    const palette = getCurrentColorPalette();
    const labels = [
      "Eleitor",
      "Funcionário",
      "Fornecedor",
      "Comissionado",
      "Liderança",
      "Político",
    ];
    const dataValues = [150, 70, 30, 25, 60, 15];

    const backgroundColors = [
      palette.colors[0], // Eleitor - Azul
      palette.colors[1], // Funcionário - Laranja
      palette.colors[2], // Fornecedor - Vermelho
      palette.colors[3], // Comissionado - Verde-água
      palette.colors[4], // Liderança - Verde
      palette.colors[5], // Político - Amarelo
    ];

    createBarChart(ctxTipos, {
      labels,
      datasets: [
        {
          label: "Tipos de Contatos",
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
  // 2) Perfil de Influência (PolarArea) - Cores Sólidas
  // --------------------------------------------------------
  const ctxPerfil = document
    .getElementById("chartPerfilInfluencia")
    ?.getContext("2d");
  if (ctxPerfil) {
    const palette = getCurrentColorPalette();
    const labels = [
      "1 Estrela",
      "2 Estrelas",
      "3 Estrelas",
      "4 Estrelas",
      "5 Estrelas",
    ];
    const dataValues = [30, 50, 90, 60, 10];

    const backgroundColors = [
      palette.colors[6], // 1 Estrela - Roxo
      palette.colors[7], // 2 Estrelas - Rosa
      palette.colors[8], // 3 Estrelas - Marrom
      palette.colors[9], // 4 Estrelas - Cinza
      palette.colors[0], // 5 Estrelas - Azul (reutilização)
    ];

    createPolarAreaChart(ctxPerfil, {
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
        legend: { display: false }, // Remover legenda para PolarAreaChart
      },
    });
  }

  // --------------------------------------------------------
  // 3) Residências de Apoio (Line Chart) - Cor Sólida e Responsivo
  // --------------------------------------------------------
  const ctxResidencias = document
    .getElementById("chartResidencias")
    ?.getContext("2d");
  if (ctxResidencias) {
    const palette = getCurrentColorPalette();
    createLineChart(ctxResidencias, {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Residências de Apoio",
          data: [12, 18, 22, 17, 25, 30],
          backgroundColor: palette.colors[0], // Azul Sólido para área preenchida
          borderColor: palette.colors[0], // Linha na cor do ponto
          pointBackgroundColor: palette.colors[0], // Pontos na cor do ponto
          hoverOffset: 10, // Opcional para consistência
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
      // Garantir que o gráfico seja responsivo
      responsive: true,
      maintainAspectRatio: false,
    });
  }

  // --------------------------------------------------------
  // 4) Localidade (Bairro) (Pie Chart) - Cores Sólidas em Azul
  // --------------------------------------------------------
  const ctxLocalidade = document
    .getElementById("chartLocalidade")
    ?.getContext("2d");
  if (ctxLocalidade) {
    const palette = getCurrentColorPalette();
    const labels = ["Bairro A", "Bairro B", "Bairro C", "Bairro D"];
    const dataValues = [40, 30, 20, 10];

    // Definindo cores sólidas em tons de azul para cada bairro usando colorPalette
    const backgroundColors = [
      palette.colors[0], // Bairro A - Azul Escuro
      palette.colors[1], // Bairro B - Laranja Claro
      palette.colors[0], // Bairro C - Azul (reutilização)
      palette.colors[1], // Bairro D - Laranja Claro (reutilização)
    ];

    createPieChart(ctxLocalidade, {
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
        legend: { display: false }, // Remover legenda para PieChart
      },
    });
  }
});
