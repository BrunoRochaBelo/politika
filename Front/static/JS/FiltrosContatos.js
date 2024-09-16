// Lógica de Tipos do Contato
const checkboxTodosTipoContato = document.getElementById("todos_tipo_contato");
const checkboxesTipoContato = document.querySelectorAll(
  '#tipo_contato input[type="checkbox"]:not(#todos_tipo_contato)'
);

checkboxTodosTipoContato.addEventListener("change", function () {
  if (this.checked) {
    checkboxesTipoContato.forEach((checkbox) => (checkbox.checked = false));
  } else if (!isAnyOtherChecked(checkboxesTipoContato)) {
    checkboxTodosTipoContato.checked = true;
  }
});

checkboxesTipoContato.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosTipoContato.checked = false;
    }
    checkIfNoneSelectedTipoContato();
  });
});

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

checkboxTodosPerfilInfluencia.addEventListener("change", function () {
  if (this.checked) {
    checkboxesPerfilInfluencia.forEach(
      (checkbox) => (checkbox.checked = false)
    );
  } else if (!isAnyOtherChecked(checkboxesPerfilInfluencia)) {
    checkboxTodosPerfilInfluencia.checked = true;
  }
});

checkboxesPerfilInfluencia.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxTodosPerfilInfluencia.checked = false;
    }
    checkIfNoneSelectedPerfilInfluencia();
  });
});

function checkIfNoneSelectedPerfilInfluencia() {
  if (!isAnyOtherChecked(checkboxesPerfilInfluencia)) {
    checkboxTodosPerfilInfluencia.checked = true;
  }
}

// Lógica para Tipo Pessoa
const radioTodosTipoPessoa = document.querySelector(
  '#tipo_pessoa input[type="radio"][value="todos"]'
);
const radioButtonsTipoPessoa = document.querySelectorAll(
  '#tipo_pessoa input[type="radio"]:not([value="todos"])'
);

radioTodosTipoPessoa.addEventListener("change", function () {
  if (this.checked) {
    radioButtonsTipoPessoa.forEach((radio) => (radio.checked = false));
  }
});

radioButtonsTipoPessoa.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      radioTodosTipoPessoa.checked = false;
    }
  });
});

// Função auxiliar para verificar se algum checkbox está marcado
function isAnyOtherChecked(checkboxes) {
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
}

// Função auxiliar para verificar se algum radio está selecionado
function isAnyRadioSelected(radioButtons) {
  return Array.from(radioButtons).some((radio) => radio.checked);
}
