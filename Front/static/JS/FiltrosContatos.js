// Lógica de Tipos do Contato
const checkboxTodosTipoContato = document.getElementById("todos_tipo_contato");
const checkboxesTipoContato = document.querySelectorAll(
  '#tipo_contato input[type="checkbox"]:not(#todos_tipo_contato)'
);

// Função para desmarcar todos os outros tipos de contato quando "Todos" for selecionado
checkboxTodosTipoContato.addEventListener("change", function () {
  if (this.checked) {
    checkboxesTipoContato.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyOtherChecked(checkboxesTipoContato)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todos" marcado
    checkboxTodosTipoContato.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro tipo de contato for selecionado
checkboxesTipoContato.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosTipoContato.checked = false;
    }
    checkIfNoneSelectedTipoContato();
  });
});

// Função para checar se nenhum tipo de contato está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedTipoContato() {
  if (!isAnyOtherChecked(checkboxesTipoContato)) {
    checkboxTodosTipoContato.checked = true;
  }
}

// Lógica de Perfil de Influência
const checkboxTodosPerfilInfluencia = document.getElementById(
  "todos_perfil_influencia"
);
const checkboxesPerfilInfluencia = document.querySelectorAll(
  '#perfil_influencia input[type="checkbox"]:not(#todos_perfil_influencia)'
);

// Função para desmarcar todos os outros perfis de influência quando "Todos" for selecionado
checkboxTodosPerfilInfluencia.addEventListener("change", function () {
  if (this.checked) {
    checkboxesPerfilInfluencia.forEach(
      (checkbox) => (checkbox.checked = false)
    );
  } else if (!isAnyOtherChecked(checkboxesPerfilInfluencia)) {
    // Se nenhuma outra opção estiver marcada, mantenha o "Todos" marcado
    checkboxTodosPerfilInfluencia.checked = true;
  }
});

// Função para desmarcar "Todos" quando qualquer outro perfil de influência for selecionado
checkboxesPerfilInfluencia.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosPerfilInfluencia.checked = false;
    }
    checkIfNoneSelectedPerfilInfluencia();
  });
});

// Função para checar se nenhum perfil de influência está selecionado e marcar "Todos" automaticamente
function checkIfNoneSelectedPerfilInfluencia() {
  if (!isAnyOtherChecked(checkboxesPerfilInfluencia)) {
    checkboxTodosPerfilInfluencia.checked = true;
  }
}

// Função auxiliar para verificar se algum checkbox está marcado
function isAnyOtherChecked(checkboxes) {
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
}
