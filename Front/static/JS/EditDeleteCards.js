document.addEventListener('DOMContentLoaded', () => {
  const notification = document.getElementById('notification');

  function showNotification(message) {
    if (!notification) return;
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  document.querySelectorAll('.edit').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showNotification('Função de edição não implementada.');
    });
  });

  document.querySelectorAll('.delete').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('li');
      if (confirm('Tem certeza que deseja excluir este item?') && card) {
        card.remove();
        showNotification('Item excluído com sucesso!');
      }
    });
  });
});
