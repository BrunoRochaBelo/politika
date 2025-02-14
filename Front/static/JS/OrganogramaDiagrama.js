(function () {
  "use strict";

  // ==================================================
  // Variáveis e Configurações (escopo privado)
  // ==================================================
  const nodeDataMap = {}; // Armazena dados de cada nó (chave = HTMLid)
  let finalStructure = []; // Configuração final usada pelo Treant
  let myTreantInstance = null; // Instância do Treant
  let panzoomInstance = null; // Instância do Panzoom

  // Definições de limiares
  const doubleClickThreshold = 300; // ms para considerar duplo clique
  const dragThreshold = 10; // px para descartar clique se arrastar mais

  // ==================================================
  // 1) Funções de Utilidade
  // ==================================================
  function getEventCoordinates(e) {
    // Retorna {x, y} para eventos de mouse ou toque.
    if (e.changedTouches && e.changedTouches.length) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function parseOrgItems(ul) {
    // Percorre o <ul> e gera um array de objetos compatível com a configuração do Treant.
    const children = [];
    $(ul)
      .children("li.org-item")
      .each(function () {
        const $li = $(this);
        const $card = $li.find(".organograma-medium-card").first();

        // Extração dos dados do card
        const id = $card.find("[data-field='id']").eq(0).text().trim();
        const nomeUnidade = $card
          .find("[data-field='nome_unidade']")
          .text()
          .trim();
        const nomeTitular = $card
          .find("[data-field='nome_titular']")
          .text()
          .trim();
        const designacao = $card
          .find("[data-field='designacao']")
          .text()
          .trim();
        const nivelSalarial = $card
          .find("[data-field='nivel_salarial']")
          .text()
          .trim();
        let infoPublicacao = "";
        const $infoPubDiv = $card.find("[data-field='info-pub']");
        if ($infoPubDiv.length) {
          infoPublicacao = $infoPubDiv.html();
        }

        // Monta objeto para o Treant
        const nodeData = {
          HTMLid: `org-node-${id}`,
          text: {
            name: nomeUnidade,
            title: designacao,
            contact: nomeTitular,
          },
          detailData: {
            id,
            nome_unidade: nomeUnidade,
            nome_titular: nomeTitular,
            designacao,
            nivel_salarial: nivelSalarial,
            info_pub: infoPublicacao,
          },
          collapsed: false,
        };

        // Verifica se há nó(s) filho(s) e faz parse recursivo
        const $childUl = $li.children("ul.org-sublist");
        if ($childUl.length) {
          const nodeChildren = parseOrgItems($childUl);
          nodeData.children = nodeChildren;
          nodeData.collapsable = nodeChildren.length > 0;
        } else {
          nodeData.collapsable = false;
        }

        // Armazena os dados para acesso rápido
        nodeDataMap[nodeData.HTMLid] = nodeData;
        children.push(nodeData);
      });
    return children;
  }

  // ==================================================
  // 2) Função de Transição Suave para Movimentações
  // ==================================================
  function smoothMoveTo(newX, newY, duration = 500) {
    const wrapperEl = document.getElementById("orgchart-wrapper");
    if (!wrapperEl || !panzoomInstance) return;
    // Adiciona classe para transição suave
    wrapperEl.classList.add("animate");
    panzoomInstance.moveTo(newX, newY);
    setTimeout(() => {
      wrapperEl.classList.remove("animate");
    }, duration);
  }

  // ==================================================
  // 3) Função de Centralização do Nó Raiz
  // ==================================================
  function centerRootNodeHorizontallyButKeepZoomAtTop() {
    if (!panzoomInstance) return;
    const TOP_MARGIN = 20; // px
    const rootEl = document.getElementById("org-node-1");
    if (!rootEl) return;
    const containerEl = document.getElementById("orgchart-container");
    const containerWidth = containerEl.clientWidth;

    const nodeCenterXInWrapper = rootEl.offsetLeft + rootEl.offsetWidth / 2;
    const nodeTopInWrapper = rootEl.offsetTop;
    const { scale } = panzoomInstance.getTransform();

    const newX = containerWidth / 2 - scale * nodeCenterXInWrapper;
    const newY = TOP_MARGIN - scale * nodeTopInWrapper;
    smoothMoveTo(newX, newY);
  }

  // ==================================================
  // 4) Função para Garantir que um Nó Esteja Visível no Container
  // ==================================================
  function ensureNodeVisibility(nodeId) {
    if (!panzoomInstance) return;
    const nodeEl = document.getElementById(nodeId);
    if (!nodeEl) return;
    const containerEl = document.getElementById("orgchart-container");
    if (!containerEl) return;

    const nodeRect = nodeEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    let deltaX = 0,
      deltaY = 0;

    // Verifica se o nó está fora da área visível horizontalmente
    if (nodeRect.left < containerRect.left) {
      deltaX = containerRect.left - nodeRect.left;
    } else if (nodeRect.right > containerRect.right) {
      deltaX = containerRect.right - nodeRect.right;
    }

    // Verifica se o nó está fora da área visível verticalmente
    if (nodeRect.top < containerRect.top) {
      deltaY = containerRect.top - nodeRect.top;
    } else if (nodeRect.bottom > containerRect.bottom) {
      deltaY = containerRect.bottom - nodeRect.bottom;
    }

    if (deltaX !== 0 || deltaY !== 0) {
      const transform = panzoomInstance.getTransform();
      const newX = transform.x + deltaX;
      const newY = transform.y + deltaY;
      smoothMoveTo(newX, newY);
    }
  }

  // ==================================================
  // 5) Inicialização do Treant e Renderização do Diagrama
  // ==================================================
  function initTreantOrganograma() {
    // Procura pela lista principal de nós
    const topUL = document.querySelector(".secao-interna-template .org-list");
    if (!topUL) {
      console.warn("Não foi encontrada a lista .org-list");
      return;
    }
    const parsedStructure = parseOrgItems(topUL);
    if (!parsedStructure.length) {
      console.warn("Nenhum nó encontrado no organograma.");
      return;
    }
    const chartConfig = {
      container: "#orgchart-wrapper",
      rootOrientation: "NORTH",
      nodeAlign: "CENTER",
      node: { collapsable: true },
      animation: {
        nodeAnimation: "easeOutQuart",
        nodeSpeed: 600,
        connectorsAnimation: "linear",
        connectorsSpeed: 500,
      },
      connectors: { type: "step" },
    };
    finalStructure = [chartConfig, ...parsedStructure];
    myTreantInstance = new Treant(finalStructure);

    requestAnimationFrame(() => {
      attachNodeListeners();
      initPanZoom();
      // Aguarda um breve instante para garantir a renderização
      setTimeout(centerRootNodeHorizontallyButKeepZoomAtTop, 60);
    });
  }

  // ==================================================
  // 6) Rebuild do Diagrama (para expandir/colapsar)
  // ==================================================
  function rebuildTree() {
    const wrapper = document.getElementById("orgchart-wrapper");
    if (wrapper) {
      wrapper.innerHTML = "";
    }
    // Preserva a última transformação de pan/zoom
    let currentTransform = { x: 0, y: 0, scale: 1 };
    if (panzoomInstance && typeof panzoomInstance.getTransform === "function") {
      currentTransform = panzoomInstance.getTransform();
    }
    myTreantInstance = new Treant(finalStructure);
    requestAnimationFrame(() => {
      attachNodeListeners();
      if (panzoomInstance) panzoomInstance.destroy();
      initPanZoom();
      // Utiliza moveTo sem transição imediata para preservar o estado
      panzoomInstance.moveTo(currentTransform.x, currentTransform.y);
    });
  }

  // ==================================================
  // 7) Eventos dos Nós (Clique Simples / Duplo)
  // ==================================================
  function attachNodeListeners() {
    const nodes = document.querySelectorAll("#orgchart-wrapper .node");
    nodes.forEach((nodeEl) => {
      // Remove possíveis listeners anteriores
      nodeEl.removeEventListener("pointerdown", onPointerDown);
      nodeEl.removeEventListener("touchstart", onPointerDown);
      nodeEl.removeEventListener("click", onNodeClick);
      nodeEl.removeEventListener("touchend", onNodeClick);
      nodeEl.removeEventListener("dblclick", onNodeDblClick);

      nodeEl.addEventListener("pointerdown", onPointerDown);
      nodeEl.addEventListener("touchstart", onPointerDown);
      nodeEl.addEventListener("click", onNodeClick);
      nodeEl.addEventListener("touchend", onNodeClick);
      nodeEl.addEventListener("dblclick", onNodeDblClick);
    });
  }

  function onPointerDown(e) {
    const coords = getEventCoordinates(e);
    this._startX = coords.x;
    this._startY = coords.y;
  }

  function onNodeClick(e) {
    e.stopPropagation();
    const el = this;
    if (typeof el._startX === "undefined") return;
    const coords = getEventCoordinates(e);
    const dx = Math.abs(coords.x - el._startX);
    const dy = Math.abs(coords.y - el._startY);
    if (dx > dragThreshold || dy > dragThreshold) return;

    if (el.clickTimer) {
      clearTimeout(el.clickTimer);
      el.clickTimer = null;
      const nodeId = el.getAttribute("id");
      if (!nodeId) return;
      const nodeData = nodeDataMap[nodeId];
      if (!nodeData) return;
      showDetailModal(nodeData.detailData);
    } else {
      el.clickTimer = setTimeout(() => {
        el.clickTimer = null;
        const nodeId = el.getAttribute("id");
        if (!nodeId) return;
        const nodeData = nodeDataMap[nodeId];
        if (!nodeData) return;
        if (nodeData.collapsable) {
          nodeData.collapsed = !nodeData.collapsed;
          rebuildTree();
          // Após reconstruir o diagrama, reposiciona a visualização:
          setTimeout(() => {
            if (nodeId === "org-node-1") {
              // Nó raiz: centraliza automaticamente
              centerRootNodeHorizontallyButKeepZoomAtTop();
            } else {
              // Qualquer outro nó: garante que o nó clicado esteja visível
              ensureNodeVisibility(nodeId);
            }
          }, 100);
        }
      }, doubleClickThreshold);
    }
  }

  function onNodeDblClick(e) {
    e.stopPropagation();
    const el = this;
    if (el.clickTimer) {
      clearTimeout(el.clickTimer);
      el.clickTimer = null;
    }
    const nodeId = el.getAttribute("id");
    if (!nodeId) return;
    const nodeData = nodeDataMap[nodeId];
    if (!nodeData) return;
    showDetailModal(nodeData.detailData);
  }

  // ==================================================
  // 8) Modal de Detalhes
  // ==================================================
  function showDetailModal(detailData) {
    const modal = document.getElementById("detailModal");
    if (!modal) return;
    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");
    modalTitle.textContent = detailData.nome_unidade || "Detalhes";
    modalBody.innerHTML = `
      <p><strong>ID:</strong> ${detailData.id}</p>
      <p><strong>Nome da Unidade:</strong> ${detailData.nome_unidade}</p>
      <p><strong>Nome do Titular:</strong> ${detailData.nome_titular}</p>
      <p><strong>Designação:</strong> ${detailData.designacao}</p>
      <p><strong>Nível Salarial:</strong> ${detailData.nivel_salarial}</p>
      <hr>
      ${detailData.info_pub ? detailData.info_pub : ""}
    `;
    modal.style.display = "flex";
  }

  function closeDetailModal() {
    const modal = document.getElementById("detailModal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  // ==================================================
  // 9) Inicialização do Panzoom com Zona de Amortecimento
  // ==================================================
  function initPanZoom() {
    const wrapperEl = document.getElementById("orgchart-wrapper");
    if (!wrapperEl) return;
    // Cria instância do Panzoom sem a opção "contain" para controle manual
    panzoomInstance = panzoom(wrapperEl, {
      maxZoom: 2,
      minZoom: 0.5,
      smoothScroll: true,
      exclude: ".node",
    });

    // Evento de zoom centrado no ponteiro com transição suave
    wrapperEl.addEventListener("wheel", function (e) {
      e.preventDefault();
      const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const rect = wrapperEl.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      panzoomInstance.zoomTo(offsetX, offsetY, scaleFactor, {
        animate: true,
        duration: 300,
      });
    });

    // A cada transformação, força os limites com zona de amortecimento.
    panzoomInstance.on("transform", enforcePanBounds);
  }

  // ==================================================
  // 10) Função para Forçar os Limites com Amortecimento (Damping)
  // ==================================================
  function enforcePanBounds() {
    const containerEl = document.getElementById("orgchart-container");
    const wrapperEl = document.getElementById("orgchart-wrapper");
    if (!containerEl || !wrapperEl || !panzoomInstance) return;

    const transform = panzoomInstance.getTransform();
    const scale = transform.scale;
    const currentX = transform.x;
    const currentY = transform.y;

    const containerWidth = containerEl.clientWidth;
    const containerHeight = containerEl.clientHeight;
    const diagramWidth = wrapperEl.offsetWidth * scale;
    const diagramHeight = wrapperEl.offsetHeight * scale;

    // Definir zona de amortecimento (damping factor)
    const damping = 0.3;
    let allowedMinX, allowedMaxX, allowedMinY, allowedMaxY;

    if (diagramWidth >= containerWidth) {
      allowedMinX = containerWidth - diagramWidth;
      allowedMaxX = 0;
    } else {
      allowedMinX = 0;
      allowedMaxX = containerWidth - diagramWidth;
    }
    if (diagramHeight >= containerHeight) {
      allowedMinY = containerHeight - diagramHeight;
      allowedMaxY = 0;
    } else {
      allowedMinY = 0;
      allowedMaxY = containerHeight - diagramHeight;
    }

    let newX = currentX;
    let newY = currentY;

    if (currentX < allowedMinX) {
      newX = allowedMinX + (currentX - allowedMinX) * damping;
    } else if (currentX > allowedMaxX) {
      newX = allowedMaxX + (currentX - allowedMaxX) * damping;
    }
    if (currentY < allowedMinY) {
      newY = allowedMinY + (currentY - allowedMinY) * damping;
    } else if (currentY > allowedMaxY) {
      newY = allowedMaxY + (currentY - allowedMaxY) * damping;
    }

    if (newX !== currentX || newY !== currentY) {
      panzoomInstance.moveTo(newX, newY);
    }
  }

  // ==================================================
  // 11) Inicialização Geral e Listeners de Redimensionamento
  // ==================================================
  function init() {
    // Remove eventos inline do modal e adiciona listeners para fechar
    const modal = document.getElementById("detailModal");
    if (modal) {
      // Seleciona o botão de fechar (span com classe "close") e o botão de cancelar
      const closeBtns = modal.querySelectorAll(".close, .btn-cancel");
      closeBtns.forEach((btn) => {
        btn.addEventListener("click", closeDetailModal);
      });
    }

    // Garante que o modal esteja fechado ao iniciar
    closeDetailModal();
    // Inicializa o organograma
    initTreantOrganograma();

    // Botão para centralizar
    const btnRecenter = document.getElementById("btnRecenter");
    if (btnRecenter) {
      btnRecenter.addEventListener(
        "click",
        centerRootNodeHorizontallyButKeepZoomAtTop
      );
    }

    // Recentraliza o diagrama ao redimensionar a janela
    window.addEventListener(
      "resize",
      centerRootNodeHorizontallyButKeepZoomAtTop
    );
  }

  // Inicialização quando o DOM estiver pronto
  document.addEventListener("DOMContentLoaded", init);
})();
