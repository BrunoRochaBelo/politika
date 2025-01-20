// dashboard-home-charts.js

document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o ChartBase está disponível
  if (!window.ChartBase) {
    console.error(
      "charts-base.js não foi carregado antes de dashboard-home-charts.js!"
    );
    return;
  }

  // Extraímos as funções fábricas
  const {
    createDoughnutChart,
    createBarChart,
    createLineChart,
    createPieChart,
    createPolarAreaChart,
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
  // 1) GRÁFICO DE EVENTOS (Doughnut)
  // ========================================================
  const ctxEventos = document.getElementById("chartEventos")?.getContext("2d");
  if (ctxEventos) {
    // Definindo as cores resolvidas a partir das variáveis CSS
    const backgroundColors = [
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-primaria-2"),
      getCSSVariable("--cor-secundaria-2"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores do Gráfico de Eventos:", backgroundColors);

    createDoughnutChart(
      ctxEventos,
      ["Pendentes", "Realizados", "Em Andamento"],
      [12, 8, 5],
      backgroundColors
    );
  }

  // ========================================================
  // 2) GRÁFICO DE TAREFAS (Bar)
  // ========================================================
  const ctxTarefas = document.getElementById("chartTarefas")?.getContext("2d");
  if (ctxTarefas) {
    // Definindo as cores resolvidas a partir das variáveis CSS
    const backgroundColors = [
      getCSSVariable("--cor-primaria-1"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-3"),
      getCSSVariable("--cor-apoio-1"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores do Gráfico de Tarefas:", backgroundColors);

    // Função para definir a cor de cada barra
    function tarefasColorFn(context, COLORS) {
      return backgroundColors[context.dataIndex] || COLORS.corPrimaria1;
    }

    createBarChart(
      ctxTarefas,
      ["Novas", "Andamento", "Atrasadas", "Concluídas"],
      [10, 15, 5, 20],
      tarefasColorFn
    );
  }

  // ========================================================
  // 3) GRÁFICO DE PLEITOS (Doughnut)
  // ========================================================
  const ctxPleitos = document.getElementById("chartPleitos")?.getContext("2d");
  if (ctxPleitos) {
    // Definindo as cores resolvidas a partir das variáveis CSS
    const backgroundColors = [
      getCSSVariable("--cor-primaria-1"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-2"),
      getCSSVariable("--cor-secundaria-3"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores do Gráfico de Pleitos:", backgroundColors);

    createDoughnutChart(
      ctxPleitos,
      ["Atendidos", "Parcialmente", "Negado", "Cancelado"],
      [8, 3, 2, 1],
      backgroundColors
    );
  }

  // ========================================================
  // 4) GRÁFICO DE CONTATOS (Line)
  // ========================================================
  const ctxContatos = document
    .getElementById("chartContatos")
    ?.getContext("2d");
  if (ctxContatos) {
    createLineChart(
      ctxContatos,
      [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      [100, 120, 150, 130, 180, 200, 170, 160, 190, 210, 230, 250]
    );
  }

  // =========================================
  // Drag-and-Scroll se desejar
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
  const contatosContainer = document.querySelector(".line-chart-container");
  if (contatosContainer && window.innerWidth >= 768) {
    requestAnimationFrame(() => {
      if (contatosContainer.scrollWidth > contatosContainer.clientWidth) {
        enableDragScroll(contatosContainer);
        contatosContainer.style.cursor = "grab";
      } else {
        contatosContainer.style.cursor = "default";
      }
    });
  }
});
