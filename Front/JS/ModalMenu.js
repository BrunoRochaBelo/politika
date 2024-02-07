// Função para mostrar o modal
function showModal() {
  var modal = document.getElementById("userModal");
  var userPhoto = document.getElementById("userPhoto");
  var username = "Nome do Usuário";

  // Define o nome do usuário no modal
  document.getElementById("username").innerText = username;

  // Define a foto do usuário no modal
  document.getElementById("modalUserPhoto").src = userPhoto.src;

  modal.style.display = "flex";

  // Event listener para fechar o modal
  document.addEventListener("click", outsideClickListener);
}

// Função para ocultar o modal
function hideModal() {
  var modal = document.getElementById("userModal");
  var userPhoto = document.getElementById("userPhoto");

  // Exibe a foto do usuário no corpo da página
  userPhoto.style.display = "block";

  modal.style.display = "none";

  // Remove o event listener ao ocultar o modal
  document.removeEventListener("click", outsideClickListener);
}

// Função para o logout
function logout() {
  // Adicione aqui o código real para efetuar o logout
  alert("Logout realizado com sucesso!");

  window.location.href = "./login.html";
}

// Função para fechar o modal ao clicar fora do modal-content
function outsideClickListener(event) {
  var modalContent = document.querySelector(".modal-content-template");
  var userPhoto = document.getElementById("userPhoto");

  // Verifica se o clique ocorreu fora do modal-content e do ícone de usuário
  if (!modalContent.contains(event.target) && event.target !== userPhoto) {
    hideModal();
  }

  // Impede que o evento seja propagado para elementos internos ao modal-content
  event.stopPropagation();
}
