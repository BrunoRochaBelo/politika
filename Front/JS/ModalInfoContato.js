// Seletores de elementos DOM
const modal = document.getElementById("modal-info-contato");
const closeBtn = document.getElementsByClassName("close")[0];
const modalImage = document.getElementById("modalImage");
const modalInfluence = document.getElementById("modalInfluence");
const modalNumber = document.getElementById("modalNumber");
const modalContactType = document.getElementById("modalContactType");
const modalName = document.getElementById("modalName");
const modalPersonType = document.getElementById("modalPersonType");
const modalEmail = document.getElementById("modalEmail");
const modalCallButton = document.getElementById("modalCallButton"); // Novo botão de ligar no modal

// Função para preencher os campos do modal com os dados do backend
function fillModalFields(contactData) {
  modalImage.src = contactData.image;
  modalInfluence.innerHTML = contactData.influence;
  modalNumber.innerHTML = contactData.number;
  modalContactType.innerHTML = contactData.contactType;
  modalName.innerHTML = contactData.name;
  modalPersonType.innerHTML = contactData.personType;
  modalEmail.innerHTML = contactData.email;
  modalCallButton.href = `tel:${contactData.number}`; // Adicione o número de telefone ao botão de ligar
}

// Função para buscar os dados do contato no backend
async function fetchContactData(contactId) {
  try {
    const response = await fetch(`/api/contacts/${contactId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Retorne um objeto com valores padrão em caso de erro
    return {
      image: "caminho/para/imagem/padrao.jpg",
      influence: "Influência não disponível",
      number: "Número não disponível",
      contactType: "Tipo de contato não disponível",
      name: "Nome não disponível",
      personType: "Tipo de pessoa não disponível",
      email: "Email não disponível",
    };
  }
}

// Função para abrir o modal
function openModal() {
  modal.classList.add("show");
}
// Função para fechar o modal
function closeModal() {
  modal.classList.remove("show");
}

// Event listener para abrir o modal quando clicar no card, mas não no ícone do telefone
document.querySelectorAll(".contatos-small-card").forEach(function (card) {
  card.addEventListener("click", async function (event) {
    // Verifique se o clique não foi no ícone do telefone
    if (!event.target.classList.contains("contatos-small-card-phone")) {
      // Obtenha o ID do contato do atributo de dados do card
      const contactId = card.dataset.contactId;

      // Busque os dados do contato do backend
      const contactData = await fetchContactData(contactId);

      // Preencha os campos do modal com os dados do contato
      fillModalFields(contactData);

      // Abra o modal
      openModal();
    }
  });
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

// Event listener para fechar o modal ao clicar no botão de fechar
closeBtn.addEventListener("click", closeModal);

// Event listener para fechar o modal ao clicar fora da área do modal
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});
// Event listener para fechar o modal ao pressionar a tecla ESC
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Seletores de elementos DOM
const modalEditButton = document.getElementById("modalEditButton");
const modalDeleteButton = document.getElementById("modalDeleteButton");

// Função para editar o contato
function editContact(contactId) {
  // Redirecione para a página de edição com o ID do contato como parâmetro
  window.location.href = `/edit-contact/${contactId}`;
}

// Função para excluir o contato
async function deleteContact(contactId) {
  // Mostre uma caixa de confirmação antes de excluir
  if (confirm("Tem certeza que deseja excluir este contato?")) {
    try {
      // Faça uma requisição DELETE para a API de contatos
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      // Verifique se a requisição foi bem sucedida
      if (response.ok) {
        alert("Contato excluído com sucesso!");
        closeModal();
      } else {
        alert("Erro ao excluir o contato. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o contato. Por favor, tente novamente.");
    }
  }
}

// Adicione event listeners para os botões de editar e excluir
modalEditButton.addEventListener("click", function () {
  editContact(modal.dataset.contactId);
});
modalDeleteButton.addEventListener("click", function () {
  deleteContact(modal.dataset.contactId);
});
