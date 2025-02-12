/**
 * ArquivosNavegacao.js
 *
 * Implementa a navegação do explorador de arquivos para produção.
 * Depende de window.Config e window.dataService.
 *
 * Comportamentos:
 * - Ao carregar a página (sem estado salvo), exibe todas as bibliotecas no grid e renderiza a árvore.
 * - Clicar em “raiz” (no breadcrumb ou no elemento com classe “raiz-tree”) reseta a navegação para exibir todas as bibliotecas.
 * - Ao selecionar um item (biblioteca, pasta ou documento) via árvore ou grid, o currentPath é recalculado para refletir exatamente o conteúdo exibido no grid.
 * - Se uma biblioteca ou pasta estiver aberta (com seus filhos exibidos no grid), o nó correspondente na árvore será expandido e marcado como "selected".
 * - Ao clicar num documento na árvore, o grid exibe a pasta que o contém e, em seguida, o documento é aberto externamente.
 * - O estado é salvo e restaurado, inclusive em redimensionamentos.
 */

(function () {
  if (typeof dataService === "undefined") {
    console.error(
      "dataService não está definido. Verifique se ArquivosListaDeArquivos.js foi carregado antes."
    );
    return;
  }

  function FileNavigator() {
    this.state = {
      libraries: [],
      currentPath: [], // Array de nós representando o caminho atual (a partir da biblioteca selecionada)
    };
    this.breadcrumbContainer = document.querySelector(".breadcrumbs");
    this.gridContainer = document.querySelector(".grid-container");
    this.treeContainer = document.querySelector(".lista-vertical-fil");
    this.INACTIVITY_TIMEOUT = 10 * 60 * 1000;
    this.inactivityTimer = null;
  }

  // Inicializa: carrega bibliotecas, renderiza a árvore e restaura o estado salvo.
  FileNavigator.prototype.init = async function () {
    try {
      this.showTreeLoading("Carregando bibliotecas...");
      this.state.libraries = await dataService.fetchLibraries();
      this.renderTree();
      // Configura clique no "raiz-tree" para resetar
      var raizTree = document.querySelector(".raiz-tree");
      if (raizTree) {
        raizTree.addEventListener("click", this.resetToRoot.bind(this));
      }
      await this.restoreState();
      if (this.state.currentPath.length === 0) {
        await this.displayContent({ type: "root" });
      }
    } catch (error) {
      this.displayError("Erro ao carregar bibliotecas.");
      console.error(error);
    }
    this.startInactivityTimer();
    this.setupGlobalEvents();
  };

  FileNavigator.prototype.setupGlobalEvents = function () {
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(
      (eventName) => {
        document.addEventListener(
          eventName,
          this.startInactivityTimer.bind(this)
        );
      }
    );
    window.addEventListener("resize", this.handleResize.bind(this));
  };

  FileNavigator.prototype.startInactivityTimer = function () {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.clearState();
    }, this.INACTIVITY_TIMEOUT);
  };

  FileNavigator.prototype.clearState = function () {
    localStorage.removeItem("fileExplorerState");
    this.state.currentPath = [];
    this.renderBreadcrumbs();
    this.displayContent({ type: "root" });
    this.startInactivityTimer();
  };

  FileNavigator.prototype.displayError = function (message) {
    this.gridContainer.innerHTML =
      "<div class='error-message'>" + message + "</div>";
  };

  FileNavigator.prototype.showTreeLoading = function (message) {
    this.treeContainer.innerHTML =
      "<ul class='tree-container'><li class='tree-item loading'><div class='spinner-tree'></div><span>" +
      message +
      "</span></li></ul>";
  };

  // Renderiza a árvore com as bibliotecas
  FileNavigator.prototype.renderTree = function () {
    var ul = document.createElement("ul");
    ul.className = "tree-container";
    this.state.libraries.forEach((library) => {
      var li = this.createTreeNode(library);
      ul.appendChild(li);
    });
    this.treeContainer.innerHTML = "";
    this.treeContainer.appendChild(ul);
  };

  // Cria um nó da árvore (biblioteca, pasta ou documento)
  FileNavigator.prototype.createTreeNode = function (node) {
    var li = document.createElement("li");
    li.className = "tree-item " + node.type;
    li.dataset.id = node.id;
    li.dataset.type = node.type;
    li.tabIndex = 0;

    // Exibe toggle se houver filhos: biblioteca se numFolders > 0; pasta se numDocuments > 0
    var hasChildren = false;
    if (node.type === "library" && node.numFolders > 0) hasChildren = true;
    if (node.type === "folder" && node.numDocuments > 0) hasChildren = true;

    if (hasChildren) {
      var toggle = document.createElement("span");
      toggle.className = "toggle-icon";
      toggle.addEventListener("click", async (e) => {
        e.stopPropagation();
        await this.toggleNode(li, node);
        this.scrollSelectedIntoView();
      });
      li.appendChild(toggle);
    } else {
      var placeholder = document.createElement("span");
      placeholder.className = "toggle-icon-placeholder";
      li.appendChild(placeholder);
    }

    var nameSpan = document.createElement("span");
    nameSpan.className = "node-name";
    nameSpan.textContent = node.name;
    nameSpan.addEventListener("click", async (e) => {
      e.stopPropagation();
      await this.selectNode(li, node);
      this.scrollSelectedIntoView();
    });
    li.appendChild(nameSpan);

    if (node.type !== "document") {
      var childUl = document.createElement("ul");
      childUl.className = "tree-children";
      li.appendChild(childUl);
    }
    return li;
  };

  // Expande ou contrai um nó na árvore (confia no CSS para as transições)
  FileNavigator.prototype.toggleNode = async function (li, node) {
    var childUl = li.querySelector(".tree-children");
    if (!childUl) return;
    if (li.classList.contains("expanded")) {
      li.classList.remove("expanded");
    } else {
      li.classList.add("expanded");
      if (node.type === "library") {
        if (!node.children || node.children.length === 0) {
          try {
            var folders = await dataService.fetchFolders(node.id);
            node.children = folders;
          } catch (e) {
            this.displayError(
              "Erro ao carregar pastas da biblioteca " + node.id
            );
            li.classList.remove("expanded");
            return;
          }
        }
      } else if (node.type === "folder") {
        if (!node.children || node.children.length === 0) {
          try {
            var docs = await dataService.fetchDocuments(node.id);
            node.children = docs;
          } catch (e) {
            this.displayError(
              "Erro ao carregar documentos da pasta " + node.id
            );
            li.classList.remove("expanded");
            return;
          }
        }
      }
      var childUl = li.querySelector(".tree-children");
      childUl.innerHTML = "";
      node.children.forEach((child) => {
        var childLi = this.createTreeNode(child);
        childUl.appendChild(childLi);
      });
    }
    this.saveState();
  };

  // Seleciona um nó na árvore e recalcula o currentPath com base na hierarquia original
  FileNavigator.prototype.selectNode = async function (li, node) {
    if (node.type === "document") {
      // Se for documento, mostra no grid a pasta que o contém e abre o documento externamente.
      var fullPath = this.findPath(this.state.libraries, node.id);
      if (fullPath && fullPath.length >= 2) {
        var parentFolder = fullPath[fullPath.length - 2];
        this.state.currentPath = this.findPath(
          this.state.libraries,
          parentFolder.id
        );
        this.renderBreadcrumbs();
        await this.displayContent(parentFolder);
      }
      if (node.url) {
        window.open(node.url, "_blank");
      } else {
        this.displayError("URL do documento não encontrada.");
      }
      return;
    }
    // Se for biblioteca, definimos currentPath explicitamente
    if (node.type === "library") {
      this.state.currentPath = [node];
    } else if (node.type === "folder") {
      let library = this.state.libraries.find(
        (lib) => this.findPath([lib], node.id).length > 0
      );
      if (library) {
        this.state.currentPath = [library, node];
      } else {
        this.state.currentPath = this.findPath(this.state.libraries, node.id);
      }
    }
    this.clearTreeSelection();
    li.classList.add("selected");
    this.renderBreadcrumbs();
    await this.displayContent(node);
    this.saveState();
    await this.syncTreeSelection();
  };

  FileNavigator.prototype.clearTreeSelection = function () {
    var selected = this.treeContainer.querySelectorAll(".tree-item.selected");
    selected.forEach((item) => item.classList.remove("selected"));
  };

  // Sincroniza a árvore com o currentPath, garantindo que o último nó esteja expandido e selecionado.
  FileNavigator.prototype.syncTreeSelection = async function () {
    var currentPath = this.state.currentPath;
    if (!currentPath || currentPath.length === 0) return;
    for (var i = 0; i < currentPath.length; i++) {
      var node = currentPath[i];
      var li = this.treeContainer.querySelector(
        ".tree-item[data-id='" + node.id + "']"
      );
      if (li) {
        if (i < currentPath.length - 1 && !li.classList.contains("expanded")) {
          await this.toggleNode(li, node);
        }
        if (
          i === currentPath.length - 1 &&
          (node.type === "folder" || node.type === "library") &&
          !li.classList.contains("expanded")
        ) {
          await this.toggleNode(li, node);
        }
        if (i === currentPath.length - 1) {
          this.clearTreeSelection();
          li.classList.add("selected");
        }
      }
    }
    this.scrollSelectedIntoView();
  };

  FileNavigator.prototype.scrollSelectedIntoView = function () {
    var selected = this.treeContainer.querySelector(".tree-item.selected");
    if (selected) {
      selected.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Renderiza os breadcrumbs de acordo com o currentPath.
  FileNavigator.prototype.renderBreadcrumbs = function () {
    this.breadcrumbContainer.innerHTML = "";
    // Se o currentPath estiver vazio, exibe apenas "raiz"
    if (this.state.currentPath.length === 0) {
      var rootSpan = document.createElement("span");
      rootSpan.className = "raiz";
      rootSpan.textContent = "raiz";
      rootSpan.addEventListener("click", async () => {
        await this.resetToRoot();
        this.saveState();
      });
      this.breadcrumbContainer.appendChild(rootSpan);
      return;
    }
    // Exibe "raiz > ..." conforme o currentPath
    var rootSpan = document.createElement("span");
    rootSpan.className = "raiz";
    rootSpan.textContent = "raiz";
    rootSpan.addEventListener("click", async () => {
      await this.resetToRoot();
      this.saveState();
    });
    this.breadcrumbContainer.appendChild(rootSpan);
    this.state.currentPath.forEach((node, idx) => {
      var sep = document.createElement("span");
      sep.textContent = " > ";
      this.breadcrumbContainer.appendChild(sep);
      var span = document.createElement("span");
      span.textContent = node.name;
      // Remove o estilo inline e utiliza a classe para itens clicáveis
      span.className = "clickable";
      span.addEventListener("click", async () => {
        this.state.currentPath = this.findPath(this.state.libraries, node.id);
        this.renderBreadcrumbs();
        await this.displayContent(node);
        this.saveState();
      });
      this.breadcrumbContainer.appendChild(span);
    });
  };

  // Encontra o caminho (array de nós) até um nó com o id especificado
  FileNavigator.prototype.findPath = function (nodes, targetId, path) {
    path = path || [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var newPath = path.concat(node);
      if (node.id == targetId) return newPath;
      if (node.children && node.children.length > 0) {
        var result = this.findPath(node.children, targetId, newPath);
        if (result) return result;
      }
    }
    return [];
  };

  // Exibe o conteúdo no grid conforme o nó selecionado
  FileNavigator.prototype.displayContent = async function (node) {
    this.gridContainer.innerHTML = "";
    if (node.type === "root") {
      this.renderGrid(this.state.libraries, "library");
    } else if (node.type === "library") {
      if (!node.children || node.children.length === 0) {
        try {
          var folders = await dataService.fetchFolders(node.id);
          node.children = folders;
        } catch (e) {
          this.displayError("Erro ao carregar pastas da biblioteca " + node.id);
          return;
        }
      }
      this.renderGrid(node.children, "folder");
    } else if (node.type === "folder") {
      if (!node.children || node.children.length === 0) {
        try {
          var docs = await dataService.fetchDocuments(node.id);
          node.children = docs;
        } catch (e) {
          this.displayError("Erro ao carregar documentos da pasta " + node.id);
          return;
        }
      }
      this.renderGrid(node.children, "document");
    } else if (node.type === "document") {
      if (node.url) {
        window.open(node.url, "_blank");
      } else {
        this.displayError("URL do documento não encontrada.");
      }
      return;
    }
    this.updateCounters(node);
  };

  // Renderiza os itens no grid
  FileNavigator.prototype.renderGrid = function (items, type) {
    this.gridContainer.innerHTML = "";
    if (!items || items.length === 0) {
      this.gridContainer.innerHTML =
        "<div class='info-message'>Nenhum item encontrado.</div>";
      return;
    }
    var fragment = document.createDocumentFragment();
    items.forEach((item) => {
      var div = document.createElement("div");
      div.className = "item-grid " + type;
      div.dataset.id = item.id;
      div.dataset.type = item.type;
      var h3 = document.createElement("h3");
      h3.className = "item-title";
      h3.textContent = item.name;
      div.appendChild(h3);
      var pDesc = document.createElement("p");
      pDesc.className = "item-description";
      pDesc.textContent = item.description || "Sem descrição";
      div.appendChild(pDesc);
      var pCount = document.createElement("p");
      pCount.className = "item-count";
      if (type === "library") {
        pCount.textContent = "Pastas: " + (item.numFolders || 0);
      } else if (type === "folder") {
        pCount.textContent = "Documentos: " + (item.numDocuments || 0);
      } else {
        pCount.textContent = "Documento";
      }
      div.appendChild(pCount);
      var pDate = document.createElement("p");
      pDate.className = "item-creation-date";
      pDate.textContent = "Criação: " + (item.creationDate || "N/A");
      div.appendChild(pDate);

      div.addEventListener("click", async () => {
        if (item.type === "document") {
          if (item.url) {
            window.open(item.url, "_blank");
          } else {
            this.displayError("URL do documento não encontrada.");
          }
          return;
        }
        if (item.type === "library") {
          this.state.currentPath = [item];
        } else if (item.type === "folder") {
          let lib = this.state.libraries.find(
            (lib) => this.findPath([lib], item.id).length > 0
          );
          if (lib) {
            this.state.currentPath = [lib, item];
          } else {
            this.state.currentPath = this.findPath(
              this.state.libraries,
              item.id
            );
          }
        }
        this.renderBreadcrumbs();
        await this.displayContent(item);
        this.saveState();
        await this.syncTreeSelection();
      });
      fragment.appendChild(div);
    });
    this.gridContainer.appendChild(fragment);
  };

  FileNavigator.prototype.updateCounters = function (node) {
    var totalResultsElement = document.getElementById("totalResults");
    var filtroSelectElement = document.getElementById("filtroselect");
    if (!totalResultsElement || !filtroSelectElement) return;
    var total = 0,
      label = "";
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
    filtroSelectElement.innerHTML = "";
    var span = document.createElement("span");
    span.textContent = label;
    filtroSelectElement.appendChild(span);
  };

  FileNavigator.prototype.saveState = function () {
    var state = {
      currentPath: this.state.currentPath.map((n) => n.id),
    };
    localStorage.setItem("fileExplorerState", JSON.stringify(state));
  };

  FileNavigator.prototype.restoreState = async function () {
    var stateStr = localStorage.getItem("fileExplorerState");
    if (!stateStr) return;
    try {
      var state = JSON.parse(stateStr);
      if (state.currentPath && state.currentPath.length > 0) {
        let newPath = [];
        let first = this.state.libraries.find(
          (n) => n.id == state.currentPath[0]
        );
        if (!first) {
          this.state.currentPath = [];
          this.renderBreadcrumbs();
          await this.displayContent({ type: "root" });
          return;
        }
        newPath.push(first);
        for (let i = 1; i < state.currentPath.length; i++) {
          let parent = newPath[newPath.length - 1];
          if (!parent.children || parent.children.length === 0) {
            if (parent.type === "library") {
              parent.children = await dataService.fetchFolders(parent.id);
            } else if (parent.type === "folder") {
              parent.children = await dataService.fetchDocuments(parent.id);
            }
          }
          let child = parent.children.find((n) => n.id == state.currentPath[i]);
          if (child) {
            newPath.push(child);
          }
        }
        if (newPath.length === state.currentPath.length) {
          this.state.currentPath = newPath;
          this.renderBreadcrumbs();
          await this.displayContent(newPath[newPath.length - 1]);
          await this.syncTreeSelection();
        } else {
          this.state.currentPath = [];
          this.renderBreadcrumbs();
          await this.displayContent({ type: "root" });
        }
      }
    } catch (e) {
      console.error("Erro ao restaurar o estado:", e);
    }
  };

  // Redefinindo findPath para evitar duplicidade
  FileNavigator.prototype.findPath = function (nodes, targetId, path) {
    path = path || [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var newPath = path.concat(node);
      if (node.id == targetId) return newPath;
      if (node.children && node.children.length > 0) {
        var result = this.findPath(node.children, targetId, newPath);
        if (result) return result;
      }
    }
    return [];
  };

  FileNavigator.prototype.handleResize = function () {
    console.log("Janela redimensionada. Estado preservado.");
    this.renderTree();
    if (this.state.currentPath.length > 0) {
      this.displayContent(
        this.state.currentPath[this.state.currentPath.length - 1]
      );
    } else {
      this.displayContent({ type: "root" });
    }
  };

  FileNavigator.prototype.resetToRoot = async function () {
    this.state.currentPath = [];
    this.renderBreadcrumbs();
    this.clearTreeSelection();
    await this.displayContent({ type: "root" });
    this.saveState();
  };

  document.addEventListener("DOMContentLoaded", function () {
    var explorer = new FileNavigator();
    explorer.init();
  });
})();
