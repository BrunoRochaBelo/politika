function verificarModoEscuro() {
  if (window.matchMedia) {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isDarkMode) {
      // Modo escuro
      document.body.style.backgroundColor = "#fff"; //f5f5f5
      document.body.style.color = "#131313"; //fff

      // Mudar cor dos cards
      const cards = document.querySelectorAll(
        ".card-s, .card-m, .card-l, .card-tmf-s, .card-tmf-m, .card-tmf-l"
      );

      cards.forEach((card) => {
        card.style.backgroundColor = "#fff"; // 262626
        card.style.color = "#131313"; // DADADA
      });
      // Mudar cor dos card-select
      const selectCards = document.querySelectorAll(
        ".card-select-xs, .card-select-s, .card-select-m"
      );

      selectCards.forEach((selectCard) => {
        selectCard.style.backgroundColor = "#fff";
        selectCard.style.color = "#131313";
      });

      const marcadores = document.querySelectorAll(
        ".marcador-s, .marcador-m, .marcador-l"
      );
      marcadores.forEach((marcadores) => {
        marcadores.style.color = "#222"; // 222
      });
      // Mudar cor btn-recuar-expandir
      const btnrecuarexpandir = document.querySelectorAll(
        ".btn-recuar-expandir"
      );
      btnrecuarexpandir.forEach((recuarexpandir) => {
        recuarexpandir.style.color = "#131313"; //fff
      });
      // Mudar cor modalContent
      const modalContent = document.querySelectorAll("#modalContent");
      modalContent.forEach((modalContent) => {
        modalContent.style.backgroundColor = "#fff";
        modalContent.style.color = "#000";
      });

      // Mudar cor dos elementos select
      const selects = document.querySelectorAll("select");
      selects.forEach((select) => {
        select.style.backgroundColor = "#262626"; // Exemplo: fundo cinza escuro para os selects
        select.style.color = "#fff"; // Exemplo: texto branco para os selects
      });
    } else {
      // Modo claro
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#131313";

      // Resetar a cor dos cards para o modo claro
      const cards = document.querySelectorAll(
        ".card-s, .card-m, .card-l, .card-tmf-s, .card-tmf-m, .card-tmf-l, .card-select-xs"
      );
      cards.forEach((card) => {
        card.style.backgroundColor = "var(--cor-0)"; // Resetar para a cor original usando variável CSS
        card.style.color = ""; // Resetar para a cor original do texto
      });

      // Resetar a cor dos elementos select para o modo claro
      const selects = document.querySelectorAll("select");
      selects.forEach((select) => {
        select.style.backgroundColor = ""; // Resetar para a cor original do fundo
        select.style.color = ""; // Resetar para a cor original do texto
      });
    }
  } else {
    console.log("Este navegador não suporta a API de preferências de mídia.");
  }
}

// Chamar a função quando a página for carregada
window.onload = verificarModoEscuro;

// Adicionar um listener para o evento de mudança de perfil
// Substitua 'seuElementoDeMudancaDePerfil' pelo seletor real do seu elemento de mudança de perfil
document
  .querySelector("seuElementoDeMudancaDePerfil")
  .addEventListener("change", verificarModoEscuro);
