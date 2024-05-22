document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchFormDestino");
  const modal = document.getElementById("modalDestino");
  const closeModal = document.getElementsByClassName("close")[0];
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  searchForm.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  estadoSelect.addEventListener("change", () => {
    const estado = estadoSelect.value;
    cidadeSelect.innerHTML =
      '<option value="" selected disabled>Carregando cidades...</option>';

    // Simular carregamento dinâmico das cidades
    setTimeout(() => {
      cidadeSelect.innerHTML =
        '<option value="" selected disabled>Selecione uma cidade</option>';
      if (estado === "PE") {
        cidadeSelect.innerHTML +=
          '<option value="Recife">Recife</option><option value="Olinda">Olinda</option>';
      } else if (estado === "SP") {
        cidadeSelect.innerHTML +=
          '<option value="São Paulo">São Paulo</option><option value="Campinas">Campinas</option>';
      } else if (estado === "RJ") {
        cidadeSelect.innerHTML +=
          '<option value="Rio de Janeiro">Rio de Janeiro</option><option value="Niterói">Niterói</option>';
      } else if (estado === "MG") {
        cidadeSelect.innerHTML +=
          '<option value="Belo Horizonte">Belo Horizonte</option><option value="Ouro Preto">Ouro Preto</option>';
      }
    }, 1000);
  });
});
