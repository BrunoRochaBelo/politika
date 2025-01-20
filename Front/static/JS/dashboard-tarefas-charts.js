// dashboard-tarefas-charts.js

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o ChartBase está disponível
  if (!window.ChartBase) {
    console.error(
      "charts-base.js não foi carregado antes de dashboard-tarefas-charts.js!"
    );
    return;
  }

  // Extraímos as funções fábricas necessárias
  const {
    createBarChart,
    createHorizontalBarChart,
    createDoughnutChart,
    // ... se quiser outras
  } = window.ChartBase;

  // ========================================================
  // Função para obter variáveis CSS definidas no :root
  // ========================================================
  function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  // ========================================================
  // 1) Tarefas por Responsável (Horizontal Bar)
  // ========================================================
  const ctxResp = document
    .getElementById("chartTarefasResponsaveis")
    ?.getContext("2d");
  if (ctxResp) {
    // Supondo 10 responsáveis, nomes fictícios
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
    const dataValues = [10, 5, 7, 12, 4, 6, 9, 3, 8, 11]; // Exemplo

    // Função para criar gradiente por barra horizontal
    function respGradientFn(context, COLORS) {
      const index = context.dataIndex;
      const chartArea = context.chart.chartArea;
      if (!chartArea) return COLORS.corPrimaria1;

      const ctxGrad = context.chart.ctx;
      // De cima para baixo (vertical) em horizontal bar
      const gradient = ctxGrad.createLinearGradient(
        chartArea.left,
        chartArea.top,
        chartArea.left,
        chartArea.bottom
      );

      switch (index) {
        case 0:
          gradient.addColorStop(0, COLORS.corPrimaria1);
          gradient.addColorStop(1, COLORS.corPrimaria2);
          break;
        case 1:
          gradient.addColorStop(0, COLORS.corSecundaria1);
          gradient.addColorStop(1, COLORS.corSecundaria2);
          break;
        case 2:
          gradient.addColorStop(0, COLORS.corSecundaria3);
          gradient.addColorStop(1, COLORS.corSecundaria2);
          break;
        // ... e assim por diante para outros índices
        default:
          gradient.addColorStop(0, COLORS.corPrimaria1);
          gradient.addColorStop(1, COLORS.corPrimaria2);
          break;
      }
      return gradient;
    }

    // Chamamos a função horizontal
    createHorizontalBarChart(ctxResp, labels, dataValues, respGradientFn);
  }

  // ========================================================
  // 2) Tarefas por Status (Bar Vertical)
  // ========================================================
  const ctxStatus = document
    .getElementById("chartTarefasStatus")
    ?.getContext("2d");
  if (ctxStatus) {
    // Status: Todas, Novas, Andamento, Atrasadas, Concluídas
    const labels = ["Novas", "Andamento", "Atrasadas", "Concluídas"];
    // Exemplo: total de 80, sendo 15 novas, 25 andamento...
    const dataValues = [15, 25, 10, 30];

    function statusGradientFn(context, COLORS) {
      const index = context.dataIndex;
      const chartArea = context.chart.chartArea;
      if (!chartArea) return COLORS.corPrimaria1;

      const ctxGrad = context.chart.ctx;
      const gradient = ctxGrad.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );

      switch (index) {
        case 0:
          gradient.addColorStop(0, COLORS.corPrimaria1);
          gradient.addColorStop(1, COLORS.corApoio1);
          break;
        case 1:
          gradient.addColorStop(0, COLORS.corSecundaria1);
          gradient.addColorStop(1, COLORS.corSecundaria2);
          break;
        case 2:
          gradient.addColorStop(0, COLORS.corSecundaria3);
          gradient.addColorStop(1, COLORS.corSecundaria2);
          break;
        case 3:
          gradient.addColorStop(0, COLORS.corApoio1);
          gradient.addColorStop(1, COLORS.corApoio2);
          break;
        case 4:
          gradient.addColorStop(0, COLORS.corPrimaria2);
          gradient.addColorStop(1, COLORS.corApoio1);
          break;
        default:
          gradient.addColorStop(0, COLORS.corPrimaria1);
          gradient.addColorStop(1, COLORS.corPrimaria2);
      }
      return gradient;
    }

    createBarChart(ctxStatus, labels, dataValues, statusGradientFn);
  }

  // ========================================================
  // 3) Tarefas por Marcadores (Bar) - 12 marcadores
  // ========================================================
  const ctxMarcadores = document
    .getElementById("chartTarefasMarcadores")
    ?.getContext("2d");
  if (ctxMarcadores) {
    // Marcadores: 12 diferentes (marcador-0 até marcador-11)
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
    // Exemplo de valores
    const dataValues = [5, 8, 3, 10, 4, 2, 6, 12, 9, 1, 7, 11];

    // Definindo as cores via var(--cor-marcador-X) resolvidas
    const backgroundColors = [
      getCSSVariable("--cor-marcador-0"),
      getCSSVariable("--cor-marcador-1"),
      getCSSVariable("--cor-marcador-2"),
      getCSSVariable("--cor-marcador-3"),
      getCSSVariable("--cor-marcador-4"),
      getCSSVariable("--cor-marcador-5"),
      getCSSVariable("--cor-marcador-6"),
      getCSSVariable("--cor-marcador-7"),
      getCSSVariable("--cor-marcador-8"),
      getCSSVariable("--cor-marcador-9"),
      getCSSVariable("--cor-marcador-10"),
      getCSSVariable("--cor-marcador-11"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores dos Marcadores:", backgroundColors);

    // Em vez de gradiente, retornamos a cor pura do array (1 cor por marcador)
    function marcadoresColorFn(context, COLORS) {
      // Cada barra pega a cor do array respectivo
      return backgroundColors[context.dataIndex] || COLORS.corPrimaria1;
    }

    createBarChart(ctxMarcadores, labels, dataValues, marcadoresColorFn);
  }
});
