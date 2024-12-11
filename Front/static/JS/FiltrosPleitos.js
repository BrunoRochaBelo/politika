// Utilitário para verificar se algum checkbox está marcado
function isAnyChecked(checkboxes) {
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
}

// ==================== Lógica para Filtro de Tipo do Pleito ====================
const checkboxTipoPleitoTodos = document.getElementById("tipo_pleito_todos");
const checkboxesTipoPleito = document.querySelectorAll(
  '#filtro_tipo_pleito input[type="checkbox"]:not(#tipo_pleito_todos)'
);

// Função para desmarcar todos os outros checkboxes quando "Todos" for selecionado
checkboxTipoPleitoTodos.addEventListener("change", function () {
  if (this.checked) {
    checkboxesTipoPleito.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyChecked(checkboxesTipoPleito)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todos" marcado
    checkboxTipoPleitoTodos.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro checkbox for selecionado
checkboxesTipoPleito.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTipoPleitoTodos.checked = false;
    }
    checkIfNoneSelectedTipoPleito();
  });
});

// Função para checar se nenhum checkbox está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedTipoPleito() {
  if (!isAnyChecked(checkboxesTipoPleito)) {
    checkboxTipoPleitoTodos.checked = true;
  }
}

// ==================== Lógica para Filtro de Status ====================
const checkboxStatusTodos = document.getElementById("status_todos");
const checkboxesStatus = document.querySelectorAll(
  '#filtro_status input[type="checkbox"]:not(#status_todos)'
);

// Função para desmarcar todos os outros checkboxes quando "Todos" for selecionado
checkboxStatusTodos.addEventListener("change", function () {
  if (this.checked) {
    checkboxesStatus.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyChecked(checkboxesStatus)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todos" marcado
    checkboxStatusTodos.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro checkbox for selecionado
checkboxesStatus.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxStatusTodos.checked = false;
    }
    checkIfNoneSelectedStatus();
  });
});

// Função para checar se nenhum checkbox está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedStatus() {
  if (!isAnyChecked(checkboxesStatus)) {
    checkboxStatusTodos.checked = true;
  }
}

// ==================== Lógica para Filtro de Esfera ====================
const checkboxEsferaTodas = document.getElementById("esfera_todas");
const checkboxesEsfera = document.querySelectorAll(
  '#filtro_esfera input[type="checkbox"]:not(#esfera_todas)'
);

// Função para desmarcar todos os outros checkboxes quando "Todas" for selecionado
checkboxEsferaTodas.addEventListener("change", function () {
  if (this.checked) {
    checkboxesEsfera.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyChecked(checkboxesEsfera)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todas" marcado
    checkboxEsferaTodas.checked = true;
  }
});

// Função para desmarcar "Todas" quando qualquer outro checkbox for selecionado
checkboxesEsfera.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxEsferaTodas.checked = false;
    }
    checkIfNoneSelectedEsfera();
  });
});

// Função para checar se nenhum checkbox está selecionado e marcar "Todas" automaticamente
function checkIfNoneSelectedEsfera() {
  if (!isAnyChecked(checkboxesEsfera)) {
    checkboxEsferaTodas.checked = true;
  }
}

// ==================== Lógica para Filtro de Período ====================
const checkboxPeriodoTodos = document.getElementById("periodo_todos");
const checkboxesPeriodo = document.querySelectorAll(
  '#filtro_periodo input[type="checkbox"]:not(#periodo_todos)'
);
const dataInicioInput = document.getElementById("periodo_data_inicio");
const dataFimInput = document.getElementById("periodo_data_fim");

// Função para limpar os campos de data
function clearPeriodoDataInputs() {
  dataInicioInput.value = "";
  dataFimInput.value = "";
}

// Função para desmarcar todos os checkboxes de períodos fixos
function clearCheckboxesPeriodo() {
  checkboxesPeriodo.forEach((checkbox) => {
    checkbox.checked = false;
  });
  checkboxPeriodoTodos.checked = false;
}

// Função para verificar se algum campo de data está preenchido
function isAnyPeriodoDateFilled() {
  return (
    dataInicioInput.value.trim() !== "" || dataFimInput.value.trim() !== ""
  );
}

// Função para desmarcar "Todos" e limpar checkboxes ao selecionar um período fixo
checkboxPeriodoTodos.addEventListener("change", function () {
  if (this.checked) {
    checkboxesPeriodo.forEach((checkbox) => {
      checkbox.checked = false;
    });
    clearPeriodoDataInputs(); // Limpa os campos de data personalizados
  } else if (!isAnyChecked(checkboxesPeriodo) && !isAnyPeriodoDateFilled()) {
    // Se nenhuma outra opção ou data estiver preenchida, mantenha o "Todos" marcado
    checkboxPeriodoTodos.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro checkbox for selecionado
checkboxesPeriodo.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxPeriodoTodos.checked = false;
      clearPeriodoDataInputs(); // Limpa os campos de data ao selecionar um período fixo
    }
    checkIfNoneSelectedPeriodo();
  });
});

// Eventos para os campos de data
dataInicioInput.addEventListener("input", function () {
  if (this.value) {
    clearCheckboxesPeriodo(); // Desmarca todos os checkboxes de períodos
    checkboxPeriodoTodos.checked = false; // Desmarca "Todos"
  }
});

dataFimInput.addEventListener("input", function () {
  if (this.value) {
    clearCheckboxesPeriodo(); // Desmarca todos os checkboxes de períodos
    checkboxPeriodoTodos.checked = false; // Desmarca "Todos"
  }
});

// Função para checar se nenhum período de tempo está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedPeriodo() {
  if (!isAnyChecked(checkboxesPeriodo) && !isAnyPeriodoDateFilled()) {
    checkboxPeriodoTodos.checked = true;
  }
}

// ==================== Lógica para Filtro de Solicitante ====================
const radioSolicitanteTodos = document.getElementById("solicitante_todos");
const campoSolicitanteNome = document.getElementById("indicacao");

// Função para verificar o campo de Solicitante e ajustar o rádio "Todos"
function verificarSolicitante() {
  if (campoSolicitanteNome.value.trim() !== "") {
    radioSolicitanteTodos.checked = false;
  } else {
    radioSolicitanteTodos.checked = true;
  }
}

// Evento para quando o usuário digita no campo de Solicitante
campoSolicitanteNome.addEventListener("input", verificarSolicitante);

// ==================== Inicialização ====================
document.addEventListener("DOMContentLoaded", function () {
  // Filtro de Tipo do Pleito
  if (!isAnyChecked(checkboxesTipoPleito)) {
    checkboxTipoPleitoTodos.checked = true;
  }

  // Filtro de Status
  if (!isAnyChecked(checkboxesStatus)) {
    checkboxStatusTodos.checked = true;
  }

  // Filtro de Esfera
  if (!isAnyChecked(checkboxesEsfera)) {
    checkboxEsferaTodas.checked = true;
  }

  // Filtro de Período
  if (!isAnyChecked(checkboxesPeriodo) && !isAnyPeriodoDateFilled()) {
    checkboxPeriodoTodos.checked = true;
  }

  // Verificar o Filtro de Solicitante ao carregar a página
  verificarSolicitante();
});
