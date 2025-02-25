function changeSession(sessionNumber) {
  const sessions = document.querySelectorAll(".session");
  const selectedSession = document.getElementById("secao" + sessionNumber);
  const cards = document.querySelectorAll(".card-session");
  const selectedCard = cards[sessionNumber - 1];
  const areaContent = document.querySelector(
    ".area-interna-containerContent-template-content"
  );

  if (!selectedSession || !areaContent) {
    console.error("Elementos necessários não encontrados.");
    return;
  }

  const selectedHeader = selectedCard.querySelector(
    ".secao-interna-template-header"
  );
  const selectedArrow = selectedHeader.querySelector(".arrow");

  if (selectedSession.classList.contains("active")) {
    selectedSession.classList.remove("active");
    selectedHeader.classList.remove("active-header");
    selectedArrow.classList.remove("up");
    selectedArrow.classList.add("down");
    selectedCard.classList.remove("active");
  } else {
    sessions.forEach(function (session, index) {
      if (session.classList.contains("active")) {
        session.classList.remove("active");
        const card = cards[index];
        const header = card.querySelector(".secao-interna-template-header");
        const arrow = header.querySelector(".arrow");
        header.classList.remove("active-header");
        arrow.classList.remove("up");
        arrow.classList.add("down");
        card.classList.remove("active");
      }
    });

    // Scroll suave para o topo do conteúdo
    areaContent.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Ativar a sessão selecionada
    selectedSession.classList.add("active");
    selectedHeader.classList.add("active-header");
    selectedArrow.classList.remove("down");
    selectedArrow.classList.add("up");
    selectedCard.classList.add("active");
  }
}
