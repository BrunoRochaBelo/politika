document.addEventListener("DOMContentLoaded", () => {
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
    !dashboardContent
  ) {
    console.error("Um ou mais elementos do DOM não foram encontrados.");
    return;
  }

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

  let chart;

  const createChart = () => {
    const ctx = document.getElementById("expense-chart").getContext("2d");
    if (!ctx) {
      console.error("Elemento canvas não encontrado.");
      return;
    }

    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: "hsl(210, 14%, 15%)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        layout: {
          padding: 0,
        },
      },
    });
  };

  const getColor = (percentage) => {
    if (percentage > 90) return "#dc3545";
    if (percentage > 70) return "#ffc107";
    return "#28a745";
  };

  const showLoading = () => {
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

  const updateDashboard = (centerId) => {
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

      if (chart) {
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = backgroundColor;
        chart.update();
      } else {
        createChart();
      }

      availableValue.style.color = getColor(spentPercentage);

      accountsList.innerHTML = "";
      accounts.forEach(({ name, limit, spent }) => {
        const percentage = (spent / limit) * 100;
        const accountItem = document.createElement("div");
        accountItem.className = "account-item";
        accountItem.innerHTML = `<div class="account-label-column">
                  <span>${name}</span>
              </div>
              <div class="account-progress-bar-column">
                  <div class="account-label">${spent.toFixed(
                    2
                  )} de ${limit.toFixed(2)}</div>
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

  // Evento para redimensionamento da tela
  window.addEventListener("resize", () => {
    if (chart) {
      chart.resize();
    } else {
      createChart();
      updateDashboard(costCenterSelect.value);
    }
  });

  // Evento para mudança de aba
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (!chart) {
        createChart();
      }
      updateDashboard(costCenterSelect.value);
    }
  });

  // Verifica se a página foi carregada parcialmente via AJAX
  document.addEventListener("DOMContentLoaded", () => {
    if (!chart) {
      createChart();
    }
    updateDashboard(costCenterSelect.value);
  });

  costCenterSelect.addEventListener("change", (e) =>
    updateDashboard(e.target.value)
  );

  // Inicializar o gráfico ao carregar a página
  createChart();
  updateDashboard(costCenterSelect.value);
});
