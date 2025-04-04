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

// Função para formatar valores monetários
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// --------------------------------------------------------
// 1) KPIs
// --------------------------------------------------------
// Função para formatar valores monetários
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Função para animar contagem de um valor para outro
function animateCountUp(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  const startTime = performance.now();
  const startValue = start;
  const change = end - startValue;

  // Adicionar classe para efeito visual
  element.classList.add("kpi-updating");

  function updateCounter(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Função de easing para tornar o movimento mais natural
    const easedProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentValue = startValue + change * easedProgress;
    element.textContent = formatCurrency(currentValue);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Quando terminar a animação, remover classe de efeito
      element.classList.remove("kpi-updating");
    }
  }

  requestAnimationFrame(updateCounter);
}

// Função para animar porcentagem de variação
function animatePercentage(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  const startTime = performance.now();
  const startValue = 0;
  const change = end - startValue;

  function updateCounter(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Função de easing
    const easedProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentValue = startValue + change * easedProgress;
    element.textContent = currentValue.toFixed(1) + "%";

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Função para atualizar os KPIs com animação
function updateKPIs(
  currentExpense,
  previousExpense,
  currentRevenue,
  previousRevenue
) {
  // Animar valores monetários
  animateCountUp("expenseValue", 0, currentExpense, 1200);
  animateCountUp("revenueValue", 0, currentRevenue, 1200);

  // Calcular variações
  const expenseVariation =
    previousExpense > 0
      ? ((currentExpense - previousExpense) / previousExpense) * 100
      : 0;
  const revenueVariation =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  // Animar variações percentuais
  animatePercentage("expenseVariation", 0, expenseVariation, 1200);
  animatePercentage("revenueVariation", 0, revenueVariation, 1200);

  // Atualizar ícones e classes
  setTimeout(() => {
    if (expenseVariation > 0) {
      document.getElementById("expenseIcon").textContent = "▲";
      document.getElementById("expenseVariation").className = "kpi-down";
    } else if (expenseVariation < 0) {
      document.getElementById("expenseIcon").textContent = "▼";
      document.getElementById("expenseVariation").className = "kpi-up";
    } else {
      document.getElementById("expenseIcon").textContent = "•";
      document.getElementById("expenseVariation").className = "";
    }

    if (revenueVariation > 0) {
      document.getElementById("revenueIcon").textContent = "▲";
      document.getElementById("revenueVariation").className = "kpi-up";
    } else if (revenueVariation < 0) {
      document.getElementById("revenueIcon").textContent = "▼";
      document.getElementById("revenueVariation").className = "kpi-down";
    } else {
      document.getElementById("revenueIcon").textContent = "•";
      document.getElementById("revenueVariation").className = "";
    }
  }, 600);
}

// Adicionar um pequeno atraso para permitir que a DOM seja carregada
document.addEventListener("DOMContentLoaded", function () {
  // Despesas: Atual R$25.430,50 / Anterior R$23.150,00 (aumento de 9.8%)
  // Receitas: Atual R$42.750,20 / Anterior R$39.220,00 (aumento de 9.0%)
  setTimeout(() => {
    updateKPIs(25430.5, 23150.0, 42750.2, 39220.0);
  }, 300);
});
