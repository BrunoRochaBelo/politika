document
  .getElementById("marcador-filter")
  .addEventListener("change", async function () {
    var selectedMarcador = this.value;
    try {
      const data = await fetchContatos(selectedMarcador);
      console.log("Dados de contatos:", data);
      // Atualize a interface do usuário com os dados recuperados
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    }
  });

async function fetchContatos(marcador) {
  try {
    const response = await fetch(`/api/contatos?marcador=${marcador}`);
    if (!response.ok) {
      throw new Error("Erro na requisição do servidor");
    }
    return response.json();
  } catch (error) {
    throw new Error("Erro ao buscar contatos:", error);
  }
}
