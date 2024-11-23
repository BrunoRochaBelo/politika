// Dados Mock Atualizados
const data = [
  {
    id: 1,
    type: "library",
    name: "Biblioteca A",
    description: "Descrição da Biblioteca A",
    creationDate: "2023-01-15",
    children: [
      {
        id: 11,
        type: "folder",
        name: "Pasta A1",
        description: "Descrição da Pasta A1",
        creationDate: "2023-01-20",
        children: [
          { id: 111, type: "document", name: "Documento A1-1" },
          { id: 112, type: "document", name: "Documento A1-2" },
        ],
      },
      {
        id: 12,
        type: "folder",
        name: "Pasta A2",
        description: "Descrição da Pasta A2",
        creationDate: "2023-01-25",
        children: [{ id: 121, type: "document", name: "Documento A2-1" }],
      },
    ],
  },
  {
    id: 2,
    type: "library",
    name: "Biblioteca B",
    description: "Descrição da Biblioteca B",
    creationDate: "2023-02-20",
    children: [
      {
        id: 21,
        type: "folder",
        name: "Pasta B1",
        description: "Descrição da Pasta B1",
        creationDate: "2023-02-25",
        children: [{ id: 211, type: "document", name: "Documento B1-1" }],
      },
    ],
  },
  {
    id: 3,
    type: "library",
    name: "Biblioteca C",
    description: "Descrição da Biblioteca C",
    creationDate: "2023-03-10",
    children: [], // Biblioteca sem pastas
  },
];

// Estado atual de navegação
let currentPath = [];
const breadcrumbContainer = document.querySelector(".breadcrumbs");
const gridContainer = document.querySelector(".grid-container");

// Selecionar o elemento "raiz" do breadcrumbs
const raizSpan = breadcrumbContainer.querySelector(".raiz");
raizSpan.addEventListener("click", () => {
  resetToRoot();
});

// Selecionar o elemento "raiz" da árvore de navegação
const raizTree = document.querySelector(".raiz-tree");
raizTree.addEventListener("click", () => {
  resetToRoot();
});

// Função para resetar para a raiz
function resetToRoot() {
  currentPath = [];
  renderBreadcrumbs();
  // Remover seleção de itens na árvore
  document
    .querySelectorAll(".tree-item")
    .forEach((item) => item.classList.remove("selected"));
  // Mostrar todas as bibliotecas
  displayContent({ type: "root" });
  saveState(); // Salvar estado após resetar para raiz
  resetInactivityTimer(); // Resetar o timer de inatividade
}

// Timer de inatividade (em milissegundos, ex.: 10 minutos)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutos
let inactivityTimer;

// Função para encontrar o caminho até um nó específico
function findPath(nodes, targetId, path = []) {
  for (const node of nodes) {
    const newPath = [...path, node];
    if (node.id === targetId) {
      return newPath;
    }
    if (node.children) {
      const result = findPath(node.children, targetId, newPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

// Função auxiliar para encontrar um nó pelo ID
function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// Função para salvar o estado no LocalStorage
function saveState() {
  const expandedElements = Array.from(
    document.querySelectorAll(".tree-item.expanded")
  ).map((el) => el.getAttribute("data-id"));
  const state = {
    currentPath: currentPath.map((node) => node.id),
    expandedItems: expandedElements,
  };
  localStorage.setItem("fileExplorerState", JSON.stringify(state));
  console.log("Estado salvo:", state);
}

// Função para carregar o estado do LocalStorage
function loadState() {
  const state = JSON.parse(localStorage.getItem("fileExplorerState"));
  console.log("Estado carregado:", state);
  if (state) {
    // Restaurar itens expandidos
    state.expandedItems.forEach((id) => {
      const treeItem = document.querySelector(`.tree-item[data-id='${id}']`);
      if (treeItem) {
        treeItem.classList.add("expanded");
      }
    });

    // Restaurar currentPath e seleção
    if (state.currentPath && state.currentPath.length > 0) {
      const pathNodes = state.currentPath
        .map((id) => findNodeById(data, id))
        .filter((node) => node);
      if (pathNodes.length > 0) {
        currentPath = pathNodes;
        renderBreadcrumbs();
        displayContent(pathNodes[pathNodes.length - 1]);

        // Selecionar o último item no path
        const selectedId = pathNodes[pathNodes.length - 1].id;
        const selectedItem = document.querySelector(
          `.tree-item[data-id='${selectedId}']`
        );
        if (selectedItem) {
          document
            .querySelectorAll(".tree-item")
            .forEach((item) => item.classList.remove("selected"));
          selectedItem.classList.add("selected");
        }
      }
    }
  }
}

// Função para limpar o estado no LocalStorage e resetar a interface
function clearState() {
  localStorage.removeItem("fileExplorerState");
  currentPath = [];
  renderBreadcrumbs();
  // Remover todas as expansões
  document
    .querySelectorAll(".tree-item.expanded")
    .forEach((item) => item.classList.remove("expanded"));
  // Remover todas as seleções
  document
    .querySelectorAll(".tree-item.selected")
    .forEach((item) => item.classList.remove("selected"));
  // Limpar e mostrar todas as bibliotecas
  gridContainer.innerHTML = "";
  renderGrid(data, "library");

  // Remover a classe 'no-padding' caso esteja presente
  gridContainer.classList.remove("no-padding");
}

// Função para iniciar/reiniciar o timer de inatividade
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    clearState();
  }, INACTIVITY_TIMEOUT);
}

// Função para renderizar a navegação em árvore
function renderTree(container, nodes) {
  const ul = document.createElement("ul");
  ul.classList.add("tree-container");

  nodes.forEach((node) => {
    const li = document.createElement("li");
    li.classList.add("tree-item", node.type);
    li.setAttribute("data-id", node.id);
    li.setAttribute("data-type", node.type);
    li.setAttribute("tabindex", "0"); // Para acessibilidade via teclado

    // Conteúdo do item
    const span = document.createElement("span");
    span.textContent = node.name;
    span.classList.add("node-name");
    li.appendChild(span);

    // Se o nó tiver filhos e não for um documento, adicionar o toggle
    if (node.children && node.children.length > 0 && node.type !== "document") {
      const toggle = document.createElement("span");
      toggle.classList.add("toggle-icon");
      li.appendChild(toggle);

      // Preparar container para filhos
      const childrenUl = document.createElement("ul");
      childrenUl.classList.add("tree-children");
      li.appendChild(childrenUl);

      // Renderizar filhos recursivamente
      renderTree(childrenUl, node.children);
    }

    // Evento de clique único
    li.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevenir propagação para elementos pais
      resetInactivityTimer(); // Resetar o timer de inatividade

      const itemType = node.type;

      if (itemType === "library" || itemType === "folder") {
        // Para library e folder, clicar para expandir/recolher
        if (node.children && node.children.length > 0) {
          li.classList.toggle("expanded");
          saveState(); // Salvar estado após expandir/recolher
        }
      } else if (itemType === "document") {
        // Para documentos, selecionar e exibir conteúdo
        document
          .querySelectorAll(".tree-item")
          .forEach((item) => item.classList.remove("selected"));
        li.classList.add("selected");

        // Atualizar o caminho atual
        const path = findPath(data, node.id);
        if (path) {
          currentPath = path;
          renderBreadcrumbs();
          displayContent(node);
          saveState(); // Salvar estado após seleção
        }
      }
    });

    // Evento de clique duplo para library e folder
    if (node.type === "library" || node.type === "folder") {
      li.addEventListener("dblclick", (e) => {
        e.stopPropagation(); // Prevenir propagação para elementos pais
        resetInactivityTimer(); // Resetar o timer de inatividade

        // Selecionar o item
        document
          .querySelectorAll(".tree-item")
          .forEach((item) => item.classList.remove("selected"));
        li.classList.add("selected");

        // Atualizar o caminho atual
        const path = findPath(data, node.id);
        if (path) {
          currentPath = path;
          renderBreadcrumbs();
          displayContent(node);
          saveState(); // Salvar estado após seleção
        }
      });
    }

    // Acessibilidade: teclado
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (node.type === "library" || node.type === "folder") {
          if (e.detail === 2) {
            // Duplo Enter para dblclick
            li.dispatchEvent(new Event("dblclick"));
          } else {
            // Simular clique único
            li.click();
          }
        } else if (node.type === "document") {
          li.click();
        }
      }
    });

    ul.appendChild(li);
  });

  container.appendChild(ul);
}

// Função para renderizar a main-section
function displayContent(node) {
  // Limpar conteúdo atual
  gridContainer.innerHTML = "";

  // Remove a classe 'no-padding' por padrão
  gridContainer.classList.remove("no-padding");

  if (node.type === "library") {
    // Mostrar pastas
    const folders = node.children || [];
    if (folders.length > 0) {
      renderGrid(folders, "folder");
    } else {
      const message = document.createElement("div");
      message.textContent = "Nenhuma pasta encontrada nesta biblioteca.";
      gridContainer.appendChild(message);
    }
  } else if (node.type === "folder") {
    // Mostrar documentos em tabela
    const documents = node.children || [];
    if (documents.length > 0) {
      renderDocumentTable(documents);
    } else {
      const message = document.createElement("div");
      message.textContent = "Nenhum documento encontrado nesta pasta.";
      gridContainer.appendChild(message);
    }
  } else if (node.type === "document") {
    // Mostrar detalhes do documento
    const docDiv = document.createElement("div");
    docDiv.textContent = `Detalhes do Documento: ${node.name}`;
    gridContainer.appendChild(docDiv);
  } else if (node.type === "root") {
    // Mostrar todas as bibliotecas
    renderGrid(data, "library");
  }

  saveState(); // Salvar estado após atualizar o conteúdo
}

// Função para renderizar o grid na main-section
function renderGrid(items, type) {
  items.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item-grid", type);
    div.setAttribute("data-id", item.id);
    div.setAttribute("data-type", item.type);

    if (item.type === "library" || item.type === "folder") {
      // Criação do card da biblioteca ou pasta
      const title = document.createElement("h3");
      title.textContent = item.name;
      title.classList.add("item-title");

      const description = document.createElement("p");
      description.textContent = item.description || "";
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

      const editIconContainer = document.createElement("div");
      editIconContainer.classList.add("icone-container");

      const editIcon = document.createElement("img");
      editIcon.src = "./static/imagens/icones/editar.svg";
      editIcon.alt = "Editar";
      editIcon.classList.add("icone-editar");

      editIconContainer.appendChild(editIcon);
      editButton.appendChild(editIconContainer);

      editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        alert(`Editar ${item.name}`);
        // Lógica para editar
      });

      // Botão "Excluir" com ícone
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.setAttribute("aria-label", `Excluir ${item.name}`);

      const deleteIconContainer = document.createElement("div");
      deleteIconContainer.classList.add("icone-container");

      const deleteIcon = document.createElement("img");
      deleteIcon.src = "./static/imagens/icones/excluir.svg";
      deleteIcon.alt = "Excluir";
      deleteIcon.classList.add("icone-excluir");

      deleteIconContainer.appendChild(deleteIcon);
      deleteButton.appendChild(deleteIconContainer);

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
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        resetInactivityTimer();

        // Remover seleção de outros itens
        document
          .querySelectorAll(".item-grid")
          .forEach((el) => el.classList.remove("selected"));
        div.classList.add("selected");

        // Atualizar o caminho atual
        const path = findPath(data, item.id);
        if (path) {
          currentPath = path;
          renderBreadcrumbs();
          displayContent(item);
          saveState();
        }
      });
    }

    gridContainer.appendChild(div);
  });
}

// Função para renderizar a tabela de documentos
function renderDocumentTable(documents) {
  // Cria o container da tabela
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("tabela-historico");

  const table = document.createElement("table");
  table.setAttribute("id", "tabelaArquivos");

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

  documents.forEach((doc) => {
    const row = document.createElement("tr");

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

    const viewIconContainer = document.createElement("div");
    viewIconContainer.classList.add("icone-container");

    const viewIcon = document.createElement("img");
    viewIcon.src = "./static/imagens/icones/editar.svg"; // Substitua pelo ícone apropriado para "Ver" se disponível
    viewIcon.alt = "Ver";
    viewIcon.classList.add("icone-editar"); // Se houver um ícone específico para "Ver", use uma classe diferente

    viewIconContainer.appendChild(viewIcon);
    viewButton.appendChild(viewIconContainer);

    viewButton.addEventListener("click", (e) => {
      e.stopPropagation();
      resetInactivityTimer();

      // Atualizar o caminho atual
      const path = findPath(data, doc.id);
      if (path) {
        currentPath = path;
        renderBreadcrumbs();
        displayContent(doc);
        saveState();
      }
    });

    // Botão "Excluir" com ícone
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.setAttribute("aria-label", `Excluir ${doc.name}`);

    const deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("icone-container");

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "./static/imagens/icones/excluir.svg";
    deleteIcon.alt = "Excluir";
    deleteIcon.classList.add("icone-excluir");

    deleteIconContainer.appendChild(deleteIcon);
    deleteButton.appendChild(deleteIconContainer);

    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      alert(`Excluir ${doc.name}`);
      // Lógica para excluir o documento
    });

    tdAction.appendChild(viewButton);
    tdAction.appendChild(deleteButton);
    row.appendChild(tdAction);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  // Adiciona a tabela ao container principal
  gridContainer.appendChild(tableContainer);

  // Adiciona a classe 'no-padding' ao grid-container
  gridContainer.classList.add("no-padding");
}

// Função para renderizar Breadcrumbs
function renderBreadcrumbs() {
  // Seleciona todos os elementos de breadcrumb após o "raiz" e os remove
  const breadcrumbs = breadcrumbContainer.querySelectorAll("span:not(.raiz)");
  breadcrumbs.forEach((breadcrumb) => breadcrumb.remove());

  // Verifica se há um caminho atual para adicionar
  if (currentPath.length > 0) {
    currentPath.forEach((node, index) => {
      // Adicionar separador " > " antes de cada item
      const separator = document.createElement("span");
      separator.textContent = " > ";
      breadcrumbContainer.appendChild(separator);

      const span = document.createElement("span");
      span.textContent = node.name;
      span.style.color = "var(--cor-primaria-1)";
      span.style.cursor = "pointer";
      span.addEventListener("click", () => {
        // Atualizar o caminho atual até este ponto
        currentPath = currentPath.slice(0, index + 1);
        renderBreadcrumbs();
        displayContent(node);
        saveState(); // Salvar estado após seleção via breadcrumb
        resetInactivityTimer(); // Resetar o timer de inatividade

        // Selecionar o item correspondente na árvore
        const treeItem = document.querySelector(
          `.tree-item[data-id='${node.id}']`
        );
        if (treeItem) {
          document
            .querySelectorAll(".tree-item")
            .forEach((item) => item.classList.remove("selected"));
          treeItem.classList.add("selected");

          // Expandir todos os pais
          currentPath.forEach((parentNode) => {
            const parentLi = document.querySelector(
              `.tree-item[data-id='${parentNode.id}']`
            );
            if (
              parentLi &&
              !parentLi.classList.contains("expanded") &&
              parentNode.type !== "document"
            ) {
              parentLi.classList.add("expanded");
            }
          });

          saveState(); // Salvar estado após expandir os pais
        }
      });
      breadcrumbContainer.appendChild(span);
    });
  }
}

// Função para alternar filtro (exemplo de funcionalidade)
function toggleOcultarExibirFiltro() {
  const filtro = document.querySelector(".container-filtros-template-content");
  if (filtro.style.display === "none") {
    filtro.style.display = "block";
  } else {
    filtro.style.display = "none";
  }
}

// Inicializar a navegação em árvore e carregar o estado
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".lista-vertical-fil");
  if (container) {
    container.innerHTML = ""; // Garantir que está vazio
    renderTree(container, data);
  }

  // Carregar o estado após renderizar a árvore
  loadState();

  // Se não houver caminho atual, mostrar a raiz
  if (currentPath.length === 0) {
    displayContent({ type: "root" });
  }

  // Iniciar o timer de inatividade
  resetInactivityTimer();
});
