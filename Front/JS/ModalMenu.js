// Função para mostrar o modal
function showModal() {
  var modal = document.getElementById("userModal");
  var userPhoto = document.getElementById("userPhoto");
  var username = "Nome do Usuário"; // Substitua pelo nome real do usuário

  // Define o nome do usuário no modal
  document.getElementById("username").innerText = username;

  // Define a foto do usuário no modal
  document.getElementById("modalUserPhoto").src = userPhoto.src;

  modal.style.display = "flex";

  // Adiciona um event listener para fechar o modal ao clicar fora do modal-content
  document.addEventListener("click", outsideClickListener);
}

// Função para ocultar o modal
function hideModal() {
  var modal = document.getElementById("userModal");
  modal.style.display = "none";

  // Remove o event listener ao ocultar o modal
  document.removeEventListener("click", outsideClickListener);
}

// Função para simular o logout (você pode substituir com seu código real de logout)
function logout() {
  // Adicione aqui o código real para efetuar o logout
  alert("Logout realizado com sucesso!");

  // Redireciona para a página desejada após o logout
  window.location.href = "./login.html";
}

// Função para fechar o modal ao clicar fora do modal-content
function outsideClickListener(event) {
  var modalContent = document.querySelector(".modal-content");
  var userPhoto = document.getElementById("userPhoto");

  // Verifica se o clique ocorreu fora do modal-content e do ícone de usuário
  if (!modalContent.contains(event.target) && event.target !== userPhoto) {
    hideModal();
  }
}
