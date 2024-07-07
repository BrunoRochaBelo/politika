document.addEventListener("DOMContentLoaded", function () {
  const createAccountButton = document.querySelector(
    ".conta-corrente-create-account"
  );
  const modal = document.getElementById("modal");
  const closeButton = document.getElementById("close-button");
  const accountForm = document.getElementById("account-form");
  const cardsContainer = document.getElementById("cards");
  const modalTitle = document.getElementById("modal-title");
  const editingIdField = document.getElementById("editing-id");
  const notification = document.getElementById("notification");

  let editingCard = null;

  createAccountButton.addEventListener("click", () => {
    modal.style.display = "block";
    modalTitle.textContent = "Criar Nova Conta Corrente";
    accountForm.reset();
    editingIdField.value = "";
    clearErrors();
    editingCard = null;
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  accountForm.addEventListener("input", (event) => {
    validateInput(event.target.id);
  });

  accountForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bankCode = document.getElementById("bank-code").value;
    const bankName = document.getElementById("bank-name").value;
    const agencyNumber = document.getElementById("agency-number").value;
    const agencyName = document.getElementById("agency-name").value;
    const accountNumber = document.getElementById("account-number").value;
    const accountType = document.getElementById("account-type").value;

    if (editingCard) {
      // Editar card existente
      editingCard.querySelector(".conta-corrente-card-header h2").textContent =
        bankName;
      editingCard.querySelector(".conta-corrente-card-body").innerHTML = `
              <p><strong>Banco:</strong> ${bankCode}</p>
              <p><strong>Agência:</strong> ${agencyNumber} ${agencyName}</p>
              <p><strong>Conta:</strong> ${accountNumber} ${accountType}</p>
          `;
      showNotification("Conta editada com sucesso!");
      editingCard = null;
    } else {
      // Criar novo card
      const card = document.createElement("div");
      card.className = "conta-corrente-card";
      card.setAttribute("data-id", cardsContainer.children.length + 1);
      card.style.opacity = "0";

      card.innerHTML = `
              <div class="conta-corrente-card-header">
                  <h2>${bankName}</h2>
                  <span>ID: ${cardsContainer.children.length + 1}</span>
              </div>
              <div class="conta-corrente-card-body">
                  <p><strong>Banco:</strong> ${bankCode}</p>
                  <p><strong>Agência:</strong> ${agencyNumber} ${agencyName}</p>
                  <p><strong>Conta:</strong> ${accountNumber} ${accountType}</p>
              </div>
              <div class="conta-corrente-card-footer">
                  <button class="edit">Editar</button>
                  <button class="delete">Excluir</button>
              </div>
          `;

      card
        .querySelector(".edit")
        .addEventListener("click", () => editCard(card));
      card
        .querySelector(".delete")
        .addEventListener("click", () => deleteCard(card));
      cardsContainer.appendChild(card);

      // Animação para adição de card
      setTimeout(() => {
        card.style.opacity = "1";
      }, 10);

      showNotification("Conta criada com sucesso!");
    }

    modal.style.display = "none";
    accountForm.reset();
  });

  function validateInput(inputId) {
    const input = document.getElementById(inputId);
    let errorMessage = "";

    switch (inputId) {
      case "bank-code":
        if (input.value.length !== 3 || isNaN(input.value)) {
          errorMessage = "Código do banco deve ter 3 dígitos.";
        }
        break;
      case "bank-name":
        if (input.value.trim() === "") {
          errorMessage = "Nome do banco não pode ser vazio.";
        }
        break;
      case "agency-number":
        if (input.value.trim() === "" || isNaN(input.value)) {
          errorMessage = "Número da agência inválido.";
        }
        break;
      case "agency-name":
        if (input.value.trim() === "") {
          errorMessage = "Nome da agência não pode ser vazio.";
        }
        break;
      case "account-number":
        if (input.value.trim() === "" || isNaN(input.value)) {
          errorMessage = "Número da conta inválido.";
        }
        break;
      case "account-type":
        if (input.value.trim() === "") {
          errorMessage = "Tipo de conta não pode ser vazio.";
        }
        break;
    }

    const errorElement = document.getElementById(`error-${inputId}`);
    if (errorMessage) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = "block";
    } else {
      errorElement.style.display = "none";
    }
  }

  function validateForm() {
    let valid = true;
    [
      "bank-code",
      "bank-name",
      "agency-number",
      "agency-name",
      "account-number",
      "account-type",
    ].forEach((id) => {
      validateInput(id);
      const errorElement = document.getElementById(`error-${id}`);
      if (errorElement.style.display === "block") {
        valid = false;
      }
    });
    return valid;
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach((errorElement) => {
      errorElement.style.display = "none";
    });
  }

  function editCard(card) {
    editingCard = card;
    const bankCode = card
      .querySelector(".conta-corrente-card-body")
      .children[0].textContent.split(": ")[1];
    const agencyInfo = card
      .querySelector(".conta-corrente-card-body")
      .children[1].textContent.split(": ")[1]
      .split(" ");
    const accountInfo = card
      .querySelector(".conta-corrente-card-body")
      .children[2].textContent.split(": ")[1]
      .split(" ");
    const agencyNumber = agencyInfo[0];
    const agencyName = agencyInfo.slice(1).join(" ");
    const accountNumber = accountInfo[0];
    const accountType = accountInfo.slice(1).join(" ");

    document.getElementById("bank-code").value = bankCode;
    document.getElementById("bank-name").value = card.querySelector(
      ".conta-corrente-card-header h2"
    ).textContent;
    document.getElementById("agency-number").value = agencyNumber;
    document.getElementById("agency-name").value = agencyName;
    document.getElementById("account-number").value = accountNumber;
    document.getElementById("account-type").value = accountType;

    modalTitle.textContent = "Editar Conta Corrente";
    modal.style.display = "block";
  }

  function deleteCard(card) {
    card.style.opacity = "0";
    setTimeout(() => {
      cardsContainer.removeChild(card);
    }, 200); // Tempo de transição para a animação de exclusão
    showNotification("Conta excluída com sucesso!");
  }

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  // Adicionar eventos de clique para os botões "Editar" e "Excluir" do card inicial
  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".conta-corrente-card");
      editCard(card);
    });
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".conta-corrente-card");
      deleteCard(card);
    });
  });
});
