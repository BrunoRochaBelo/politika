// ArquivosNavegacao.js

import { dataService } from "./ArquivosListaDeArquivos.js";

/**
 * Classe para gerenciar a navegação e a interface do explorador de arquivos
 */
class FileNavigator {
  constructor() {
    // Estado centralizado
    this.state = {
      libraries: [],
      currentPath: [], // Array de nós representando o caminho atual
    };

    // Seletores dos elementos do DOM
    this.breadcrumbContainer = document.querySelector(".breadcrumbs");
    this.gridContainer = document.querySelector(".grid-container");
    this.treeContainer = document.querySelector(".lista-vertical-fil");

    // Selecionar o elemento "raiz" do breadcrumbs
    this.raizSpan = this.breadcrumbContainer.querySelector(".raiz");
    this.raizSpan.addEventListener("click", () => this.resetToRoot());

    // Selecionar o elemento "raiz" da árvore de navegação
    const raizTree = document.querySelector(".raiz-tree");
    if (raizTree) {
      raizTree.addEventListener("click", () => this.resetToRoot());
    }

    // Timer de inatividade (em milissegundos, ex.: 10 minutos)
    this.INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutos
    this.inactivityTimer = null;

    // Bind methods
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleResize = this.debounce(this.handleResize.bind(this), 300);
  }

  /**
   * Inicialização do navegador de arquivos
   */
  async init() {
    // Carregar bibliotecas e renderizar a árvore
    try {
      this.state.libraries = await dataService.fetchLibraries();
      await this.renderTree(this.treeContainer, this.state.libraries);
    } catch (error) {
      console.error("Erro ao inicializar o navegador de arquivos:", error);
    }

    // Carregar o estado salvo, se houver
    await this.loadState();

    // Se não houver caminho atual, mostrar a raiz
    if (this.state.currentPath.length === 0) {
      this.displayContent({ type: "root" });
    }

    // Iniciar o timer de inatividade
    this.resetInactivityTimer();

    // Configurar eventos globais
    this.setupGlobalEvents();
  }

  /**
   * Configura eventos globais para inatividade e redimensionamento
   */
  setupGlobalEvents() {
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(
      (event) => {
        document.addEventListener(event, () => this.resetInactivityTimer());
      }
    );

    window.addEventListener("resize", this.handleResize);
  }

  /**
   * Handler para eventos de clique no documento (event delegation)
   */
  handleDocumentClick(event) {
    // Implement event delegation if needed
  }

  /**
   * Função para lidar com redimensionamento da tela
   */
  handleResize() {
    // Implementar lógica para lidar com mudanças de tamanho de tela
    // Evitar requisições desnecessárias
    // Por exemplo, ajustar layout ou re-renderizar componentes específicos
    // Certifique-se de que dados não são buscados novamente a menos que necessário
    console.log("Tela redimensionada");
    // Implement any necessary UI adjustments here
  }

  /**
   * Função para debouncing (limitar a frequência de execução)
   * @param {Function} func - Função a ser limitada.
   * @param {number} wait - Tempo de espera em ms.
   * @returns {Function} - Função debounced.
   */
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Função para resetar para a raiz
   */
  resetToRoot() {
    this.state.currentPath = [];
    this.renderBreadcrumbs();
    // Remover seleção de itens na árvore
    this.treeContainer
      .querySelectorAll(".tree-item.selected")
      .forEach((item) => item.classList.remove("selected"));
    // Mostrar todas as bibliotecas
    this.displayContent({ type: "root" });
    this.saveState(); // Salvar estado após resetar para raiz
    this.resetInactivityTimer(); // Resetar o timer de inatividade
  }

  /**
   * Função para encontrar o caminho até um nó específico
   * @param {Array} nodes - Lista de nós.
   * @param {number} targetId - ID do nó alvo.
   * @param {Array} path - Caminho atual.
   * @returns {Array|null} - Retorna o caminho ou null se não encontrado.
   */
  findPath(nodes, targetId, path = []) {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.id === targetId) {
        return newPath;
      }
      if (node.children && node.children.length > 0) {
        const result = this.findPath(node.children, targetId, newPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  /**
   * Função auxiliar para encontrar um nó pelo ID
   * @param {Array} nodes - Lista de nós.
   * @param {number} id - ID do nó a ser encontrado.
   * @returns {Object|null} - Retorna o nó ou null se não encontrado.
   */
  findNodeById(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = this.findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  /**
   * Função para salvar o estado no LocalStorage
   */
  saveState() {
    const expandedElements = Array.from(
      this.treeContainer.querySelectorAll(".tree-item.expanded")
    ).map((el) => el.dataset.id);
    const stateToSave = {
      currentPath: this.state.currentPath.map((node) => node.id),
      expandedItems: expandedElements,
    };
    localStorage.setItem("fileExplorerState", JSON.stringify(stateToSave));
    console.log("Estado salvo:", stateToSave);
  }

  /**
   * Função para carregar o estado do LocalStorage
   */
  async loadState() {
    const savedState = JSON.parse(localStorage.getItem("fileExplorerState"));
    console.log("Estado carregado:", savedState);
    if (savedState) {
      // Restaurar currentPath
      if (savedState.currentPath && savedState.currentPath.length > 0) {
        const pathNodes = savedState.currentPath
          .map((id) => this.findNodeById(this.state.libraries, id))
          .filter((node) => node);
        if (pathNodes.length > 0) {
          this.state.currentPath = pathNodes;
          this.renderBreadcrumbs();
          const lastNode = pathNodes[pathNodes.length - 1];
          await this.displayContent(lastNode);

          // Selecionar o último item no path
          const selectedId = lastNode.id;
          const selectedItem = this.treeContainer.querySelector(
            `.tree-item[data-id='${selectedId}']`
          );
          if (selectedItem) {
            this.treeContainer
              .querySelectorAll(".tree-item.selected")
              .forEach((item) => item.classList.remove("selected"));
            selectedItem.classList.add("selected");
          }
        }
      }

      // Restaurar itens expandidos
      if (savedState.expandedItems && savedState.expandedItems.length > 0) {
        for (const id of savedState.expandedItems) {
          const treeItem = this.treeContainer.querySelector(
            `.tree-item[data-id='${id}']`
          );
          if (treeItem && !treeItem.classList.contains("expanded")) {
            treeItem.classList.add("expanded");
            const childrenUl = treeItem.querySelector(".tree-children");
            if (childrenUl) {
              childrenUl.style.display = "block";
            }

            const nodeId = parseInt(id, 10);
            const node = this.findNodeById(this.state.libraries, nodeId);
            if (
              node &&
              node.children.length === 0 &&
              node.type !== "document"
            ) {
              // Load children
              let childrenData = [];
              try {
                if (node.type === "library") {
                  childrenData = await dataService.fetchFolders(node.id);
                } else if (node.type === "folder") {
                  childrenData = await dataService.fetchDocuments(node.id);
                }
                node.children = childrenData;
                childrenUl.innerHTML = "";
                await this.renderTree(childrenUl, childrenData);
                this.saveState();
              } catch (error) {
                console.error(
                  `Erro ao carregar filhos do nó ${nodeId}:`,
                  error
                );
              }
            }
          }
        }
      }
    }
  }

  /**
   * Função para limpar o estado no LocalStorage e resetar a interface
   */
  clearState() {
    localStorage.removeItem("fileExplorerState");
    this.state.currentPath = [];
    this.renderBreadcrumbs();
    // Remover todas as expansões
    this.treeContainer
      .querySelectorAll(".tree-item.expanded")
      .forEach((item) => item.classList.remove("expanded"));
    // Remover todas as seleções
    this.treeContainer
      .querySelectorAll(".tree-item.selected")
      .forEach((item) => item.classList.remove("selected"));
    // Limpar e mostrar todas as bibliotecas
    this.gridContainer.innerHTML = "";
    this.renderGrid(this.state.libraries, "library");

    // Remover a classe 'no-padding' caso esteja presente
    this.gridContainer.classList.remove("no-padding");
  }

  /**
   * Função para iniciar/reiniciar o timer de inatividade
   */
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.clearState();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Função para renderizar a navegação em árvore
   * @param {HTMLElement} container - Container onde a árvore será renderizada.
   * @param {Array} nodes - Lista de nós a serem renderizados.
   */
  async renderTree(container, nodes) {
    if (!container) return;

    const fragment = document.createDocumentFragment();
    const ul = document.createElement("ul");
    ul.classList.add("tree-container");

    for (const node of nodes) {
      const li = document.createElement("li");
      li.classList.add("tree-item", node.type);
      li.dataset.id = node.id;
      li.dataset.type = node.type;
      li.tabIndex = 0; // Para acessibilidade via teclado

      // Expand/Collapse toggle
      if (node.type === "library" || node.type === "folder") {
        const toggleIcon = document.createElement("span");
        toggleIcon.classList.add("toggle-icon");
        li.appendChild(toggleIcon);

        // Evento de expansão/contração via evento delegado
        toggleIcon.addEventListener("click", async (e) => {
          e.stopPropagation();
          this.resetInactivityTimer();
          await this.toggleExpandCollapse(li, node);
        });
      } else {
        // Para documentos, adicionar espaçamento para alinhar
        const placeholderSpan = document.createElement("span");
        placeholderSpan.classList.add("toggle-icon-placeholder");
        placeholderSpan.style.width = "16px";
        li.appendChild(placeholderSpan);
      }

      // Nome do nó
      const nodeNameSpan = document.createElement("span");
      nodeNameSpan.textContent = node.name;
      nodeNameSpan.classList.add("node-name");
      li.appendChild(nodeNameSpan);

      // Evento de seleção
      nodeNameSpan.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.resetInactivityTimer();
        await this.handleSelection(li, node);
      });

      // Acessibilidade: teclado
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          nodeNameSpan.click();
        }
      });

      // Preparar container para filhos
      if (node.type !== "document") {
        const childrenUl = document.createElement("ul");
        childrenUl.classList.add("tree-children");
        childrenUl.style.display = "none"; // Inicialmente oculto
        li.appendChild(childrenUl);
      }

      fragment.appendChild(li);
    }

    ul.appendChild(fragment);
    container.appendChild(ul);
  }

  /**
   * Função para alternar a expansão ou contração de um item na árvore
   * @param {HTMLElement} li - Elemento <li> da árvore.
   * @param {Object} node - Nó associado.
   */
  async toggleExpandCollapse(li, node) {
    if (li.classList.contains("expanded")) {
      li.classList.remove("expanded");
      const childrenUl = li.querySelector(".tree-children");
      if (childrenUl) childrenUl.style.display = "none";
    } else {
      li.classList.add("expanded");
      const childrenUl = li.querySelector(".tree-children");
      if (childrenUl) {
        childrenUl.style.display = "block";
      }

      if (node.children.length === 0 && node.type !== "document") {
        try {
          childrenUl.innerHTML = "<li>Carregando...</li>";
          let childrenData = [];
          if (node.type === "library") {
            childrenData = await dataService.fetchFolders(node.id);
          } else if (node.type === "folder") {
            childrenData = await dataService.fetchDocuments(node.id);
          }
          node.children = childrenData;
          childrenUl.innerHTML = "";
          await this.renderTree(childrenUl, childrenData);
          this.saveState();
        } catch (error) {
          console.error(`Erro ao carregar filhos do nó ${node.id}:`, error);
          childrenUl.innerHTML = "<li>Erro ao carregar dados.</li>";
        }
      }
    }
    this.saveState();
  }

  /**
   * Função para tratar a seleção de um nó
   * @param {HTMLElement} li - Elemento <li> da árvore.
   * @param {Object} node - Nó associado.
   */
  async handleSelection(li, node) {
    // Remover seleção de outros itens
    this.treeContainer
      .querySelectorAll(".tree-item.selected")
      .forEach((item) => item.classList.remove("selected"));
    li.classList.add("selected");

    // Atualizar o caminho atual
    const path = this.findPath(this.state.libraries, node.id);
    if (path) {
      this.state.currentPath = path;
      this.renderBreadcrumbs();
      await this.displayContent(node);
      this.saveState();
    }
  }

  /**
   * Função para renderizar a main-section
   * @param {Object} node - Nó atual a ser exibido.
   */
  async displayContent(node) {
    // Limpar conteúdo atual
    this.gridContainer.innerHTML = "";

    // Remove a classe 'no-padding' por padrão
    this.gridContainer.classList.remove("no-padding");

    try {
      if (node.type === "library") {
        // Mostrar pastas
        if (node.children.length === 0) {
          // Carregar pastas se ainda não estiverem carregadas
          node.children = await dataService.fetchFolders(node.id);
        }
        const folders = node.children || [];
        if (folders.length > 0) {
          this.renderGrid(folders, "folder");
        } else {
          const message = document.createElement("div");
          message.textContent = "Nenhuma pasta encontrada nesta biblioteca.";
          this.gridContainer.appendChild(message);
        }
      } else if (node.type === "folder") {
        // Mostrar documentos
        if (node.children.length === 0) {
          // Carregar documentos se ainda não estiverem carregados
          node.children = await dataService.fetchDocuments(node.id);
        }
        const documents = node.children || [];
        if (documents.length > 0) {
          this.renderDocumentTable(documents);
        } else {
          const message = document.createElement("div");
          message.textContent = "Nenhum documento encontrado nesta pasta.";
          this.gridContainer.appendChild(message);
        }
      } else if (node.type === "document") {
        // Mostrar detalhes do documento
        const docDiv = document.createElement("div");
        docDiv.textContent = `Detalhes do Documento: ${node.name}`;
        this.gridContainer.appendChild(docDiv);
      } else if (node.type === "root") {
        // Mostrar todas as bibliotecas
        this.renderGrid(this.state.libraries, "library");
      }

      // Atualizar os contadores
      this.updateCounters(node);

      this.saveState(); // Salvar estado após atualizar o conteúdo
    } catch (error) {
      console.error("Erro ao exibir conteúdo:", error);
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Erro ao carregar conteúdo.";
      this.gridContainer.appendChild(errorMessage);
    }
  }

  /**
   * Função para renderizar o grid na main-section
   * @param {Array} items - Lista de itens a serem renderizados.
   * @param {string} type - Tipo de item (library, folder).
   */
  renderGrid(items, type) {
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("item-grid", type);
      div.dataset.id = item.id;
      div.dataset.type = item.type;

      // Criação do card
      const title = document.createElement("h3");
      title.textContent = item.name;
      title.classList.add("item-title");

      const description = document.createElement("p");
      description.textContent = item.description || "Sem descrição";
      description.classList.add("item-description");

      const count = document.createElement("p");
      if (item.type === "library") {
        const numFolders = item.children ? item.children.length : 0;
        count.textContent = `Pastas: ${numFolders}`;
      } else {
        const numDocuments = item.children ? item.children.length : 0;
        count.textContent = `Documentos: ${numDocuments}`;
      }
      count.classList.add("item-count");

      const creationDate = document.createElement("p");
      creationDate.textContent = `Criação: ${item.creationDate || "N/A"}`;
      creationDate.classList.add("item-creation-date");

      // Botões de ação
      const actionButtons = document.createElement("div");
      actionButtons.classList.add("action-buttons");

      // Botão "Editar" com ícone
      const editButton = document.createElement("button");
      editButton.classList.add("edit-button");
      editButton.setAttribute("aria-label", `Editar ${item.name}`);

      const editIcon = document.createElement("img");
      editIcon.src = "./static/imagens/icones/editar.svg";
      editIcon.alt = "Editar";
      editIcon.classList.add("icone-editar");

      editButton.appendChild(editIcon);

      editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        alert(`Editar ${item.name}`);
        // Lógica para editar
      });

      // Botão "Excluir" com ícone
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.setAttribute("aria-label", `Excluir ${item.name}`);

      const deleteIcon = document.createElement("img");
      deleteIcon.src = "./static/imagens/icones/excluir.svg";
      deleteIcon.alt = "Excluir";
      deleteIcon.classList.add("icone-excluir");

      deleteButton.appendChild(deleteIcon);

      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        alert(`Excluir ${item.name}`);
        // Lógica para excluir o documento
      });

      actionButtons.appendChild(editButton);
      actionButtons.appendChild(deleteButton);

      // Adicionar elementos ao card
      div.appendChild(title);
      div.appendChild(description);
      div.appendChild(count);
      div.appendChild(creationDate);
      div.appendChild(actionButtons);

      // Evento de clique para abrir a biblioteca ou pasta
      div.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.resetInactivityTimer();

        // Remover seleção de outros itens
        this.gridContainer
          .querySelectorAll(".item-grid.selected")
          .forEach((el) => el.classList.remove("selected"));
        div.classList.add("selected");

        // Atualizar o caminho atual
        const path = this.findPath(this.state.libraries, item.id);
        if (path) {
          this.state.currentPath = path;
          this.renderBreadcrumbs();

          // Se o item clicado for uma biblioteca ou pasta, precisamos carregar seus filhos
          try {
            if (item.type === "library") {
              if (item.children.length === 0) {
                item.children = await dataService.fetchFolders(item.id);
              }
            } else if (item.type === "folder") {
              if (item.children.length === 0) {
                item.children = await dataService.fetchDocuments(item.id);
              }
            }
            await this.displayContent(item);
            this.saveState();

            // Selecionar o item correspondente na árvore
            const treeItem = this.treeContainer.querySelector(
              `.tree-item[data-id='${item.id}']`
            );
            if (treeItem) {
              this.treeContainer
                .querySelectorAll(".tree-item.selected")
                .forEach((itm) => itm.classList.remove("selected"));
              treeItem.classList.add("selected");

              // Expandir todos os pais
              const parentNodes = path.slice(0, -1);
              for (const parentNode of parentNodes) {
                const parentTreeItem = this.treeContainer.querySelector(
                  `.tree-item[data-id='${parentNode.id}']`
                );
                if (
                  parentTreeItem &&
                  !parentTreeItem.classList.contains("expanded")
                ) {
                  parentTreeItem.classList.add("expanded");
                  const childrenUl =
                    parentTreeItem.querySelector(".tree-children");
                  if (childrenUl) {
                    childrenUl.style.display = "block";
                  }
                }
              }
            }
          } catch (error) {
            console.error("Erro ao exibir conteúdo:", error);
          }
        }
      });

      fragment.appendChild(div);
    });

    this.gridContainer.appendChild(fragment);
  }

  /**
   * Função para renderizar a tabela de documentos
   * @param {Array} documents - Lista de documentos a serem renderizados.
   */
  renderDocumentTable(documents) {
    // Cria o container da tabela
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("tabela-historico");

    const table = document.createElement("table");
    table.id = "tabelaArquivos";

    // Cria o cabeçalho da tabela
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const thId = document.createElement("th");
    thId.classList.add("hidden-column");
    thId.textContent = "ID";
    headerRow.appendChild(thId);

    const thName = document.createElement("th");
    thName.textContent = "Nome";
    headerRow.appendChild(thName);

    const thType = document.createElement("th");
    thType.textContent = "Tipo";
    headerRow.appendChild(thType);

    const thAction = document.createElement("th");
    thAction.textContent = "Ação";
    headerRow.appendChild(thAction);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cria o corpo da tabela
    const tbody = document.createElement("tbody");

    const fragment = document.createDocumentFragment();

    documents.forEach((doc) => {
      const row = document.createElement("tr");
      row.classList.add("document-row");
      row.dataset.id = doc.id;
      row.dataset.type = doc.type;

      const tdId = document.createElement("td");
      tdId.classList.add("hidden-column");
      tdId.textContent = doc.id;
      row.appendChild(tdId);

      const tdName = document.createElement("td");
      tdName.textContent = doc.name;
      row.appendChild(tdName);

      const tdType = document.createElement("td");
      tdType.textContent = "Documento";
      row.appendChild(tdType);

      const tdAction = document.createElement("td");

      // Botão "Ver" com ícone
      const viewButton = document.createElement("button");
      viewButton.classList.add("view-button");
      viewButton.setAttribute("aria-label", `Ver ${doc.name}`);

      const viewIcon = document.createElement("img");
      viewIcon.src = "./static/imagens/icones/ver.svg";
      viewIcon.alt = "Ver";
      viewIcon.classList.add("icone-ver");

      viewButton.appendChild(viewIcon);

      viewButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.resetInactivityTimer();

        // Atualizar o caminho atual
        const path = this.findPath(this.state.libraries, doc.id);
        if (path) {
          this.state.currentPath = path;
          this.renderBreadcrumbs();
          this.displayContent(doc);
          this.saveState();
        }
      });

      // Botão "Excluir" com ícone
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.setAttribute("aria-label", `Excluir ${doc.name}`);

      const deleteIcon = document.createElement("img");
      deleteIcon.src = "./static/imagens/icones/excluir.svg";
      deleteIcon.alt = "Excluir";
      deleteIcon.classList.add("icone-excluir");

      deleteButton.appendChild(deleteIcon);

      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        alert(`Excluir ${doc.name}`);
        // Implementar lógica para excluir o documento
      });

      tdAction.appendChild(viewButton);
      tdAction.appendChild(deleteButton);
      row.appendChild(tdAction);

      // Evento de clique na linha para abrir o documento
      row.addEventListener("click", () => {
        this.resetInactivityTimer();

        // Remover seleção de outras linhas
        tbody
          .querySelectorAll("tr.selected")
          .forEach((r) => r.classList.remove("selected"));
        row.classList.add("selected");

        // Atualizar o caminho atual
        const path = this.findPath(this.state.libraries, doc.id);
        if (path) {
          this.state.currentPath = path;
          this.renderBreadcrumbs();
          this.displayContent(doc);
          this.saveState();
        }
      });

      // Opcional: Adicionar classe de destaque ao passar o mouse
      row.addEventListener("mouseover", () => row.classList.add("hovered"));
      row.addEventListener("mouseout", () => row.classList.remove("hovered"));

      fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Adiciona a tabela ao container principal
    this.gridContainer.appendChild(tableContainer);

    // Adiciona a classe 'no-padding' ao grid-container
    this.gridContainer.classList.add("no-padding");
  }

  /**
   * Função para renderizar Breadcrumbs
   */
  renderBreadcrumbs() {
    // Seleciona todos os elementos de breadcrumb após o "raiz" e os remove
    const breadcrumbs =
      this.breadcrumbContainer.querySelectorAll("span:not(.raiz)");
    breadcrumbs.forEach((breadcrumb) => breadcrumb.remove());

    // Verifica se há um caminho atual para adicionar
    if (this.state.currentPath.length > 0) {
      this.state.currentPath.forEach((node, index) => {
        // Adicionar separador " > " antes de cada item
        const separator = document.createElement("span");
        separator.textContent = " > ";
        this.breadcrumbContainer.appendChild(separator);

        const span = document.createElement("span");
        span.textContent = node.name;
        span.style.color = "var(--cor-primaria-1)";
        span.style.cursor = "pointer";
        span.addEventListener("click", () => {
          // Atualizar o caminho atual até este ponto
          this.state.currentPath = this.state.currentPath.slice(0, index + 1);
          this.renderBreadcrumbs();
          this.displayContent(node);
          this.saveState();
          this.resetInactivityTimer();

          // Selecionar o item correspondente na árvore
          const treeItem = this.treeContainer.querySelector(
            `.tree-item[data-id='${node.id}']`
          );
          if (treeItem) {
            this.treeContainer
              .querySelectorAll(".tree-item.selected")
              .forEach((itm) => itm.classList.remove("selected"));
            treeItem.classList.add("selected");

            // Expandir todos os pais
            const parentNodes = this.state.currentPath.slice(0, -1);
            for (const parentNode of parentNodes) {
              const parentTreeItem = this.treeContainer.querySelector(
                `.tree-item[data-id='${parentNode.id}']`
              );
              if (
                parentTreeItem &&
                !parentTreeItem.classList.contains("expanded")
              ) {
                parentTreeItem.classList.add("expanded");
                const childrenUl =
                  parentTreeItem.querySelector(".tree-children");
                if (childrenUl) {
                  childrenUl.style.display = "block";
                }
              }
            }
          }
        });
        this.breadcrumbContainer.appendChild(span);
      });
    }
  }

  /**
   * Função para alternar filtro (exemplo de funcionalidade)
   */
  toggleOcultarExibirFiltro() {
    const filtro = document.querySelector(
      ".container-filtros-template-content"
    );
    if (filtro) {
      filtro.style.display = filtro.style.display === "none" ? "block" : "none";
    }
  }

  /**
   * Função para atualizar 'totalResults' e 'filtroselect'
   * @param {Object} node - Nó atual para atualização dos contadores.
   */
  updateCounters(node) {
    const totalResultsElement = document.getElementById("totalResults");
    const filtroSelectElement = document.getElementById("filtroselect");

    if (!totalResultsElement || !filtroSelectElement) return;

    let total = 0;
    let label = "";

    if (node.type === "root") {
      total = this.state.libraries.length;
      label = "biblioteca(s)";
    } else if (node.type === "library") {
      total = node.children ? node.children.length : 0;
      label = "pasta(s)";
    } else if (node.type === "folder") {
      total = node.children ? node.children.length : 0;
      label = "arquivo(s)";
    } else if (node.type === "document") {
      total = 1;
      label = node.name;
    }

    totalResultsElement.textContent = total;

    // Limpar o conteúdo anterior
    filtroSelectElement.innerHTML = "";

    // Adicionar o label
    const labelText = document.createElement("span");
    labelText.textContent = label;
    filtroSelectElement.appendChild(labelText);

    // Adicionar o botão "&times;" apenas se não estiver na raiz
    if (node.type !== "root") {
      const removerFiltroLink = document.createElement("a");
      removerFiltroLink.href = "#";
      removerFiltroLink.classList.add("remover-filtro");
      removerFiltroLink.innerHTML = "&times;";
      filtroSelectElement.appendChild(document.createTextNode(" "));
      filtroSelectElement.appendChild(removerFiltroLink);

      // Adicionar evento ao 'remover-filtro'
      removerFiltroLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateBackOneLevel();
      });
    }
  }

  /**
   * Função para navegar um nível para trás no diretório
   */
  navigateBackOneLevel() {
    if (this.state.currentPath.length > 0) {
      // Remove o último nó do caminho atual
      this.state.currentPath.pop();

      // Determina o novo nó atual
      const newNode =
        this.state.currentPath.length > 0
          ? this.state.currentPath[this.state.currentPath.length - 1]
          : { type: "root" };

      // Renderiza os breadcrumbs com o novo caminho
      this.renderBreadcrumbs();

      // Exibe o conteúdo baseado no novo nó
      this.displayContent(newNode);

      // Salva o estado atualizado
      this.saveState();

      // Reseta o timer de inatividade
      this.resetInactivityTimer();

      // Atualiza a seleção na árvore de navegação
      if (newNode.type !== "root") {
        const selectedId = newNode.id;
        const selectedItem = this.treeContainer.querySelector(
          `.tree-item[data-id='${selectedId}']`
        );
        if (selectedItem) {
          this.treeContainer
            .querySelectorAll(".tree-item.selected")
            .forEach((item) => item.classList.remove("selected"));
          selectedItem.classList.add("selected");
        }
      } else {
        // Se estiver na raiz, remove a seleção de todos os itens na árvore
        this.treeContainer
          .querySelectorAll(".tree-item.selected")
          .forEach((item) => item.classList.remove("selected"));
      }
    }
  }

  /**
   * Função para limpar o estado e re-renderizar as bibliotecas
   */
  clearState() {
    localStorage.removeItem("fileExplorerState");
    this.state.currentPath = [];
    this.renderBreadcrumbs();
    // Remover todas as expansões
    this.treeContainer
      .querySelectorAll(".tree-item.expanded")
      .forEach((item) => item.classList.remove("expanded"));
    // Remover todas as seleções
    this.treeContainer
      .querySelectorAll(".tree-item.selected")
      .forEach((item) => item.classList.remove("selected"));
    // Limpar e mostrar todas as bibliotecas
    this.gridContainer.innerHTML = "";
    this.renderGrid(this.state.libraries, "library");

    // Remover a classe 'no-padding' caso esteja presente
    this.gridContainer.classList.remove("no-padding");
  }

  /**
   * Função para inicializar a navegação em árvore e carregar o estado
   */
  async start() {
    await this.init();
  }

  /**
   * Função para lidar com inatividade do usuário
   */
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.clearState();
    }, this.INACTIVITY_TIMEOUT);
  }
}

// Instanciar e iniciar o FileNavigator
document.addEventListener("DOMContentLoaded", () => {
  const fileNavigator = new FileNavigator();
  fileNavigator.start();
});
