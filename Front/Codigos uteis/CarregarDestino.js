document.addEventListener("DOMContentLoaded", function () {
  const estadoSelect = document.getElementById("estado");

  // Chama a função carregarCidades quando o valor do estado é alterado e Enter é pressionado
  estadoSelect.addEventListener("change", carregarCidades);

  // Chama a função carregarCidades quando o elemento perde o foco
  estadoSelect.addEventListener("blur", carregarCidades);
});

function carregarCidades() {
  const estadoSelect = document.getElementById("estado");
  const estadoSelecionado = estadoSelect.value;
  console.log("Estado selecionado:", estadoSelecionado);

  if (estadoSelecionado) {
    const baseURL = window.Config ? Config.BASE_URL[Config.ENVIRONMENT] : "";
    fetch(`${baseURL}municipios/${estadoSelecionado}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Estado não encontrado");
          } else {
            throw new Error("Erro na requisição");
          }
        }
        return response.json();
      })
      .then((municipios) => {
        const arrayMunicipios = municipios.municipios || municipios;
        const cidadeSelect = document.getElementById("cidade");
        cidadeSelect.innerHTML = "";
        cidadeSelect.innerHTML =
          '<option value="" selected disabled>Selecione uma cidade</option>';
        arrayMunicipios.forEach((municipio) => {
          const option = document.createElement("option");
          option.textContent = municipio.nome;
          cidadeSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar cidades:", error);
        // adicionar lógica para mostrar uma mensagem de erro ao usuário
        // Por exemplo, erro no console ou em uma div na página
      });
  }
}
