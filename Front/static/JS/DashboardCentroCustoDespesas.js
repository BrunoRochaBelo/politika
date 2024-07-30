document.addEventListener("DOMContentLoaded", () => {
  const costCenterSelect = document.getElementById("cost-center-select");
  const centerText = document.getElementById("center-text");
  const availableValue = document.getElementById("available-value");
  const accountsList = document.getElementById("accounts-list");

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

  const ctx = document.getElementById("expense-chart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: "hsl(215, 14%, 15%)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      cutout: "70%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  const getColor = (percentage) => {
    if (percentage > 90) return "#dc3545";
    if (percentage > 70) return "#ffc107";
    return "#28a745";
  };

  const updateDashboard = (centerId) => {
    const { total, accounts } = expenses[centerId];
    const totalSpent = accounts.reduce((sum, { spent }) => sum + spent, 0);
    const remaining = total - totalSpent;

    centerText.textContent = `R$ ${remaining.toFixed(2)}`;
    availableValue.textContent = `R$ ${remaining.toFixed(2)}`;

    const data = [totalSpent, remaining];
    const spentPercentage = (totalSpent / total) * 100;
    const backgroundColor = data.map((_, index) =>
      index === 0 ? getColor(spentPercentage) : "#101319"
    );

    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = backgroundColor;
    chart.update();

    availableValue.style.color = getColor(spentPercentage);

    accountsList.innerHTML = "";
    accounts.forEach(({ name, limit, spent }) => {
      const percentage = (spent / limit) * 100;
      const accountItem = document.createElement("div");
      accountItem.className = "account-item";
      accountItem.innerHTML = `<div class="account-label-column">
          <span>${name}</span>
        </div>
        <div class="progress-bar-column">
          <div class="account-label">${spent.toFixed(2)} de ${limit.toFixed(
        2
      )}</div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar" data-progress="${percentage}" style="background-color: ${getColor(
        percentage
      )}"></div>
          </div>
        </div>`;
      accountsList.appendChild(accountItem);
    });

    // Adiciona a animação às barras de progresso
    document.querySelectorAll(".progress-bar").forEach((bar) => {
      const progress = bar.dataset.progress;
      bar.style.setProperty("--progress-bar-width", `${progress}%`);
      bar.style.width = `${progress}%`;
    });
  };

  costCenterSelect.addEventListener("change", (e) =>
    updateDashboard(e.target.value)
  );
  updateDashboard(costCenterSelect.value);
});
