const cidadesPorEstado = {
  PE: ["Recife", "Olinda", "Caruaru"],
  SP: ["São Paulo", "Campinas", "Guarulhos"],
  RJ: ["Rio de Janeiro", "Niterói", "São Gonçalo"],
  MG: ["Belo Horizonte", "Contagem", "Uberlândia"],
};

function carregarCidades() {
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");
  const estadoSelecionado = estadoSelect.value;

  // Limpa as opções do dropdown de cidades
  cidadeSelect.innerHTML =
    '<option value="" selected disabled>Carregando...</option>';

  if (estadoSelecionado in cidadesPorEstado) {
    // Preenche o dropdown de cidades com base no estado selecionado
    const cidades = cidadesPorEstado[estadoSelecionado];
    cidadeSelect.innerHTML =
      '<option value="" selected disabled>Selecione uma cidade</option>';
    cidades.forEach((cidade) => {
      const option = document.createElement("option");
      option.value = cidade;
      option.text = cidade;
      cidadeSelect.add(option);
    });
  } else {
    cidadeSelect.innerHTML =
      '<option value="" selected disabled>Selecione um estado primeiro</option>';
  }
}
