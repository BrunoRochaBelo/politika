// Função para alimentar o modal
async function fillModalFields(contactId) {
  // Primeiro, pegamos os elementos do DOM que precisamos atualizar
  var modalImage = document.getElementById("modalImage");
  var modalInfluence = document.getElementById("modalInfluence");
  var modalNumber = document.getElementById("modalNumber");
  var modalContactType = document.getElementById("modalContactType");
  var modalName = document.getElementById("modalName");
  var modalPersonType = document.getElementById("modalPersonType");
  var modalEmail = document.getElementById("modalEmail");
  var modalError = document.getElementById("modalError"); // Novo elemento para exibir a mensagem de erro

  // Em seguida, fazemos uma solicitação ao back-end para obter os dados do contato
  try {
    const response = await fetch(`/api/contacts/${contactId}`);
    if (!response.ok) {
      throw new Error("Erro na resposta da rede");
    }
    const data = await response.json();
    // Atualizamos os elementos do DOM com os dados recebidos
    modalImage.src = data.image;
    modalInfluence.textContent = data.influence;
    modalNumber.textContent = data.number;
    modalContactType.textContent = data.contactType;
    modalName.textContent = data.name;
    modalPersonType.textContent = data.personType;
    modalEmail.textContent = data.email;
    modalError.textContent = ""; // Limpa a mensagem de erro
  } catch (error) {
    console.error("Erro:", error);
    modalError.textContent =
      "Houve um erro ao carregar os dados. Por favor, tente novamente mais tarde."; // Exibe a mensagem de erro
  }
}

// Event listener para abrir o modal quando clicar no card, mas não no ícone do telefone
document.querySelectorAll(".contatos-small-card").forEach(function (card) {
  card.addEventListener("click", async function (event) {
    // Verifique se o clique não foi no ícone do telefone
    if (!event.target.classList.contains("contatos-small-card-phone")) {
      // Obtenha o ID do contato do atributo de dados do card
      const contactId = card.querySelector(
        ".contatos-small-card-id"
      ).textContent;

      // Preencha os campos do modal com os dados do contato
      await fillModalFields(contactId);

      // Abra o modal
      document.getElementById("modal-info-contato").classList.add("show");
    }
  });
});

// Função para fechar o modal
function closeModal() {
  document.getElementById("modal-info-contato").classList.remove("show");
}

// Event listener para fechar o modal ao clicar no botão de fechar
document.querySelector(".close").addEventListener("click", closeModal);

// Event listener para fechar o modal ao clicar fora da área do modal
window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("modal-info-contato")) {
    closeModal();
  }
});

// Event listener para fechar o modal ao pressionar a tecla ESC
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Event listener para fazer uma ligação telefônica quando clicar no ícone do telefone
document
  .querySelectorAll(".contatos-small-card-phone")
  .forEach(function (phoneIcon) {
    phoneIcon.addEventListener("click", function (event) {
      // Obtenha o número de telefone do texto do elemento contatos-small-card-num
      const phoneNumber = phoneIcon.parentElement.querySelector(
        ".contatos-small-card-num"
      ).textContent;

      // Faça uma ligação telefônica
      window.location.href = `tel:${phoneNumber}`;

      // Pare a propagação do evento para evitar que o modal seja aberto
      event.stopPropagation();
    });
  });

// Função para editar o contato
function editContact(contactId) {
  // Redireciona o usuário para a página de edição do contato
  window.location.href = `/contato/put/${contactId}`;
}

// Função para excluir o contato
async function deleteContact(contactId) {
  try {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro na resposta da rede");
    }
    // Se a resposta for bem-sucedida, redirecione para a página de contatos
    window.location.href = "/contatos";
  } catch (error) {
    console.error("Erro:", error);
    alert(
      "Houve um erro ao excluir o contato. Por favor, tente novamente mais tarde."
    );
  }
}

// Adicione event listeners para os botões de editar e excluir
document.querySelector(".edit-button").addEventListener("click", function () {
  // Obtenha o ID do contato do atributo de dados do botão de edição
  const contactId = this.dataset.contactId;

  // Chame a função editContact com o ID do contato
  editContact(contactId);
});
document.querySelector(".delete-button").addEventListener("click", function () {
  // Obtenha o ID do contato do atributo de dados do botão de exclusão
  const contactId = this.dataset.contactId;

  // Chame a função deleteContact com o ID do contato
  deleteContact(contactId);
});
