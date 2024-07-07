let isEditing = false;

function editOrSaveProfile() {
  const inputs = document.querySelectorAll(
    ".profile-container input, .profile-container select"
  );
  const button = document.getElementById("edit-save-button");

  if (isEditing) {
    // Validar e salvar as mudanças
    if (validateForm()) {
      inputs.forEach((input) => {
        input.disabled = true;
      });
      button.textContent = "Editar Perfil";
      saveProfile();
    }
  } else {
    // Habilitar edição
    inputs.forEach((input) => {
      input.disabled = false;
    });
    button.textContent = "Salvar Perfil";
  }

  isEditing = !isEditing;
}

function validateForm() {
  const nomeCompleto = document.getElementById("nome-completo").value.trim();
  const email = document.getElementById("email").value.trim();
  const dataNascimento = document
    .getElementById("data-nascimento")
    .value.trim();

  if (!nomeCompleto) {
    alert("Nome completo é obrigatório.");
    return false;
  }

  if (!email || !validateEmail(email)) {
    alert("E-mail inválido.");
    return false;
  }

  if (!dataNascimento || !validateDate(dataNascimento)) {
    alert("Data de nascimento inválida.");
    return false;
  }

  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validateDate(date) {
  const re = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  return re.test(date);
}

function saveProfile() {
  // Implementar a funcionalidade de salvar aqui
  alert("Perfil salvo com sucesso!");
}

let userHasActivePlan = false; // Variável para simular se o usuário tem um plano ativo
let planDetails = {
  status: "Inativo", // Status inicial
  plan: "Nenhum",
  expires: "",
  remainingTime: "",
  autoRenew: "",
};

document.addEventListener("DOMContentLoaded", function () {
  updateSubscriptionCard();
});

function updateSubscriptionCard() {
  const statusElement = document.getElementById("subscription-status");

  if (userHasActivePlan) {
    statusElement.innerText = `Status: ${planDetails.status}`;
    document.getElementById("subscription-details").style.display = "block";
    document.getElementById("subscription-options").style.display = "none";
    document.getElementById("plan").innerText = planDetails.plan;
    document.getElementById("expires").innerText = planDetails.expires;
    document.getElementById("remaining-time").innerText =
      planDetails.remainingTime;
    document.getElementById("auto-renew-status").innerText =
      planDetails.autoRenew;
    document.getElementById("initial-actions").style.display = "none";
    document.getElementById("subscription-actions").style.display = "none";
    document.getElementById("manage-actions").style.display = "block";
  } else {
    statusElement.innerText = "Status: Inativo";
    document.getElementById("subscription-details").style.display = "none";
    document.getElementById("subscription-options").style.display = "none";
    document.getElementById("initial-actions").style.display = "block";
    document.getElementById("subscription-actions").style.display = "none";
    document.getElementById("manage-actions").style.display = "none";
  }
}

function showSubscriptionOptions() {
  document.getElementById("subscription-options").style.display = "block";
  document.getElementById("initial-actions").style.display = "none";
  document.getElementById("subscription-actions").style.display = "block";

  const planSelect = document.getElementById("plan-options");
  const autoRenewRadios = document.getElementsByName("auto-renew");

  planSelect.addEventListener("change", checkSubscriptionSelection);
  autoRenewRadios.forEach((radio) =>
    radio.addEventListener("change", checkSubscriptionSelection)
  );
}

function checkSubscriptionSelection() {
  const plan = document.getElementById("plan-options").value;
  const autoRenew = Array.from(document.getElementsByName("auto-renew")).find(
    (radio) => radio.checked
  );

  if (plan && autoRenew) {
    document.getElementById("confirm-subscription-button").disabled = false;
  }
}

function confirmSubscription() {
  const selectedPlan = document.getElementById("plan-options").value;
  const selectedAutoRenew = Array.from(
    document.getElementsByName("auto-renew")
  ).find((radio) => radio.checked).value;

  userHasActivePlan = true;
  planDetails = {
    status: "Ativo",
    plan: selectedPlan,
    expires: "2025-12-31",
    remainingTime: "12 meses",
    autoRenew: selectedAutoRenew === "yes" ? "Sim" : "Não",
  };

  updateSubscriptionCard();
}

function cancelSubscription() {
  document.getElementById("subscription-options").style.display = "none";
  document.getElementById("initial-actions").style.display = "block";
  document.getElementById("subscription-actions").style.display = "none";
}

function unsubscribe() {
  userHasActivePlan = false;
  planDetails = {
    status: "Inativo",
    plan: "Nenhum",
    expires: "",
    remainingTime: "",
    autoRenew: "",
  };
  updateSubscriptionCard();
}

function editSubscription() {
  document.getElementById("plan").innerHTML = `
    <select id="edit-plan-options">
      <option value="basic">Plano Básico</option>
      <option value="premium">Plano Premium</option>
    </select>
  `;
  document.getElementById("auto-renew-status").innerHTML = `
    Renovação Automática:
    <input type="radio" name="edit-auto-renew" value="yes"> Sim
    <input type="radio" name="edit-auto-renew" value="no"> Não
  `;

  document.getElementById("edit-plan-options").value = planDetails.plan;
  document.querySelector(
    `input[name="edit-auto-renew"][value="${
      planDetails.autoRenew === "Sim" ? "yes" : "no"
    }"]`
  ).checked = true;

  document
    .getElementById("subscription-details")
    .querySelectorAll("p:not(:first-child)")
    .forEach((p) => (p.style.color = "#555"));

  document.getElementById("manage-actions").style.display = "none";
  document.getElementById("edit-actions").style.display = "block";

  const editPlanSelect = document.getElementById("edit-plan-options");
  const editAutoRenewRadios = document.getElementsByName("edit-auto-renew");

  editPlanSelect.addEventListener("change", checkEditSelection);
  editAutoRenewRadios.forEach((radio) =>
    radio.addEventListener("change", checkEditSelection)
  );
}

function checkEditSelection() {
  const plan = document.getElementById("edit-plan-options").value;
  const autoRenew = Array.from(
    document.getElementsByName("edit-auto-renew")
  ).find((radio) => radio.checked);

  if (plan && autoRenew) {
    document.getElementById("confirm-edit-button").disabled = false;
    document.getElementById("cancel-edit-button").disabled = false;
  } else {
    document.getElementById("confirm-edit-button").disabled = true;
    document.getElementById("cancel-edit-button").disabled = true;
  }
}

function confirmEdit() {
  const selectedPlan = document.getElementById("edit-plan-options").value;
  const selectedAutoRenew = Array.from(
    document.getElementsByName("edit-auto-renew")
  ).find((radio) => radio.checked).value;

  planDetails.plan = selectedPlan;
  planDetails.autoRenew = selectedAutoRenew === "yes" ? "Sim" : "Não";

  document.getElementById("edit-actions").style.display = "none";
  document.getElementById("manage-actions").style.display = "block";
  updateSubscriptionCard();
}

function cancelEdit() {
  document.getElementById("edit-actions").style.display = "none";
  document.getElementById("manage-actions").style.display = "block";
  updateSubscriptionCard();
}
