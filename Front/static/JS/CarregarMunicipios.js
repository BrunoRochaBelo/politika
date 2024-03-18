// Definindo a função globalmente
window.carregarCidades = function (estado) {
  const selectCidade = document.getElementById("cidade");

  if (!estado) {
    selectCidade.innerHTML =
      '<option value="" selected disabled>Selecione um estado primeiro</option>';
    return;
  }

  fetch(`http://192.168.1.4:5000/municipios/${estado}`)
    .then((response) => response.json())
    .then((data) => {
      selectCidade.innerHTML =
        '<option value="" selected disabled>Selecione uma cidade</option>';

      data.municipios.forEach((cidadeObj) => {
        const option = document.createElement("option");
        option.value = cidadeObj.nome;
        option.textContent = cidadeObj.nome;
        selectCidade.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar as cidades:", error);
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const selectEstado = document.getElementById("estado");

  selectEstado.addEventListener("change", function () {
    const estadoSelecionado = this.value;
    carregarCidades(estadoSelecionado);
  });
});
