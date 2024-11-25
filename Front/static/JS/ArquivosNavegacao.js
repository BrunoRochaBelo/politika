// ArquivosNavegacao.js

import { dataService } from "./ArquivosListaDeArquivos.js";

/**
 * Classe para gerenciar a navegação e a interface do explorador de arquivos
 */
class FileNavigator {
  constructor() {
    // Estado centralizado
    this.state = {
      libraries: [], // Lista de todas as bibliotecas
      folders: {}, // { [libraryId]: [folders] }
      documents: {}, // { [folderId]: [documents] }
      currentPath: [], // Array de nós representando o caminho atual
      selectedTreeItemId: null, // ID do item selecionado na árvore
      selectedGridItemId: null, // ID do item selecionado no grid
    };

    // Seletores dos elementos do DOM
    this.breadcrumbContainer = document.querySelector(".breadcrumbs");
    this.gridContainer = document.querySelector(".grid-container");
    this.treeContainer = document.querySelector(".lista-vertical-fil");

    // Verificar se os elementos existem antes de adicionar event listeners
    if (this.breadcrumbContainer) {
      // Selecionar o elemento "raiz" do breadcrumbs
      this.raizSpan = this.breadcrumbContainer.querySelector(".raiz");
      if (this.raizSpan) {
        this.raizSpan.addEventListener("click", () => this.resetToRoot());
      }
    }

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
      this.displayTreeLoading(this.treeContainer, "Carregando bibliotecas...");
      this.state.libraries = await dataService.fetchLibraries();
      await this.renderTree(this.treeContainer, this.state.libraries);
    } catch (error) {
      console.error("Erro ao inicializar o navegador de arquivos:", error);
      this.displayError(
        "Erro ao carregar bibliotecas. Por favor, tente novamente mais tarde."
      );
      return;
    }

    // Carregar o estado salvo, se houver
    await this.loadState();

    // Se não houver caminho atual, mostrar a raiz (todas as bibliotecas no grid)
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
    // Implementar delegação de eventos se necessário
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
  async resetToRoot() {
    this.state.currentPath = [];
    this.renderBreadcrumbs();
    this.deselectAllTreeItems();
    this.deselectAllGridItems();
    await this.displayContent({ type: "root" });
    this.saveState();
  }

  /**
   * Função para encontrar o caminho até um nó específico
   * @param {Array} nodes - Lista de nós.
   * @param {number|string} targetId - ID do nó alvo.
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
   * @param {number|string} id - ID do nó a ser encontrado.
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
    try {
      const expandedElements = Array.from(
        this.treeContainer.querySelectorAll(".tree-item.expanded")
      ).map((el) => el.dataset.id);
      const stateToSave = {
        currentPath: this.state.currentPath.map((node) => node.id),
        expandedItems: expandedElements,
      };
      localStorage.setItem("fileExplorerState", JSON.stringify(stateToSave));
      console.log("Estado salvo:", stateToSave);
    } catch (error) {
      console.error("Erro ao salvar o estado no LocalStorage:", error);
    }
  }

  /**
   * Função para carregar o estado do LocalStorage
   */
  async loadState() {
    try {
      const savedState = JSON.parse(localStorage.getItem("fileExplorerState"));
      console.log("Estado carregado:", savedState);
      if (savedState) {
        // Restaurar currentPath
        if (savedState.currentPath && savedState.currentPath.length > 0) {
          const pathNodes = [];
          for (const id of savedState.currentPath) {
            const parsedId = isNaN(id) ? id : parseInt(id, 10);
            const node = this.findNodeById(this.state.libraries, parsedId);
            if (node) {
              pathNodes.push(node);
              // Garantir que os filhos estejam carregados
              if (node.type === "library" && !this.state.folders[node.id]) {
                try {
                  const folders = await dataService.fetchFolders(node.id);
                  node.children = folders;
                  this.state.folders[node.id] = folders;
                } catch (error) {
                  console.error(
                    `Erro ao carregar pastas da biblioteca ${node.id}:`,
                    error
                  );
                  this.displayError(
                    "Erro ao carregar pastas. Por favor, tente novamente mais tarde."
                  );
                  return;
                }
              }
              if (node.type === "folder" && !this.state.documents[node.id]) {
                try {
                  const documents = await dataService.fetchDocuments(node.id);
                  node.children = documents;
                  this.state.documents[node.id] = documents;
                } catch (error) {
                  console.error(
                    `Erro ao carregar documentos da pasta ${node.id}:`,
                    error
                  );
                  this.displayError(
                    "Erro ao carregar documentos. Por favor, tente novamente mais tarde."
                  );
                  return;
                }
              }
            }
          }

          this.state.currentPath = pathNodes;
          this.renderBreadcrumbs();

          const lastNode = pathNodes[pathNodes.length - 1];
          await this.displayContent(lastNode);

          // Selecionar o último item no path na árvore
          const selectedId = lastNode.id.toString(); // Garantir string para querySelector
          const selectedItem = this.treeContainer.querySelector(
            `.tree-item[data-id='${selectedId}']`
          );
          if (selectedItem) {
            this.deselectAllTreeItems();
            selectedItem.classList.add("selected");
          }

          // Expandir os nós no caminho
          for (const node of pathNodes.slice(0, -1)) {
            const treeItem = this.treeContainer.querySelector(
              `.tree-item[data-id='${node.id}']`
            );
            if (treeItem && !treeItem.classList.contains("expanded")) {
              await this.toggleExpandCollapse(treeItem, node);
            }
          }
        }

        // Restaurar itens expandidos
        if (savedState.expandedItems && savedState.expandedItems.length > 0) {
          for (const id of savedState.expandedItems) {
            const parsedId = isNaN(id) ? id : parseInt(id, 10);
            const treeItem = this.treeContainer.querySelector(
              `.tree-item[data-id='${parsedId}']`
            );
            const node = this.findNodeById(this.state.libraries, parsedId);
            if (treeItem && node && !treeItem.classList.contains("expanded")) {
              await this.toggleExpandCollapse(treeItem, node);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar o estado do LocalStorage:", error);
    }
  }

  /**
   * Função para limpar o estado no LocalStorage e resetar a interface
   */
  clearState() {
    try {
      localStorage.removeItem("fileExplorerState");
      this.state.currentPath = [];
      this.renderBreadcrumbs();
      this.deselectAllTreeItems();
      this.deselectAllGridItems();
      this.displayContent({ type: "root" });
      this.resetInactivityTimer();
    } catch (error) {
      console.error("Erro ao limpar o estado:", error);
    }
  }

  /**
   * Função para exibir mensagens de erro na interface do usuário
   * @param {string} message - Mensagem de erro a ser exibida.
   */
  displayError(message) {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = ""; // Limpar conteúdo existente
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = message;
    this.gridContainer.appendChild(errorDiv);
  }

  /**
   * Função para exibir detalhes de um documento
   * @param {Object} document - Documento a ser exibido.
   */
  displayDocumentDetails(document) {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = ""; // Limpar conteúdo existente
    const docDiv = document.createElement("div");
    docDiv.classList.add("document-details");
    docDiv.innerHTML = `
      <h2>${this.escapeHtml(document.name)}</h2>
      <p>${this.escapeHtml(document.description || "Sem descrição")}</p>
      <p>Data de Criação: ${this.escapeHtml(document.creationDate || "N/A")}</p>
      <!-- Adicione mais detalhes conforme necessário -->
    `;
    this.gridContainer.appendChild(docDiv);
  }

  /**
   * Função para exibir mensagens no grid
   * @param {string} message - Mensagem a ser exibida.
   */
  displayMessage(message) {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = ""; // Limpar conteúdo existente
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.classList.add("info-message");
    this.gridContainer.appendChild(messageDiv);
  }

  /**
   * Função para exibir mensagens de carregamento
   * @param {string} message - Mensagem de carregamento a ser exibida.
   */
  displayLoading(message = "Carregando...") {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = ""; // Limpar conteúdo existente
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading-message");
    loadingDiv.innerHTML = `
      <div class="spinner"></div>
      <span>${this.escapeHtml(message)}</span>
    `;
    this.gridContainer.appendChild(loadingDiv);
  }

  /**
   * Função para exibir mensagens de carregamento na árvore
   * @param {HTMLElement} container - Container onde a árvore será renderizada.
   * @param {string} message - Mensagem de carregamento a ser exibida.
   */
  displayTreeLoading(container, message = "Carregando...") {
    if (!container) return;
    container.innerHTML = ""; // Limpar conteúdo existente
    const loadingLi = document.createElement("li");
    loadingLi.classList.add("tree-item", "loading");
    loadingLi.innerHTML = `
      <div class="spinner-tree"></div>
      <span>${this.escapeHtml(message)}</span>
    `;
    container.appendChild(loadingLi);
  }

  /**
   * Função para renderizar a navegação em árvore
   * @param {HTMLElement} container - Container onde a árvore será renderizada.
   * @param {Array} nodes - Lista de nós a serem renderizados.
   */
  async renderTree(container, nodes) {
    if (!container || !Array.isArray(nodes)) return;

    // Limpar o container antes de renderizar
    container.innerHTML = "";

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

      // Evento de seleção na árvore
      nodeNameSpan.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.resetInactivityTimer();
        await this.handleTreeSelection(li, node);
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

      ul.appendChild(li);
    }

    container.appendChild(ul);
  }

  /**
   * Função para alternar a expansão ou contração de um item na árvore
   * @param {HTMLElement} li - Elemento <li> da árvore.
   * @param {Object} node - Nó associado.
   */
  async toggleExpandCollapse(li, node) {
    if (!li || !node) return;

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

      if (node.type === "library") {
        // Carregar pastas da biblioteca se ainda não estiverem carregadas
        if (!this.state.folders[node.id]) {
          try {
            this.displayTreeLoading(childrenUl, "Carregando pastas...");
            const folders = await dataService.fetchFolders(node.id);
            this.state.folders[node.id] = folders;
            node.children = folders;
            // Renderizar pastas na árvore
            this.renderChildNodes(childrenUl, folders);
          } catch (error) {
            console.error(
              `Erro ao carregar pastas da biblioteca ${node.id}:`,
              error
            );
            this.displayError(
              "Erro ao carregar pastas. Por favor, tente novamente mais tarde."
            );
            // Retirar a classe 'expanded' para refletir o erro
            li.classList.remove("expanded");
            childrenUl.style.display = "none";
            return;
          }
        } else {
          // Pastas já carregadas
          this.renderChildNodes(childrenUl, this.state.folders[node.id]);
        }
      } else if (node.type === "folder") {
        // Carregar documentos da pasta se ainda não estiverem carregados
        if (!this.state.documents[node.id]) {
          try {
            this.displayTreeLoading(childrenUl, "Carregando documentos...");
            const documents = await dataService.fetchDocuments(node.id);
            this.state.documents[node.id] = documents;
            node.children = documents;
            // Renderizar documentos na árvore
            this.renderChildNodes(childrenUl, documents);
          } catch (error) {
            console.error(
              `Erro ao carregar documentos da pasta ${node.id}:`,
              error
            );
            this.displayError(
              "Erro ao carregar documentos. Por favor, tente novamente mais tarde."
            );
            // Retirar a classe 'expanded' para refletir o erro
            li.classList.remove("expanded");
            childrenUl.style.display = "none";
            return;
          }
        } else {
          // Documentos já carregados
          this.renderChildNodes(childrenUl, this.state.documents[node.id]);
        }
      }
    }

    this.saveState();
  }

  /**
   * Função para renderizar os nós filhos na árvore
   * @param {HTMLElement} container - <ul> onde os nós filhos serão adicionados.
   * @param {Array} children - Lista de nós filhos.
   */
  renderChildNodes(container, children) {
    if (!container || !Array.isArray(children)) return;

    container.innerHTML = ""; // Limpar antes de renderizar

    if (children.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.classList.add("tree-item", "empty");
      emptyLi.textContent = "Nenhum item encontrado.";
      container.appendChild(emptyLi);
      return;
    }

    for (const child of children) {
      const li = document.createElement("li");
      li.classList.add("tree-item", child.type);
      li.dataset.id = child.id;
      li.dataset.type = child.type;
      li.tabIndex = 0; // Para acessibilidade via teclado

      // Expand/Collapse toggle
      if (child.type === "library" || child.type === "folder") {
        const toggleIcon = document.createElement("span");
        toggleIcon.classList.add("toggle-icon");
        li.appendChild(toggleIcon);

        // Evento de expansão/contração via evento delegado
        toggleIcon.addEventListener("click", async (e) => {
          e.stopPropagation();
          this.resetInactivityTimer();
          await this.toggleExpandCollapse(li, child);
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
      nodeNameSpan.textContent = child.name;
      nodeNameSpan.classList.add("node-name");
      li.appendChild(nodeNameSpan);

      // Evento de seleção na árvore
      nodeNameSpan.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.resetInactivityTimer();
        await this.handleTreeSelection(li, child);
      });

      // Acessibilidade: teclado
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          nodeNameSpan.click();
        }
      });

      // Preparar container para filhos
      if (child.type !== "document") {
        const childrenUl = document.createElement("ul");
        childrenUl.classList.add("tree-children");
        childrenUl.style.display = "none"; // Inicialmente oculto
        li.appendChild(childrenUl);
      }

      container.appendChild(li);
    }
  }

  /**
   * Função para tratar a seleção de um nó na árvore
   * @param {HTMLElement} li - Elemento <li> da árvore.
   * @param {Object} node - Nó associado.
   */
  async handleTreeSelection(li, node) {
    if (!li || !node) return;

    // Atualizar seleção visual
    this.deselectAllTreeItems();
    li.classList.add("selected");
    this.state.selectedTreeItemId = node.id;

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
   * Função para exibir o conteúdo na main-section
   * @param {Object} node - Nó atual a ser exibido.
   */
  async displayContent(node) {
    if (!node || !this.gridContainer) return;

    // Limpar conteúdo atual
    this.gridContainer.innerHTML = "";

    // Remove a classe 'no-padding' por padrão
    this.gridContainer.classList.remove("no-padding");

    // Exibir indicador de carregamento
    this.displayLoading("Carregando conteúdo...");

    try {
      if (node.type === "library") {
        // Mostrar pastas no grid
        if (!this.state.folders[node.id]) {
          this.state.folders[node.id] = await dataService.fetchFolders(node.id);
        }
        const folders = this.state.folders[node.id];
        if (folders.length > 0) {
          this.renderGrid(folders, "folder");
        } else {
          this.displayMessage("Nenhuma pasta encontrada nesta biblioteca.");
        }
      } else if (node.type === "folder") {
        // Mostrar documentos no grid como lista vertical
        if (!this.state.documents[node.id]) {
          this.state.documents[node.id] = await dataService.fetchDocuments(
            node.id
          );
        }
        const documents = this.state.documents[node.id];
        if (documents.length > 0) {
          this.renderGrid(documents, "document");
        } else {
          this.displayMessage("Nenhum documento encontrado nesta pasta.");
        }
      } else if (node.type === "document") {
        // Mostrar detalhes do documento
        this.displayDocumentDetails(node);
      } else if (node.type === "root") {
        // Mostrar todas as bibliotecas no grid
        this.renderGrid(this.state.libraries, "library");
      }

      // Atualizar os contadores
      this.updateCounters(node);
    } catch (error) {
      console.error("Erro ao exibir conteúdo:", error);
      this.displayError(
        "Erro ao carregar conteúdo. Por favor, tente novamente mais tarde."
      );
    }
  }

  /**
   * Função para renderizar o grid na main-section
   * @param {Array} items - Lista de itens a serem renderizados.
   * @param {string} type - Tipo de item (library, folder, document).
   */
  renderGrid(items, type) {
    if (!Array.isArray(items) || !this.gridContainer) return;

    this.gridContainer.innerHTML = ""; // Limpar conteúdo existente

    if (items.length === 0) {
      this.displayMessage("Nenhum item encontrado.");
      return;
    }

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
      if (type === "library") {
        const numFolders = item.numFolders || 0;
        count.textContent = `Pastas: ${numFolders}`;
      } else if (type === "folder") {
        const numDocuments = item.numDocuments || 0;
        count.textContent = `Documentos: ${numDocuments}`;
      } else if (type === "document") {
        count.textContent = `Tipo: Documento`;
      }
      count.classList.add("item-count");

      const creationDate = document.createElement("p");
      creationDate.textContent = `Criação: ${item.creationDate || "N/A"}`;
      creationDate.classList.add("item-creation-date");

      // Botões de ação
      const actionButtons = document.createElement("div");
      actionButtons.classList.add("action-buttons");

      // **Adicionar Botão "Editar" apenas para library e folder**
      if (type === "library" || type === "folder") {
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

        actionButtons.appendChild(editButton);
      }

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
        // Lógica para excluir o item
      });

      actionButtons.appendChild(deleteButton);

      // Adicionar elementos ao card
      div.appendChild(title);
      div.appendChild(description);
      div.appendChild(count);
      div.appendChild(creationDate);
      div.appendChild(actionButtons);

      // Evento de clique para abrir a biblioteca, pasta ou exibir detalhes do documento
      div.addEventListener("click", async (e) => {
        e.stopPropagation();
        this.resetInactivityTimer();

        // Atualizar seleção visual no grid
        this.deselectAllGridItems();
        div.classList.add("selected");
        this.state.selectedGridItemId = item.id;

        // Atualizar o caminho atual de forma incremental
        // Assumindo que os itens no grid são filhos do último item no currentPath
        // Se currentPath está vazio, os itens são bibliotecas
        let newPath = [];
        if (this.state.currentPath.length === 0) {
          // Navegando a partir da raiz
          newPath = [item];
        } else {
          // Navegando a partir de um nível existente
          newPath = [...this.state.currentPath, item];
        }

        console.log("Novo caminho ao clicar no grid:", newPath);

        this.state.currentPath = newPath;
        this.renderBreadcrumbs();
        await this.displayContent(item);
        this.saveState();

        // Selecionar o item correspondente na árvore
        const selectedId = item.id.toString(); // Garantir string para querySelector
        const treeItem = this.treeContainer.querySelector(
          `.tree-item[data-id='${selectedId}']`
        );
        if (treeItem) {
          this.deselectAllTreeItems();
          treeItem.classList.add("selected");

          // Expandir os nós pais na árvore
          for (const parentNode of this.state.currentPath.slice(0, -1)) {
            const parentTreeItem = this.treeContainer.querySelector(
              `.tree-item[data-id='${parentNode.id}']`
            );
            if (
              parentTreeItem &&
              !parentTreeItem.classList.contains("expanded")
            ) {
              await this.toggleExpandCollapse(parentTreeItem, parentNode);
            }
          }
        }
      });

      fragment.appendChild(div);
    });

    this.gridContainer.appendChild(fragment);
  }

  /**
   * Função para renderizar Breadcrumbs
   */
  renderBreadcrumbs() {
    if (!this.breadcrumbContainer) return;

    // Limpar breadcrumbs existentes (exceto a raiz)
    this.breadcrumbContainer
      .querySelectorAll("span:not(.raiz)")
      .forEach((span) => span.remove());

    // Adicionar breadcrumbs com base no currentPath
    this.state.currentPath.forEach((node, index) => {
      const separator = document.createElement("span");
      separator.textContent = " > ";
      this.breadcrumbContainer.appendChild(separator);

      const span = document.createElement("span");
      span.textContent = node.name;
      span.style.color = "var(--cor-primaria-1)";
      span.style.cursor = "pointer";
      span.tabIndex = 0;
      span.addEventListener("click", async () => {
        // Atualizar o caminho atual até este ponto
        this.state.currentPath = this.state.currentPath.slice(0, index + 1);
        this.renderBreadcrumbs();
        const selectedNode =
          this.state.currentPath[this.state.currentPath.length - 1];
        await this.displayContent(selectedNode);
        this.saveState();
        this.resetInactivityTimer();

        // Selecionar o item correspondente na árvore
        const selectedId = selectedNode.id.toString();
        const treeItem = this.treeContainer.querySelector(
          `.tree-item[data-id='${selectedId}']`
        );
        if (treeItem) {
          this.deselectAllTreeItems();
          treeItem.classList.add("selected");

          // Expandir os nós pais na árvore
          for (const parentNode of this.state.currentPath.slice(0, -1)) {
            const parentTreeItem = this.treeContainer.querySelector(
              `.tree-item[data-id='${parentNode.id}']`
            );
            if (
              parentTreeItem &&
              !parentTreeItem.classList.contains("expanded")
            ) {
              await this.toggleExpandCollapse(parentTreeItem, parentNode);
            }
          }
        }
      });

      // Acessibilidade: teclado
      span.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          span.click();
        }
      });

      this.breadcrumbContainer.appendChild(span);
    });
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
      total = node.numFolders || 0;
      label = "pasta(s)";
    } else if (node.type === "folder") {
      total = node.numDocuments || 0;
      label = "documento(s)";
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
      removerFiltroLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.navigateBackOneLevel();
      });

      // Acessibilidade: teclado
      removerFiltroLink.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          removerFiltroLink.click();
        }
      });
    }
  }

  /**
   * Função para navegar um nível para trás no diretório
   */
  async navigateBackOneLevel() {
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
      await this.displayContent(newNode);

      // Salva o estado atualizado
      this.saveState();

      // Reseta o timer de inatividade
      this.resetInactivityTimer();

      // Atualiza a seleção na árvore de navegação
      if (newNode.type !== "root") {
        const selectedId = newNode.id.toString();
        const selectedItem = this.treeContainer.querySelector(
          `.tree-item[data-id='${selectedId}']`
        );
        if (selectedItem) {
          this.deselectAllTreeItems();
          selectedItem.classList.add("selected");

          // Expandir os nós pais na árvore
          for (const parentNode of this.state.currentPath.slice(0, -1)) {
            const parentTreeItem = this.treeContainer.querySelector(
              `.tree-item[data-id='${parentNode.id}']`
            );
            if (
              parentTreeItem &&
              !parentTreeItem.classList.contains("expanded")
            ) {
              await this.toggleExpandCollapse(parentTreeItem, parentNode);
            }
          }
        }
      } else {
        // Se estiver na raiz, remove a seleção de todos os itens na árvore
        this.deselectAllTreeItems();
      }
    }
  }

  /**
   * Função para limpar seleções na árvore
   */
  deselectAllTreeItems() {
    if (!this.treeContainer) return;
    this.treeContainer
      .querySelectorAll(".tree-item.selected")
      .forEach((item) => item.classList.remove("selected"));
  }

  /**
   * Função para limpar seleções no grid
   */
  deselectAllGridItems() {
    if (!this.gridContainer) return;
    this.gridContainer
      .querySelectorAll(".item-grid.selected")
      .forEach((item) => item.classList.remove("selected"));
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
   * Função para iniciar a navegação
   */
  async start() {
    await this.init();
    // Nenhuma lógica relacionada ao toggleFiltroButton
  }

  /**
   * Função para escapar caracteres HTML para evitar XSS
   * @param {string} unsafe - Texto que pode conter caracteres HTML.
   * @returns {string} - Texto seguro.
   */
  escapeHtml(unsafe) {
    if (typeof unsafe !== "string") return "";
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

/**
 * Função para renderizar os nós filhos na árvore
 * @param {HTMLElement} container - <ul> onde os nós filhos serão adicionados.
 * @param {Array} children - Lista de nós filhos.
 */
FileNavigator.prototype.renderChildNodes =
  FileNavigator.prototype.renderChildNodes;

/**
 * Função para tratar a seleção de um nó na árvore
 * @param {HTMLElement} li - Elemento <li> da árvore.
 * @param {Object} node - Nó associado.
 */
FileNavigator.prototype.handleTreeSelection =
  FileNavigator.prototype.handleTreeSelection;

// Instanciar e iniciar o FileNavigator
document.addEventListener("DOMContentLoaded", () => {
  const fileNavigator = new FileNavigator();
  fileNavigator.start();
});

export { FileNavigator };
