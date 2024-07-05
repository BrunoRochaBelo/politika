document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchFormDestino");
  const modal = document.getElementById("modalDestino");
  const closeModal = document.getElementsByClassName("close")[0];
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");
  const bairroInput = document.getElementById("bairro");
  const loadingIndicator = document.getElementById("loadingEstado");

  searchForm.addEventListener("click", (event) => {
    event.preventDefault();
    modal.classList.add("show");
    modal.classList.remove("hide");
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hide");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Tempo igual ao da animação
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hide");
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300); // Tempo igual ao da animação
    }
  });

  estadoSelect.addEventListener("change", () => {
    const estado = estadoSelect.value;
    cidadeSelect.innerHTML =
      '<option value="" selected disabled>Carregando cidades...</option>';
    loadingIndicator.style.display = "block";
    cidadeSelect.disabled = true;
    bairroInput.value = "";
    bairroInput.disabled = true;

    // Simular carregamento dinâmico das cidades
    setTimeout(() => {
      cidadeSelect.innerHTML =
        '<option value="" selected disabled>Selecione uma cidade</option>';
      loadingIndicator.style.display = "none";
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
      cidadeSelect.disabled = false;
      bairroInput.disabled = false;
    }, 1000);
  });
});
