// dashboard-expense-charts.js
document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o arquivo base (charts-base.js) foi carregado
  if (!window.ChartBase) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("message-error", "show");
    errorContainer.textContent =
      "charts-base.js não foi carregado antes de dashboard-expense-charts.js!";
    document.body.appendChild(errorContainer);
    return;
  }

  // Extrai a função necessária do ChartBase
  const { createDoughnutChart } = window.ChartBase;

  // Seleciona os elementos do DOM
  const costCenterSelect = document.getElementById("cost-center-select");
  const centerText = document.getElementById("center-text");
  const availableValue = document.getElementById("available-value");
  const accountsList = document.getElementById("accounts-list");
  const loadingIndicatorContent = document.getElementById(
    "loading-indicator-content"
  );
  const loadingIndicatorHeader = document.getElementById(
    "loading-indicator-header"
  );
  const errorMessage = document.getElementById("error-message");
  const chartWrapper = document.querySelector(".chart-wrapper");
  const accountsListContainer = document.querySelector(
    ".accounts-list-container"
  );
  const dashboardContent = document.querySelector(".dashboard-content");
  const expenseChartCanvas = document.getElementById("expense-chart");

  if (
    !costCenterSelect ||
    !centerText ||
    !availableValue ||
    !accountsList ||
    !loadingIndicatorContent ||
    !loadingIndicatorHeader ||
    !errorMessage ||
    !chartWrapper ||
    !accountsListContainer ||
    !dashboardContent ||
    !expenseChartCanvas
  ) {
    console.error("Um ou mais elementos do DOM não foram encontrados.");
    return;
  }

  // Dados de despesas
  const expenses = {
    campanha: {
      total: 20000,
      accounts: [
        { name: "FUNDO PARTIDÁRIO", limit: 10000, spent: 1000 },
        { name: "FUNDO ESPECIAL", limit: 5000, spent: 5000 },
        { name: "ARRECADAÇÃO PRÓPRIA", limit: 5000, spent: 2200 },
      ],
    },
    gabinete: {
      total: 20000,
      accounts: [
        { name: "FUNDO PARTIDÁRIO", limit: 8000, spent: 4000 },
        { name: "FUNDO ESPECIAL", limit: 8000, spent: 6000 },
        { name: "ARRECADAÇÃO PRÓPRIA", limit: 4000, spent: 5000 },
      ],
    },
    marketing: {
      total: 10000,
      accounts: [
        { name: "FUNDO PARTIDÁRIO", limit: 4000, spent: 3000 },
        { name: "FUNDO ESPECIAL", limit: 4000, spent: 4000 },
        { name: "ARRECADAÇÃO PRÓPRIA", limit: 2000, spent: 3000 },
      ],
    },
  };

  let expenseChart; // Guarda a instância do gráfico

  // Função para criar o gráfico utilizando a função do ChartBase
  const createChart = () => {
    console.log("Tentando criar o gráfico...");
    const ctx = expenseChartCanvas.getContext("2d");
    if (!ctx) {
      console.error("Elemento canvas não encontrado.");
      return;
    }

    expenseChart = createDoughnutChart(ctx, {
      labels: [], // Os labels serão definidos na atualização
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: "hsl(210, 14%, 15%)", // Exemplo de borderColor fixo
          borderWidth: 1,
        },
      ],
      plugins: {
        legend: { display: false },
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: 0 },
      },
    });

    console.log("Gráfico criado com sucesso.");
  };

  // Função para atualizar o gráfico com novos dados
  const updateChart = (data, backgroundColor) => {
    if (!expenseChart) {
      console.error("Tentativa de atualizar um gráfico inexistente.");
      return;
    }
    if (!expenseChart.data) {
      console.error("O gráfico existe, mas não tem dados. Algo deu errado.");
      return;
    }
    console.log("Atualizando gráfico com novos dados.");
    expenseChart.data.datasets[0].data = data;
    expenseChart.data.datasets[0].backgroundColor = backgroundColor;
    expenseChart.update();
    console.log("Gráfico atualizado.");
  };

  // Define a cor conforme a porcentagem
  const getColor = (percentage) => {
    if (percentage > 90) return "#dc3545";
    if (percentage > 70) return "#ffc107";
    return "#28a745";
  };

  // Funções de exibição/ocultação dos indicadores de carregamento e erro
  const showLoading = () => {
    console.log("Exibindo indicador de carregamento.");
    loadingIndicatorContent.classList.remove("dashboard-hidden");
    loadingIndicatorContent.classList.add("dashboard-visible");

    if (
      dashboardContent.style.height === "0px" ||
      dashboardContent.style.height === "0"
    ) {
      loadingIndicatorHeader.classList.remove("dashboard-hidden");
      loadingIndicatorHeader.classList.add("dashboard-visible");
      availableValue.classList.add("dashboard-hidden");
    }
    setOpacity(0);
  };

  const hideLoading = () => {
    console.log("Ocultando indicador de carregamento.");
    loadingIndicatorContent.classList.remove("dashboard-visible");
    loadingIndicatorContent.classList.add("dashboard-hidden");

    loadingIndicatorHeader.classList.remove("dashboard-visible");
    loadingIndicatorHeader.classList.add("dashboard-hidden");

    if (
      dashboardContent.style.height === "0px" ||
      dashboardContent.style.height === "0"
    ) {
      availableValue.classList.remove("dashboard-hidden");
    }
    setOpacity(1);
  };

  const showError = (message) => {
    console.error(`Erro: ${message}`);
    errorMessage.textContent = message;
    errorMessage.classList.add("dashboard-visible");
    setOpacity(0);
    setTimeout(() => {
      errorMessage.classList.remove("dashboard-visible");
      setOpacity(1);
    }, 3000);
  };

  const setOpacity = (value) => {
    chartWrapper.style.opacity = value;
    accountsListContainer.style.opacity = value;
  };

  // Atualiza os dados do dashboard com base no centro de custo selecionado
  const updateDashboard = (centerId) => {
    console.log(`Atualizando dashboard para o centro de custo: ${centerId}`);
    showLoading();
    setTimeout(() => {
      const centerData = expenses[centerId];
      if (!centerData) {
        showError("Centro de custo não encontrado.");
        hideLoading();
        return;
      }
      const { total, accounts } = centerData;
      const totalSpent = accounts.reduce((sum, { spent }) => sum + spent, 0);
      const remaining = total - totalSpent;

      centerText.textContent = `R$ ${remaining.toFixed(2)}`;
      availableValue.textContent = `R$ ${remaining.toFixed(2)}`;

      const data = [totalSpent, remaining];
      const spentPercentage = (totalSpent / total) * 100;
      const backgroundColor = data.map((_, index) =>
        index === 0 ? getColor(spentPercentage) : "#101319"
      );

      updateChart(data, backgroundColor);
      availableValue.style.color = getColor(spentPercentage);

      // Atualiza a lista de contas
      accountsList.innerHTML = "";
      accounts.forEach(({ name, limit, spent }) => {
        const percentage = (spent / limit) * 100;
        const accountItem = document.createElement("div");
        accountItem.className = "account-item";
        accountItem.innerHTML = `
          <div class="account-label-column">
            <span>${name}</span>
          </div>
          <div class="account-progress-bar-column">
            <div class="account-label">${spent.toFixed(2)} de ${limit.toFixed(
          2
        )}</div>
            <div class="account-progress-bar-wrapper">
              <div class="account-progress-bar" data-progress="${percentage}" style="background-color: ${getColor(
          percentage
        )}"></div>
            </div>
          </div>`;
        accountsList.appendChild(accountItem);
      });

      document.querySelectorAll(".account-progress-bar").forEach((bar) => {
        const progress = bar.dataset.progress;
        bar.style.setProperty("--account-progress-bar-width", `${progress}%`);
        bar.style.width = `${progress}%`;
      });

      hideLoading();
    }, 500);
  };

  // Redimensiona o gráfico (útil no evento resize)
  const resizeChart = () => {
    if (expenseChart) {
      console.log("Redimensionando gráfico.");
      expenseChart.resize();
    } else {
      console.error("Tentativa de redimensionar um gráfico inexistente.");
    }
  };

  // Inicializa (ou reinicializa) o dashboard
  const initializeDashboard = () => {
    if (expenseChart) {
      console.log("Destruindo gráfico existente antes de recriar.");
      expenseChart.destroy();
    }
    createChart();
    updateDashboard(costCenterSelect.value);
  };

  // Salva e restaura o estado (centro de custo selecionado)
  const saveState = () => {
    console.log("Salvando estado atual.");
    sessionStorage.setItem("selectedCostCenter", costCenterSelect.value);
  };

  const restoreState = () => {
    const savedCostCenter = sessionStorage.getItem("selectedCostCenter");
    if (savedCostCenter) {
      console.log(
        `Restaurando estado para o centro de custo: ${savedCostCenter}`
      );
      costCenterSelect.value = savedCostCenter;
    }
    initializeDashboard();
  };

  window.addEventListener("resize", initializeDashboard);
  window.addEventListener("pageshow", restoreState);
  window.addEventListener("beforeunload", saveState);

  // Inicializa o dashboard e adiciona o listener para mudança de centro de custo
  initializeDashboard();
  costCenterSelect.addEventListener("change", (e) =>
    updateDashboard(e.target.value)
  );

  // Expõe a função caso seja necessário chamar externamente
  window.initializeDashboard = initializeDashboard;
});
