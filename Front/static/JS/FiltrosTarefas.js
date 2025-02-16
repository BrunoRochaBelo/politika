// Lógica de Marcadores
const checkboxTodosMarcadores = document.getElementById("todos_marcadores");
const checkboxesMarcadores = document.querySelectorAll(
  '#filtro_marcadores input[type="checkbox"]:not(#todos_marcadores)'
);

// Função para desmarcar todos os outros marcadores quando "Todos" for selecionado
checkboxTodosMarcadores.addEventListener("change", function () {
  if (this.checked) {
    checkboxesMarcadores.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyOtherChecked(checkboxesMarcadores)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todos" marcado
    checkboxTodosMarcadores.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro marcador for selecionado
checkboxesMarcadores.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosMarcadores.checked = false;
    }
    checkIfNoneSelectedMarcadores();
  });
});

// Função para checar se nenhum marcador está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedMarcadores() {
  if (!isAnyOtherChecked(checkboxesMarcadores)) {
    checkboxTodosMarcadores.checked = true;
  }
}

// Lógica de Status
const checkboxTodosStatus = document.getElementById("todos_status");
const checkboxesStatus = document.querySelectorAll(
  '#filtro_status input[type="checkbox"]:not(#todos_status)'
);

// Função para desmarcar todos os outros status quando "Todos" for selecionado
checkboxTodosStatus.addEventListener("change", function () {
  if (this.checked) {
    checkboxesStatus.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyOtherChecked(checkboxesStatus)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todos" marcado
    checkboxTodosStatus.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro status for selecionado
checkboxesStatus.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosStatus.checked = false;
    }
    checkIfNoneSelectedStatus();
  });
});

// Função para checar se nenhum status está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedStatus() {
  if (!isAnyOtherChecked(checkboxesStatus)) {
    checkboxTodosStatus.checked = true;
  }
}

// Lógica de Período de Tempo
const checkboxTodosTempo = document.getElementById("tempo_todos");
const checkboxesTempo = document.querySelectorAll(
  '#filtro_tempo input[type="checkbox"]:not(#tempo_todos)'
);
const dataEspecificaInput = document.getElementById("data_especifica_input");
const dataInicioInput = document.getElementById("data_inicio");
const dataFimInput = document.getElementById("data_fim");

// Função para limpar os campos de data quando um período fixo é selecionado
function clearDateInputs() {
  if (dataEspecificaInput) dataEspecificaInput.value = "";
  if (dataInicioInput) dataInicioInput.value = "";
  if (dataFimInput) dataFimInput.value = "";
}

// Função para limpar "Data Específica"
function clearDataEspecifica() {
  if (dataEspecificaInput) dataEspecificaInput.value = "";
}

// Função para limpar "Data de Início" e "Data de Fim"
function clearPeriodDates() {
  if (dataInicioInput) dataInicioInput.value = "";
  if (dataFimInput) dataFimInput.value = "";
}

// Função para desmarcar todos os checkboxes de períodos fixos
function clearCheckboxesTempo() {
  checkboxesTempo.forEach((checkbox) => {
    checkbox.checked = false;
  });
  checkboxTodosTempo.checked = false;
}

// Função para checar se nenhum período de tempo está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedTempo() {
  if (!isAnyOtherChecked(checkboxesTempo) && !isAnyDateFilled()) {
    checkboxTodosTempo.checked = true;
  }
}

// Função para verificar se algum campo de data está preenchido
function isAnyDateFilled() {
  return (
    (dataEspecificaInput && dataEspecificaInput.value) ||
    (dataInicioInput && dataInicioInput.value) ||
    (dataFimInput && dataFimInput.value)
  );
}

// Função para verificar se algum outro checkbox está marcado
function isAnyOtherChecked(checkboxes) {
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
}

// Adiciona o evento para o checkbox "Todos" de períodos de tempo
checkboxTodosTempo.addEventListener("change", function () {
  if (this.checked) {
    checkboxesTempo.forEach((checkbox) => {
      checkbox.checked = false;
    });
    clearDateInputs(); // Limpa os campos de data personalizados
  } else if (!isAnyOtherChecked(checkboxesTempo) && !isAnyDateFilled()) {
    // Se nenhuma outra opção ou data estiver preenchida, mantenha o "Todos" marcado
    checkboxTodosTempo.checked = true;
  }
});

// Função para desmarcar "Todos" e garantir que apenas uma opção de período seja selecionada
checkboxesTempo.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosTempo.checked = false;
      clearDateInputs(); // Limpa os campos de data ao selecionar um período fixo
    }
    checkIfNoneSelectedTempo();
  });
});

// Adiciona event listener ao campo "Data de Início", se existir
if (dataInicioInput) {
  dataInicioInput.addEventListener("input", function () {
    if (this.value) {
      clearDataEspecifica(); // Limpa o campo de data específica ao selecionar o início de um período
      clearCheckboxesTempo(); // Desmarca todos os checkboxes de períodos
    }
  });
}

// Adiciona event listener ao campo "Data Específica", se existir
if (dataEspecificaInput) {
  dataEspecificaInput.addEventListener("input", function () {
    if (this.value) {
      clearPeriodDates(); // Limpa o início e fim do período
      clearCheckboxesTempo(); // Desmarca todos os checkboxes de períodos
    }
  });
}

// Seleção dos botões "Limpar" e "Aplicar"
const btnLimpar = document.querySelector('button[data-filter="Limpar"]');
const btnAplicar = document.querySelector('button[data-filter="Aplicar"]');

// Função para resetar todos os filtros
function resetarFiltros() {
  // Resetar Marcadores
  checkboxTodosMarcadores.checked = true;
  checkboxesMarcadores.forEach((checkbox) => (checkbox.checked = false));

  // Resetar Status
  checkboxTodosStatus.checked = true;
  checkboxesStatus.forEach((checkbox) => (checkbox.checked = false));

  // Resetar Período de Tempo
  checkboxTodosTempo.checked = true;
  checkboxesTempo.forEach((checkbox) => (checkbox.checked = false));
  clearDateInputs();

  // Resetar Responsável
  const responsavelSelect = document.getElementById("responsavel_nome");
  if (responsavelSelect) {
    responsavelSelect.value = "minhas";
  }

  // Opcional: Desmarcar opções de período específico
  if (dataInicioInput) dataInicioInput.value = "";
  if (dataFimInput) dataFimInput.value = "";
}

// Adiciona o evento de clique ao botão "Limpar"
btnLimpar.addEventListener("click", resetarFiltros);
