// dashboard-contatos-charts.js

document.addEventListener("DOMContentLoaded", function () {
  // Garante que charts-base.js foi carregado
  if (!window.ChartBase) {
    console.error(
      "charts-base.js não foi carregado antes de dashboard-contatos-charts.js!"
    );
    return;
  }

  // Extraindo as funções fábricas do ChartBase
  const {
    createBarChart,
    createLineChart,
    createPieChart,
    createDoughnutChart,
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
  // 1) Tipos de Contatos (Bar Chart)
  // ========================================================
  const ctxTipos = document
    .getElementById("chartTiposContatos")
    ?.getContext("2d");
  if (ctxTipos) {
    // Definindo as cores resolvidas a partir das variáveis CSS
    const backgroundColors = [
      getCSSVariable("--cor-primaria-1"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-3"),
      getCSSVariable("--cor-apoio-2"),
      getCSSVariable("--cor-secundaria-1"),
      getCSSVariable("--cor-secundaria-3"),
      getCSSVariable("--cor-apoio-1"),
    ];

    // Verificar as cores resolvidas
    console.log("Cores do Gráfico de Tipos de Contatos:", backgroundColors);

    // Função para definir a cor de cada barra
    function tiposColorFn(context, COLORS) {
      return backgroundColors[context.dataIndex] || COLORS.corPrimaria1;
    }

    // Categorias: Todos, Eleitor, Funcionário, Fornecedor, Comissionado, Liderança, Político
    const labels = [
      "Eleitor",
      "Funcionário",
      "Fornecedor",
      "Comissionado",
      "Liderança",
      "Político",
    ];
    const dataValues = [150, 70, 30, 25, 60, 15];

    createBarChart(ctxTipos, labels, dataValues, tiposColorFn);
  }

  // ========================================================
  // 2) Perfil de Influência (PolarArea)
  // ========================================================
  const ctxPerfil = document
    .getElementById("chartPerfilInfluencia")
    ?.getContext("2d");
  if (ctxPerfil) {
    // Categorias: 1 Estrela até 5 Estrelas
    const labels = [
      "1 Estrela",
      "2 Estrelas",
      "3 Estrelas",
      "4 Estrelas",
      "5 Estrelas",
    ];
    const dataValues = [30, 50, 90, 60, 10]; // Exemplo de valores

    // Função para gerar cores em degradê começando com hsl(218, 90%, 68%)
    function generateHSLColors(baseHue, baseSaturation, baseLightness, count) {
      const colors = [];
      const lightnessStep = 10; // Ajuste conforme necessário
      for (let i = 0; i < count; i++) {
        const lightness = baseLightness - i * lightnessStep;
        colors.push(`hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`);
      }
      return colors;
    }

    const backgroundColors = generateHSLColors(218, 90, 68, labels.length);

    // Verificar as cores geradas
    console.log("Cores do Gráfico de Perfil de Influência:", backgroundColors);

    // Reutiliza createPolarAreaChart da base com cores em degradê
    createPolarAreaChart(ctxPerfil, labels, dataValues, backgroundColors);
  }

  // ========================================================
  // 3) Residências de Apoio (Line Chart)
  // ========================================================
  const ctxResidencias = document
    .getElementById("chartResidencias")
    ?.getContext("2d");
  if (ctxResidencias) {
    // Supondo que queremos visualizar a evolução ao longo de 6 meses
    const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    const dataValues = [12, 18, 22, 17, 25, 30]; // Exemplo

    // Reutiliza createLineChart da base
    createLineChart(ctxResidencias, labels, dataValues);
  }

  // ========================================================
  // 4) Localidade (Bairro) (Pie Chart)
  // ========================================================
  const ctxLocalidade = document
    .getElementById("chartLocalidade")
    ?.getContext("2d");
  if (ctxLocalidade) {
    const labels = ["Bairro A", "Bairro B", "Bairro C", "Bairro D"];
    const dataValues = [40, 30, 20, 10]; // Exemplo de %

    // Função para gerar cores em degradê começando com hsl(218, 90%, 68%)
    function generateHSLColorsPie(
      baseHue,
      baseSaturation,
      baseLightness,
      count
    ) {
      const colors = [];
      const lightnessStep = 10; // Ajuste conforme necessário
      for (let i = 0; i < count; i++) {
        const lightness = baseLightness - i * lightnessStep;
        colors.push(`hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`);
      }
      return colors;
    }

    const backgroundColors = generateHSLColorsPie(218, 90, 68, labels.length);

    // Verificar as cores geradas
    console.log("Cores do Gráfico de Localidade:", backgroundColors);

    // Reutiliza createPieChart da base com cores em degradê
    createPieChart(ctxLocalidade, labels, dataValues, backgroundColors);
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
  const residenciasContainer = document.querySelector(".line-chart-container");
  if (residenciasContainer && window.innerWidth >= 768) {
    requestAnimationFrame(() => {
      if (residenciasContainer.scrollWidth > residenciasContainer.clientWidth) {
        enableDragScroll(residenciasContainer);
        residenciasContainer.style.cursor = "grab";
      } else {
        residenciasContainer.style.cursor = "default";
      }
    });
  }
});
