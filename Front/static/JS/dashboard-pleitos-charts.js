// dashboard-pleitos-charts.js

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o ChartBase está disponível
  if (!window.ChartBase) {
    console.error(
      "charts-base.js não foi carregado antes de dashboard-pleitos-charts.js!"
    );
    return;
  }

  // Extraímos as funções fábricas necessárias
  const { createBarChart, createDoughnutChart } = window.ChartBase;

  // ========================================================
  // Função para obter variáveis CSS definidas no :root
  // ========================================================
  function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  // ========================================================
  // 1) Tipo de Pleito (Bar Chart)
  // ========================================================
  const ctxTipoPleito = document
    .getElementById("chartTipoPleito")
    ?.getContext("2d");
  if (ctxTipoPleito) {
    // Categorias: Emprego, Educação e Capacitação, Infraestrutura, Jurídico, Mobilidade, Outros, Político, Recursos Financeiros, Saúde, Segurança
    const labels = [
      "Emprego",
      "Educação e Capacitação",
      "Infraestrutura",
      "Jurídico",
      "Mobilidade",
      "Outros",
      "Político",
      "Recursos Financeiros",
      "Saúde",
      "Segurança",
    ];
    const dataValues = [50, 30, 20, 15, 25, 10, 5, 40, 35, 20]; // Exemplo de valores

    // Definindo as cores resolvidas a partir das variáveis CSS
    const backgroundColors = [
      getCSSVariable("--cor-primaria-1"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-2"),
      getCSSVariable("--cor-apoio-1"),
      getCSSVariable("--cor-secundaria-3"),
      getCSSVariable("--cor-apoio-2"),
      getCSSVariable("--cor-primaria-2"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-2"),
      getCSSVariable("--cor-apoio-1"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores do Gráfico Tipo de Pleito:", backgroundColors);

    // Função para definir a cor de cada barra
    function tipoPleitoColorFn(context, COLORS) {
      return backgroundColors[context.dataIndex] || COLORS.corPrimaria1;
    }

    createBarChart(ctxTipoPleito, labels, dataValues, tipoPleitoColorFn);
  }

  // ========================================================
  // 2) Status do Pleito (Doughnut Chart)
  // ========================================================
  const ctxStatusPleito = document
    .getElementById("chartStatusPleito")
    ?.getContext("2d");
  if (ctxStatusPleito) {
    // Categorias: Atendidos, Parcialmente, Negado, Cancelado
    const labels = ["Atendidos", "Parcialmente", "Negado", "Cancelado"];
    const dataValues = [8, 3, 2, 1]; // Exemplo de valores

    // Definindo as cores resolvidas a partir das variáveis CSS
    const backgroundColors = [
      getCSSVariable("--cor-primaria-1"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-2"),
      getCSSVariable("--cor-secundaria-3"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores do Gráfico Status do Pleito:", backgroundColors);

    createDoughnutChart(ctxStatusPleito, labels, dataValues, backgroundColors);
  }

  // =========================================
  // Drag-and-Scroll se desejar (opcional)
  // =========================================
  function enableDragScroll(container) {
    let isDown = false;
    let startX, scrollLeft;
    container.addEventListener("mousedown", (e) => {
      isDown = true;
      container.classList.add("active");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    container.addEventListener("mouseleave", () => {
      isDown = false;
      container.classList.remove("active");
    });
    container.addEventListener("mouseup", () => {
      isDown = false;
      container.classList.remove("active");
    });
    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
    // Touch...
    container.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    container.addEventListener("touchend", () => {
      isDown = false;
      container.classList.remove("active");
    });
    container.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  }

  // Se quiser arrastar apenas em telas >= 768px
  const pleitosContainer = document.querySelector(
    ".dashboard-pleitos .chart-dashboard-container"
  );
  if (pleitosContainer && window.innerWidth >= 768) {
    requestAnimationFrame(() => {
      if (pleitosContainer.scrollWidth > pleitosContainer.clientWidth) {
        enableDragScroll(pleitosContainer);
        pleitosContainer.style.cursor = "grab";
      } else {
        pleitosContainer.style.cursor = "default";
      }
    });
  }
});
